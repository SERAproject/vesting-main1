import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { TokenPreVesting } from "../../src/types";

task("action:seed-prevesting-transfer-ownership")
  .addParam("newOwner", "new owner account address")
  .setAction(async function (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
    const seedPreVesting = <TokenPreVesting>await hre.ethers.getContract("SEEDPreVesting");
    const { deployer } = await hre.ethers.getNamedSigners();

    const tx = await seedPreVesting.connect(deployer).transferOwnership(taskArguments.newOwner);
    await tx.wait(1);

    console.log("New Owner of privatePreVesting");
    console.log(await seedPreVesting.owner());
  });
