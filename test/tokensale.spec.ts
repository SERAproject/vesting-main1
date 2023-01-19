import hre, { ethers } from "hardhat";
import { waffle, artifacts } from "hardhat";
import chai, { expect } from "chai";
import { parseEther } from "@ethersproject/units";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import { Artifact } from "hardhat/types";
import { getAddress } from "@ethersproject/address";
import { solidity } from "ethereum-waffle";
import { ERC20, TokenSale, TokenVesting } from "../src/types";
import { Signers } from "./types";
import { BigNumber } from "ethers";

const BUSD_BSC_ADDRESS = getAddress("0xe9e7cea3dedca5984780bafc599bd69add087d56");
const USDT_BSC_ADDRESS = getAddress("0x55d398326f99059ff775485246999027b3197955");
const BUSD_BSC_WHALE_ADDRESS = getAddress("0xa6e866304cbab8eff79d761a65464154680aac58");
const USDT_BSC_WHALE_ADDRESS = getAddress("0x86320f26f4876d3fed94f513d841be97097c6814");
const SERA_BSC_ADDRESS = getAddress("0x31640330cd2337e57c9591a2a183ac4e8a754e87");
const SERA_BSC_WHALE_ADDRESS = getAddress("0x259e5B83c31d7e21da61eD9944b76224C3988309");

chai.use(solidity);

