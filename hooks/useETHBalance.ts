import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useSWR, { SWRResponse } from "swr";
import { Token, TokenAmount } from "@uniswap/sdk";
import { DataType } from "../utils";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";
import { ADDRESS_ZERO } from "../constants";

function getEthBalance(library: Web3Provider): (chainId: number, address: string) => Promise<TokenAmount> {
  return async (chainId: number, address: string): Promise<TokenAmount> => {
    const ETH = new Token(chainId, ADDRESS_ZERO, 18);
    return library
      .getBalance(address)
      .then((balance: { toString: () => string }) => new TokenAmount(ETH, balance.toString()));
  };
}

export function useETHBalance(address?: string | null, suspense = false): SWRResponse<TokenAmount, any> {
  const { chainId, library } = useWeb3React();

  const shouldFetch = typeof chainId === "number" && typeof address === "string" && !!library;

  const result = useSWR(shouldFetch ? [chainId, address, DataType.ETHBalance] : null, getEthBalance(library), {
    suspense,
  });
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);

  return result;
}
