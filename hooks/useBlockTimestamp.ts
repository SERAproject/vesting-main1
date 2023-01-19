import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useSWR, { SWRResponse } from "swr";
import { DataType } from "../utils";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";

function getBlockTimestamp(library: Web3Provider): () => Promise<number> {
  return async (): Promise<number> => {
    return (await library.getBlock("latest")).timestamp;
  };
}

export function useBlockTimestamp(suspense: boolean = false): SWRResponse<number, any> {
  const { library, chainId } = useWeb3React();
  const shouldFetch = !!library;
  const result = useSWR(shouldFetch ? [chainId, DataType.BlockNumber] : null, getBlockTimestamp(library), {
    suspense,
  });
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}
