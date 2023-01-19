import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
  const namedAccounts: { [name: string]: string } = await hre.getNamedAccounts();
  const unnamedAccounts: string[] = await hre.getUnnamedAccounts();
  console.log("Named accounts : ", namedAccounts);
  console.log("Unnamed accounts : ", unnamedAccounts);
});
