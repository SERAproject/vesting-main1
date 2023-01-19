import { formatUnits } from "@ethersproject/units";
import { BigNumberish } from "ethers";

export function shortenHex(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(hex.length - length)}`;
}

export const CHAIN_ID_NAMES: { [key: number]: string } = {
  1: "Mainnet",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Görli",
  42: "Kovan",
  97: "bsctestnet",
  56: "bsc",
};

export const INFURA_PREFIXES: { [key: number]: string } = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan",
  97: "bsctestnet",
  56: "bsc",
};

export const COIN_SYMBOLS: { [key: number]: string } = {
  1: "ETH",
  3: "ETH",
  4: "ETH",
  5: "ETH",
  42: "ETH",
  97: "BNB",
  56: "BNB",
};

const ETHERSCAN_PREFIXES = {
  1: "",
  3: "ropsten.etherscan",
  4: "rinkeby.etherscan.",
  5: "goerli.etherscan.",
  42: "kovan.etherscan.",
  97: "testnet..bscscan.",
  56: "bscscan.",
};

export const parseBalance = (balance: BigNumberish, decimals = 18, decimalstoDisplay = 3) =>
  Number(formatUnits(balance, decimals)).toFixed(decimalstoDisplay);

export enum DataType {
  BlockNumber,
  ETHBalance,
  Address,
  TokenBalance,
  Symbol,
}

export function formatEtherscanLink(type: "Account" | "Transaction", data: [number, string]) {
  switch (type) {
    case "Account": {
      const [chainId, address] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}io/address/${address}`;
    }
    case "Transaction": {
      const [chainId, hash] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}io/tx/${hash}`;
    }
  }
}

export function secondsToDhms(seconds: number): string {
  const mo = Math.floor(seconds / (3600 * 24) / 30);
  const d = Math.floor((seconds / (3600 * 24)) % 30);
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const moDisplay = mo > 0 ? mo + (mo == 1 ? " month. " : " months. ") : "";
  const dDisplay = d > 0 ? d + (d == 1 ? " day. " : " days. ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hour. " : " hours. ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " minute. " : " minutes. ") : "";
  const sDisplay = s > 0 ? s + (s == 1 ? " second." : " seconds.") : "";
  return moDisplay + dDisplay + hDisplay + mDisplay + sDisplay;
}
