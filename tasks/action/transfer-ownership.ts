import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("action:transfer-ownership")
  .addParam("newOwner", "new owner account address")
  .setAction(async function ({ newOwner }: TaskArguments, hre: HardhatRuntimeEnvironment) {
    await hre.run("action:ido-transfer-ownership", {
      newOwner,
    });
    await hre.run("action:private-pretimelock-transfer-ownership", {
      newOwner,
    });
    await hre.run("action:private-prevesting-transfer-ownership", {
      newOwner,
    });
    await hre.run("action:seed-pretimelock-transfer-ownership", {
      newOwner,
    });
    await hre.run("action:seed-prevesting-transfer-ownership", {
      newOwner,
    });
  });
