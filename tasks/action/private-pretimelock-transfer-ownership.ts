import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { TokenPreTimelock } from "../../src/types";

task("action:private-pretimelock-transfer-ownership")
  .addParam("newOwner", "new owner account address")
  .setAction(async function (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
    const privatePreTimeLock = <TokenPreTimelock>await hre.ethers.getContract("PrivateSalePreTimeLock");
    const { deployer } = await hre.ethers.getNamedSigners();

    const tx = await privatePreTimeLock.connect(deployer).transferOwnership(taskArguments.newOwner);
    await tx.wait(1);

    console.log("New Owner of privatePreTimeLock");
    console.log(await privatePreTimeLock.owner());
  });
