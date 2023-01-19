import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "@nomiclabs/hardhat-etherscan";

import "./tasks/accounts";
import "./tasks/deploy";
import "./tasks/action";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  bsctestnet: 97,
  bsc: 56,
};

// Ensure that we have all the environment variables we need.
const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const infuraApiKey: string | undefined = process.env.INFURA_API_KEY;
if (!infuraApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

function getNetworkUrl(network: keyof typeof chainIds): string {
  switch (network) {
    case "bsctestnet": {
      return "https://data-seed-prebsc-1-s1.binance.org:8545";
    }
    case "bsc": {
      return "https://bsc-dataseed.binance.org/";
    }
    default:
      return "https://" + network + ".infura.io/v3/" + infuraApiKey;
  }
}

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url: string = getNetworkUrl(network);
  return {
    accounts: process.env.PK?.split(","),
    chainId: chainIds[network],
    url,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  namedAccounts: {
    owner: 1,
    deployer: 0,
    admin: 2,
    alice: 3,
    bob: 4,
    charlie: 5,
    beneficiary: 6,
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
      forking: {
        blockNumber: 15159641,
        url: process.env.BSCSCAN_ARCHIVE_NODE_URL as string,
      },
      chainId: chainIds.hardhat,
    },
    goerli: getChainConfig("goerli"),
    kovan: getChainConfig("kovan"),
    rinkeby: getChainConfig("rinkeby"),
    ropsten: getChainConfig("ropsten"),
    bsctestnet: getChainConfig("bsctestnet"),
    bsc: getChainConfig("bsc"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.9",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: "src/types",
    target: "ethers-v5",
  },
  etherscan: {
    apiKey: process.env.BSCSCAN_API_KEY,
  },
};

export default config;
