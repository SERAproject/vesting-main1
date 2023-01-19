import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

task("action:timestamp").setAction(async function (_, hre: HardhatRuntimeEnvironment) {
  console.log("Current time stamp ", await (await hre.ethers.getDefaultProvider().getBlock("latest")).timestamp);
});
