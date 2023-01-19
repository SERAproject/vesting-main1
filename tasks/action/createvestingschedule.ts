import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { TokenVesting } from "../../src/types/TokenVesting";

task("action:createVestingSchedule")
  .addParam("tokenVesting", "Token vesting contract address")
  .addParam("beneficiary", "address of the beneficiary to whom vested tokens are transferred")
  .addParam("start", "start time of vesting period")
  .addParam("cliff", "duration in seconds of the cliff in which tokens will begin to vest")
  .addParam("duration", "duration in seconds of the period in which the tokens will vest")
  .addParam("revocable", "whether the vesting is revocable or not")
  .addParam("amount", "total amount of tokens to be released at the end of the vesting")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const tokenVestingInstance = <TokenVesting>await ethers.getContractAt("TokenVesting", taskArguments.tokenVesting);
    await tokenVestingInstance.createVestingSchedule(
      taskArguments.beneficiary,
      taskArguments.start,
      taskArguments.cliff,
      taskArguments.duration,
      "1",
      taskArguments.revocable,
      taskArguments.amount,
    );
  });
