import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { TokenPreTimelock } from "../../src/types";

task("action:seed-pretimelock-transfer-ownership")
  .addParam("newOwner", "new owner account address")
  .setAction(async function (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
    const seedPreTimeLock = <TokenPreTimelock>await hre.ethers.getContract("SEEDPreTimeLock");
    const { deployer } = await hre.ethers.getNamedSigners();

    const tx = await seedPreTimeLock.connect(deployer).transferOwnership(taskArguments.newOwner);
    await tx.wait(1);

    console.log("New Owner of seedPreTimeLock");
    console.log(await seedPreTimeLock.owner());
  });
