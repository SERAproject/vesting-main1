import useSWR, { SWRResponse } from "swr";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";
import { addresses, desiredChain } from "../constants";
import { useContract } from "./useContract";
import { DataType } from "../utils";
import { ERC20, ERC20__factory } from "../src/types";

function getTokenDecimals(contract: ERC20): () => Promise<string> {
  return async (): Promise<string> => contract.decimals().then((result: number) => result.toString());
}

export function useTokenDecimals(
  chainId: number = desiredChain.chainId,
  token?: string | null,
  suspense = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): SWRResponse<string, any> {
  // const { chainId } = useWeb3React();
  if (token == null) {
    token = addresses[chainId as number].ERC20_TOKEN_ADDRESS;
  }
  const contract = <ERC20>useContract(token as string, ERC20__factory.abi);

  const result = useSWR(contract ? ["decimal", chainId, token, DataType.Symbol] : null, getTokenDecimals(contract), {
    suspense,
  });
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}