describe("TokenSale", function () {
  before(async function () {
    const { owner, admin, alice, bob, charlie, beneficiary } = await ethers.getNamedSigners();
    this.signers = {} as Signers;
    this.signers.admin = admin;
    this.signers.owner = owner;
    this.signers.alice = alice;
    this.signers.bob = bob;
    this.signers.charlie = charlie;
    this.signers.beneficiary = beneficiary;
    this.busd = <ERC20>await hre.ethers.getContractAt("ERC20", BUSD_BSC_ADDRESS);
    this.usdt = <ERC20>await hre.ethers.getContractAt("ERC20", USDT_BSC_ADDRESS);
    this.token = <ERC20>await hre.ethers.getContractAt("ERC20", SERA_BSC_ADDRESS);
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [BUSD_BSC_WHALE_ADDRESS],
    });
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [USDT_BSC_WHALE_ADDRESS],
    });
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [SERA_BSC_WHALE_ADDRESS],
    });
    const busdSigner: SignerWithAddress = await ethers.getSigner(BUSD_BSC_WHALE_ADDRESS);
    const usdtSigner: SignerWithAddress = await ethers.getSigner(USDT_BSC_WHALE_ADDRESS);
    const seraSigner: SignerWithAddress = await ethers.getSigner(SERA_BSC_WHALE_ADDRESS);
    //fund whale wallet with gas
    await this.signers.admin.sendTransaction({ to: BUSD_BSC_WHALE_ADDRESS, value: parseEther("1") });
    await this.signers.admin.sendTransaction({ to: USDT_BSC_WHALE_ADDRESS, value: parseEther("1") });
    await this.signers.admin.sendTransaction({ to: SERA_BSC_WHALE_ADDRESS, value: parseEther("1") });
    // fund admin wallet with tokens
    await this.busd.connect(busdSigner).transfer(this.signers.admin.address, parseEther("10000"));
    await this.usdt.connect(usdtSigner).transfer(this.signers.admin.address, parseEther("10000"));
    await this.token.connect(seraSigner).transfer(this.signers.admin.address, parseEther("100000"));
    // deploy token sale
    const tokenSaleArtifacts: Artifact = await artifacts.readArtifact("TokenSale");
    this.tokenSale = <TokenSale>(
      await waffle.deployContract(this.signers.owner, tokenSaleArtifacts, [
        this.token.address,
        this.usdt.address,
        this.busd.address,
      ])
    );
    // send SERA to owner
    await this.token.connect(this.signers.admin).transfer(this.signers.owner.address, parseEther("100000"));
    // approve tokenSale as spender
    await this.token.connect(this.signers.owner).approve(this.tokenSale.address, parseEther("100000"));
    // token vesting
    this.tokenVesting = <TokenVesting>await hre.ethers.getContractAt("TokenVesting", await this.tokenSale.vesting());
  });

  describe("TokenSale", function () {
    it("default values for tokenSale", async function () {
      expect(await this.tokenSale.token()).to.eq(this.token.address);
      expect(await this.tokenSale.coinsSold()).to.eq("0");
      expect(await this.tokenSale.USDT()).to.eq(this.usdt.address);
      expect(await this.tokenSale.BUSD()).to.eq(this.busd.address);
      expect(await this.tokenSale.exchangePriceUSDT()).to.eq("120000000000000000");
      expect(await this.tokenSale.exchangePriceBUSD()).to.eq("120000000000000000");
      expect(await this.tokenSale.cliff()).to.eq("7776000");
      expect(await this.tokenSale.duration()).to.eq("46656000");
      expect(await this.tokenSale.vesting()).to.be.properAddress;
      expect(await this.tokenSale.availableAtTGE()).to.eq("200");
      expect(await this.tokenSale.saleStatus()).to.eq(0);
    });
    it("default values for token vesting", async function () {
      expect(await this.tokenVesting.getToken()).to.eq(this.token.address);
    });
    it("tokensale setter function protection", async function () {
      await expect(this.tokenSale.connect(this.signers.charlie).setExchangePriceUSDT("0")).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(this.tokenSale.connect(this.signers.charlie).setExchangePriceBUSD("0")).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(this.tokenSale.connect(this.signers.charlie).setCliff("0")).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(this.tokenSale.connect(this.signers.charlie).setDuration("0")).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(this.tokenSale.connect(this.signers.charlie).setSaleStatus("0")).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(this.tokenSale.connect(this.signers.charlie).setAvailableAtTGE("0")).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(this.tokenSale.connect(this.signers.charlie).withdraw("0")).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(this.tokenSale.connect(this.signers.charlie).withdrawBUSD()).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(this.tokenSale.connect(this.signers.charlie).withdrawUSDT()).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(
        this.tokenSale
          .connect(this.signers.charlie)
          .createVestingSchedule(this.signers.beneficiary.address, 0, 0, 0, 0, false, 0, 0),
      ).to.revertedWith("Ownable: caller is not the owner");
      await expect(this.tokenSale.connect(this.signers.charlie).endSale()).to.revertedWith(
        "Ownable: caller is not the owner",
      );
      await expect(
        this.tokenSale
          .connect(this.signers.charlie)
          .revoke("0xabcd1234abcd1234abcd1234abcd1234abcde12341a2b3c4d5e6f12345fdecba"),
      ).to.revertedWith("Ownable: caller is not the owner");
    });
    it("buy function protection when sale is not started", async function () {
      await expect(this.tokenSale.connect(this.signers.charlie).buyTokensUsingBUSD("0")).to.revertedWith("1");
      await expect(this.tokenSale.connect(this.signers.charlie).buyTokensUsingUSDT("0")).to.revertedWith("1");
    });
    it("owner can start sale", async function () {
      await this.tokenSale.connect(this.signers.owner).setSaleStatus(1);
      expect(await this.tokenSale.saleStatus()).to.eq(1);
    });
    it("fail if no minimum amount BUSD", async function () {
      await this.busd.connect(this.signers.admin).transfer(this.signers.alice.address, parseEther("2000"));
      await this.busd.connect(this.signers.alice).approve(this.tokenSale.address, parseEther("2000"));
      await expect(this.tokenSale.connect(this.signers.alice).buyTokensUsingBUSD(parseEther("200"))).to.revertedWith(
        "3",
      );
    });
    it("buy token for BUSD when sale starts", async function () {
      const busdExchangePrice = await this.tokenSale.exchangePriceBUSD();
      const availableAtTGE = await this.tokenSale.availableAtTGE();
      const expectedTokensForBUSD = parseEther("2000").mul(BigNumber.from(10).pow("18")).div(busdExchangePrice);
      const expectedTokenAtTGE = expectedTokensForBUSD.mul(availableAtTGE).div("10000");
      expect(await this.tokenSale.computeTokensForBUSD(parseEther("2000"))).to.eq(expectedTokensForBUSD);
      const seraBalanceOfTokenVestingBefore = await this.token.balanceOf(this.tokenVesting.address);
      const coinsSoldBefore = await this.tokenSale.coinsSold();
      await expect(this.tokenSale.connect(this.signers.alice).buyTokensUsingBUSD(parseEther("2000")))
        .emit(this.tokenSale, "Sold")
        .withArgs(this.signers.alice.address, expectedTokensForBUSD);
      expect(await this.token.balanceOf(this.signers.alice.address)).to.eq(expectedTokenAtTGE);
      const seraBalanceOfTokenVestingAfter = await this.token.balanceOf(this.tokenVesting.address);
      expect(seraBalanceOfTokenVestingAfter).to.eq(
        expectedTokensForBUSD.add(seraBalanceOfTokenVestingBefore).sub(expectedTokenAtTGE),
      );
      const coinsSoldAfter = await this.tokenSale.coinsSold();
      expect(coinsSoldAfter).to.eq(coinsSoldBefore.add(expectedTokensForBUSD));
    });
    it("fail if no minimum amount USDT", async function () {
      await this.usdt.connect(this.signers.admin).transfer(this.signers.bob.address, parseEther("2000"));
      await this.usdt.connect(this.signers.bob).approve(this.tokenSale.address, parseEther("2000"));
      await expect(this.tokenSale.connect(this.signers.bob).buyTokensUsingUSDT(parseEther("200"))).to.revertedWith("3");
    });
    it("buy token for USDT when sale starts", async function () {
      const usdtExchangePrice = await this.tokenSale.exchangePriceUSDT();
      const availableAtTGE = await this.tokenSale.availableAtTGE();
      const expectedTokensForUSDT = parseEther("2000").mul(BigNumber.from(10).pow("18")).div(usdtExchangePrice);
      const expectedTokenAtTGE = expectedTokensForUSDT.mul(availableAtTGE).div("10000");
      expect(await this.tokenSale.computeTokensForUSDT(parseEther("2000"))).to.eq(expectedTokensForUSDT);
      const seraBalanceOfTokenVestingBefore = await this.token.balanceOf(this.tokenVesting.address);
      const coinsSoldBefore = await this.tokenSale.coinsSold();
      await expect(this.tokenSale.connect(this.signers.bob).buyTokensUsingUSDT(parseEther("2000")))
        .emit(this.tokenSale, "Sold")
        .withArgs(this.signers.bob.address, expectedTokensForUSDT);
      expect(await this.token.balanceOf(this.signers.bob.address)).to.eq(expectedTokenAtTGE);
      const seraBalanceOfTokenVestingAfter = await this.token.balanceOf(this.tokenVesting.address);
      expect(seraBalanceOfTokenVestingAfter).to.eq(
        expectedTokensForUSDT.add(seraBalanceOfTokenVestingBefore).sub(expectedTokenAtTGE),
      );
      const coinsSoldAfter = await this.tokenSale.coinsSold();
      expect(coinsSoldAfter).to.eq(coinsSoldBefore.add(expectedTokensForUSDT));
    });
    it("endsale", async function () {
      await this.token.connect(this.signers.owner).transfer(this.tokenVesting.address, parseEther("5000"));
      const expectedBUSD = await this.busd.balanceOf(this.tokenSale.address);
      const expectedUSDT = await this.usdt.balanceOf(this.tokenSale.address);
      const expectedSERA = (await this.token.balanceOf(this.tokenVesting.address)).sub(
        await this.tokenVesting.getVestingSchedulesTotalAmount(),
      );
      const busdBefore = await this.busd.balanceOf(this.signers.owner.address);
      const usdtBefore = await this.usdt.balanceOf(this.signers.owner.address);
      const seraBefore = await this.token.balanceOf(this.signers.owner.address);
      await this.tokenSale.connect(this.signers.owner).endSale();
      const busdAfter = await this.busd.balanceOf(this.signers.owner.address);
      const usdtAfter = await this.usdt.balanceOf(this.signers.owner.address);
      const seraAfter = await this.token.balanceOf(this.signers.owner.address);
      expect(busdAfter).to.eq(expectedBUSD.add(busdBefore));
      expect(usdtAfter).to.eq(expectedUSDT.add(usdtBefore));
      expect(seraAfter).to.eq(expectedSERA.add(seraBefore));
      expect(await this.tokenSale.saleStatus()).to.eq(0);
    });
    it("setters", async function () {
      await this.tokenSale.connect(this.signers.owner).setExchangePriceUSDT("1");
      await this.tokenSale.connect(this.signers.owner).setExchangePriceBUSD("1");
      await this.tokenSale.connect(this.signers.owner).setCliff("1");
      await this.tokenSale.connect(this.signers.owner).setDuration("1");
      await this.tokenSale.connect(this.signers.owner).setSaleStatus("0");
      await this.tokenSale.connect(this.signers.owner).setAvailableAtTGE("1");

      expect(await this.tokenSale.exchangePriceUSDT()).to.eq("1");
      expect(await this.tokenSale.exchangePriceBUSD()).to.eq("1");
      expect(await this.tokenSale.cliff()).to.eq("1");
      expect(await this.tokenSale.duration()).to.eq("1");
      expect(await this.tokenSale.availableAtTGE()).to.eq("1");
      expect(await this.tokenSale.saleStatus()).to.eq(0);
    });
  });
});
