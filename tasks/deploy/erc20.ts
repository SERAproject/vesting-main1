import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { Token } from "../../src/types/Token";
import { Token__factory } from "../../src/types/factories/Token__factory";
import { waitforme } from "../../helpers/utils";

task("deploy:erc20")
  .addParam("name", "name of the token")
  .addParam("symbol", "symbol of the token")
  .addParam("totalSupply", "total supply of the token")
  .setAction(async function (taskArguments: TaskArguments, { ethers, run, getChainId }) {
    const tokenFactory: Token__factory = <Token__factory>await ethers.getContractFactory("Token");
    const token: Token = <Token>(
      await tokenFactory.deploy(taskArguments.name, taskArguments.symbol, taskArguments.totalSupply)
    );
    await token.deployed();
    console.log("Token deployed to: ", token.address);
    const chainId = await getChainId();
    if (!["1337", "31337"].includes(chainId)) {
      await waitforme(20000);
      await run("verify:verify", {
        address: token.address,
        constructorArguments: [taskArguments.name, taskArguments.symbol, taskArguments.totalSupply],
        contract: "contracts/Token.sol:Token",
      });
    }
  });
