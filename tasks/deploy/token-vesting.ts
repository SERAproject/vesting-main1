import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { TokenVesting__factory } from "../../src/types/factories/TokenVesting__factory";
import { TokenVesting } from "../../src/types/TokenVesting";

task("deploy:tokenvesting")
  .addParam("token", "token address")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const tokenVestingFactory: TokenVesting__factory = <TokenVesting__factory>(
      await ethers.getContractFactory("TokenVesting")
    );
    const tokenVesting: TokenVesting = <TokenVesting>await tokenVestingFactory.deploy(taskArguments.token);
    await tokenVesting.deployed();
    console.log("Token vesting deployed to: ", tokenVesting.address);
  });
