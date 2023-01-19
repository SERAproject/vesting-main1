import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useSWR, { SWRResponse } from "swr";
import { DataType } from "../utils";

function getBlockNumber(library: Web3Provider): () => Promise<number> {
  return async (): Promise<number> => {
    return library.getBlockNumber();
  };
}

export function useBlockNumber(): SWRResponse<number, any> {
  const { library } = useWeb3React();

  const shouldFetch = !!library;

  return useSWR(shouldFetch ? [DataType.BlockNumber] : null, getBlockNumber(library), {
    refreshInterval: 10 * 1000,
  });
}
