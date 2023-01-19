import useSWR, { SWRResponse } from "swr";
import { Contract } from "ethers";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";
import { addresses, desiredChain } from "../constants";
import { useContract } from "./useContract";
import { DataType } from "../utils";
import { ERC20__factory } from "../src/types";

function getTokenSymbol(contract: Contract): () => Promise<string> {
  return async (): Promise<string> => contract.symbol().then((result: string) => result.toString());
}

export function useTokenSymbol(
  chainId: number = desiredChain.chainId,
  token?: string | null,
  suspense = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): SWRResponse<string, any> {
  // const { chainId } = useWeb3React();
  if (token == null) {
    token = addresses[chainId as number].ERC20_TOKEN_ADDRESS;
  }
  const contract = useContract(token as string, ERC20__factory.abi);

  const result = useSWR(
    contract ? ["symbol", chainId, token, DataType.Symbol] : null,
    getTokenSymbol(contract as Contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}
