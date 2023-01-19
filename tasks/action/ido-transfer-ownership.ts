import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { TokenPreSale } from "../../src/types";

task("action:ido-transfer-ownership")
  .addParam("newOwner", "new owner account address")
  .setAction(async function (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) {
    const tokenPreSale = <TokenPreSale>await hre.ethers.getContract("IDOTokenPreSale");
    const { deployer } = await hre.ethers.getNamedSigners();

    const tx = await tokenPreSale.connect(deployer).transferOwnership(taskArguments.newOwner);
    await tx.wait(1);

    console.log("New Owner of IDOTokenPreSale");
    console.log(await tokenPreSale.owner());
  });
