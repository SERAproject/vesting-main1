import abi from "ethereumjs-abi";
import { waffle, ethers, artifacts } from "hardhat";
import { expect } from "chai";
import { Token } from "../src/types";
import { MockTokenVesting } from "../src/types";
import { Artifact } from "hardhat/types";
import { Signers } from "./types";

describe("Vesting", function () {
  before(async function () {
    const { owner, admin, alice, bob, charlie, beneficiary } = await ethers.getNamedSigners();
    this.signers = {} as Signers;
    this.signers.admin = admin;
    this.signers.owner = owner;
    this.signers.alice = alice;
    this.signers.bob = bob;
    this.signers.charlie = charlie;
    this.signers.beneficiary = beneficiary;
  });
  beforeEach(async function () {
    const tokenArtifact: Artifact = await artifacts.readArtifact("Token");
    this.testToken = <Token>(
      await waffle.deployContract(this.signers.owner, tokenArtifact, ["Test Token", "TT", 1000000])
    );
  });

  describe("Vesting", function () {
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await this.testToken.balanceOf(this.signers.owner.address);
      expect(await this.testToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should vest tokens gradually", async function () {
      // deploy vesting contract
      const mockTokenVestingArtifact: Artifact = await artifacts.readArtifact("MockTokenVesting");
      this.mockTokenVesting = <MockTokenVesting>(
        await waffle.deployContract(this.signers.owner, mockTokenVestingArtifact, [this.testToken.address])
      );
      expect((await this.mockTokenVesting.getToken()).toString()).to.equal(this.testToken.address);
      // send tokens to vesting contract
      await expect(this.testToken.transfer(this.mockTokenVesting.address, 1000))
        .to.emit(this.testToken, "Transfer")
        .withArgs(this.signers.owner.address, this.mockTokenVesting.address, 1000);
      const vestingContractBalance = await this.testToken.balanceOf(this.mockTokenVesting.address);
      expect(vestingContractBalance).to.equal(1000);
      expect(await this.mockTokenVesting.getWithdrawableAmount()).to.equal(1000);

      const baseTime = 1622551248;
      const startTime = baseTime;
      const cliff = 0;
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = true;
      const amount = 100;

      // create new vesting schedule
      await this.mockTokenVesting.createVestingSchedule(
        this.signers.beneficiary.address,
        startTime,
        cliff,
        duration,
        slicePeriodSeconds,
        revokable,
        amount,
      );
      expect(await this.mockTokenVesting.getVestingSchedulesCount()).to.be.equal(1);
      expect(
        await this.mockTokenVesting.getVestingSchedulesCountByBeneficiary(this.signers.beneficiary.address),
      ).to.be.equal(1);

      // compute vesting schedule id
      const vestingScheduleId = await this.mockTokenVesting.computeVestingScheduleIdForAddressAndIndex(
        this.signers.beneficiary.address,
        0,
      );

      // check that vested amount is 0
      expect(await this.mockTokenVesting.computeReleasableAmount(vestingScheduleId)).to.be.equal(0);

      // set time to half the vesting period
      const halfTime = baseTime + duration / 2;
      await this.mockTokenVesting.setCurrentTime(halfTime);

      // check that vested amount is half the total amount to vest
      expect(
        await this.mockTokenVesting.connect(this.signers.beneficiary).computeReleasableAmount(vestingScheduleId),
      ).to.be.equal(50);

      // check that only beneficiary can try to release vested tokens
      await expect(
        this.mockTokenVesting.connect(this.signers.charlie).release(vestingScheduleId, 100),
      ).to.be.revertedWith("TokenVesting: only beneficiary and owner can release vested tokens");

      // check that beneficiary cannot release more than the vested amount
      await expect(
        this.mockTokenVesting.connect(this.signers.beneficiary).release(vestingScheduleId, 100),
      ).to.be.revertedWith("TokenVesting: cannot release tokens, not enough vested tokens");

      // release 10 tokens and check that a Transfer event is emitted with a value of 10
      await expect(this.mockTokenVesting.connect(this.signers.beneficiary).release(vestingScheduleId, 10))
        .to.emit(this.testToken, "Transfer")
        .withArgs(this.mockTokenVesting.address, this.signers.beneficiary.address, 10);

      // check that the vested amount is now 40
      expect(
        await this.mockTokenVesting.connect(this.signers.beneficiary).computeReleasableAmount(vestingScheduleId),
      ).to.be.equal(40);
      let vestingSchedule = await this.mockTokenVesting.getVestingSchedule(vestingScheduleId);

      // check that the released amount is 10
      expect(vestingSchedule.released).to.be.equal(10);

      // set current time after the end of the vesting period
      await this.mockTokenVesting.setCurrentTime(baseTime + duration + 1);

      // check that the vested amount is 90
      expect(
        await this.mockTokenVesting.connect(this.signers.beneficiary).computeReleasableAmount(vestingScheduleId),
      ).to.be.equal(90);

      // beneficiary release vested tokens (45)
      await expect(this.mockTokenVesting.connect(this.signers.beneficiary).release(vestingScheduleId, 45))
        .to.emit(this.testToken, "Transfer")
        .withArgs(this.mockTokenVesting.address, this.signers.beneficiary.address, 45);

      // owner release vested tokens (45)
      await expect(this.mockTokenVesting.connect(this.signers.owner).release(vestingScheduleId, 45))
        .to.emit(this.testToken, "Transfer")
        .withArgs(this.mockTokenVesting.address, this.signers.beneficiary.address, 45);
      vestingSchedule = await this.mockTokenVesting.getVestingSchedule(vestingScheduleId);

      // check that the number of released tokens is 100
      expect(vestingSchedule.released).to.be.equal(100);

      // check that the vested amount is 0
      expect(
        await this.mockTokenVesting.connect(this.signers.beneficiary).computeReleasableAmount(vestingScheduleId),
      ).to.be.equal(0);

      // check that anyone cannot revoke a vesting
      await expect(this.mockTokenVesting.connect(this.signers.bob).revoke(vestingScheduleId)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
      await this.mockTokenVesting.revoke(vestingScheduleId);

      /*
       * TEST SUMMARY
       * deploy vesting contract
       * send tokens to vesting contract
       * create new vesting schedule (100 tokens)
       * check that vested amount is 0
       * set time to half the vesting period
       * check that vested amount is half the total amount to vest (50 tokens)
       * check that only beneficiary can try to release vested tokens
       * check that beneficiary cannot release more than the vested amount
       * release 10 tokens and check that a Transfer event is emitted with a value of 10
       * check that the released amount is 10
       * check that the vested amount is now 40
       * set current time after the end of the vesting period
       * check that the vested amount is 90 (100 - 10 released tokens)
       * release all vested tokens (90)
       * check that the number of released tokens is 100
       * check that the vested amount is 0
       * check that anyone cannot revoke a vesting
       */
    });

    it("Should release vested tokens if revoked", async function () {
      // deploy vesting contract
      const mockTokenVestingArtifact: Artifact = await artifacts.readArtifact("MockTokenVesting");
      this.mockTokenVesting = <MockTokenVesting>(
        await waffle.deployContract(this.signers.owner, mockTokenVestingArtifact, [this.testToken.address])
      );
      expect((await this.mockTokenVesting.getToken()).toString()).to.equal(this.testToken.address);
      // send tokens to vesting contract
      await expect(this.testToken.transfer(this.mockTokenVesting.address, 1000))
        .to.emit(this.testToken, "Transfer")
        .withArgs(this.signers.owner.address, this.mockTokenVesting.address, 1000);

      const baseTime = 1622551248;
      const startTime = baseTime;
      const cliff = 0;
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = true;
      const amount = 100;

      // create new vesting schedule
      await this.mockTokenVesting.createVestingSchedule(
        this.signers.beneficiary.address,
        startTime,
        cliff,
        duration,
        slicePeriodSeconds,
        revokable,
        amount,
      );

      // compute vesting schedule id
      const vestingScheduleId = await this.mockTokenVesting.computeVestingScheduleIdForAddressAndIndex(
        this.signers.beneficiary.address,
        0,
      );

      // set time to half the vesting period
      const halfTime = baseTime + duration / 2;
      await this.mockTokenVesting.setCurrentTime(halfTime);

      await expect(this.mockTokenVesting.revoke(vestingScheduleId))
        .to.emit(this.testToken, "Transfer")
        .withArgs(this.mockTokenVesting.address, this.signers.beneficiary.address, 50);
    });

    it("Should compute vesting schedule index", async function () {
      // deploy vesting contract
      const mockTokenVestingArtifact: Artifact = await artifacts.readArtifact("MockTokenVesting");
      this.mockTokenVesting = <MockTokenVesting>(
        await waffle.deployContract(this.signers.owner, mockTokenVestingArtifact, [this.testToken.address])
      );
      const expectedVestingScheduleId = getSoliditySHA3Hash(
        ["address", "uint256"],
        [this.signers.beneficiary.address, 0],
      );
      expect(
        (
          await this.mockTokenVesting.computeVestingScheduleIdForAddressAndIndex(this.signers.beneficiary.address, 0)
        ).toString(),
      ).to.equal(expectedVestingScheduleId);
      expect(
        (
          await this.mockTokenVesting.computeNextVestingScheduleIdForHolder(this.signers.beneficiary.address)
        ).toString(),
      ).to.equal(expectedVestingScheduleId);
    });

    it("Should check input parameters for createVestingSchedule method", async function () {
      // deploy vesting contract
      const mockTokenVestingArtifact: Artifact = await artifacts.readArtifact("MockTokenVesting");
      this.mockTokenVesting = <MockTokenVesting>(
        await waffle.deployContract(this.signers.owner, mockTokenVestingArtifact, [this.testToken.address])
      );
      await this.testToken.transfer(this.mockTokenVesting.address, 1000);
      const time = Date.now();
      await expect(
        this.mockTokenVesting.createVestingSchedule(this.signers.beneficiary.address, time, 0, 0, 1, false, 1),
      ).to.be.revertedWith("TokenVesting: duration must be > 0");
      await expect(
        this.mockTokenVesting.createVestingSchedule(this.signers.beneficiary.address, time, 0, 1, 0, false, 1),
      ).to.be.revertedWith("TokenVesting: slicePeriodSeconds must be >= 1");
      await expect(
        this.mockTokenVesting.createVestingSchedule(this.signers.beneficiary.address, time, 0, 1, 1, false, 0),
      ).to.be.revertedWith("TokenVesting: amount must be > 0");
    });
  });
});

export function getSoliditySHA3Hash(argTypes: string[], args: any[]): string {
  const soliditySHA3Hash = "0x" + abi.soliditySHA3(argTypes, args).toString("hex");
  return soliditySHA3Hash;
}
