import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { Token } from "../../src/types/Token";

task("action:fundTokenVesting")
  .addParam("token", "token address")
  .addParam("tokenVesting", "Vesting contract address")
  .addParam("amount", "amount in tokens")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const erc20Instance = <Token>await ethers.getContractAt("Token", taskArguments.token);
    await erc20Instance.transfer(taskArguments.tokenVesting, taskArguments.amount);
    console.log("Balance of vesting contract is ", await erc20Instance.balanceOf(taskArguments.tokenVesting));
  });
