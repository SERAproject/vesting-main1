import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { TokenPreVesting } from "../../src/types";

task("action:private-prevesting-transfer-ownership")
  .addParam("newOwner", "new owner account address")
  .setAction(async function (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
    const privatePreVesting = <TokenPreVesting>await hre.ethers.getContract("PrivateSalePreVesting");
    const { deployer } = await hre.ethers.getNamedSigners();

    const tx = await privatePreVesting.connect(deployer).transferOwnership(taskArguments.newOwner);
    await tx.wait(1);

    console.log("New Owner of privatePreVesting");
    console.log(await privatePreVesting.owner());
  });
