import useSWR, { SWRResponse } from "swr";
import { ChainId, Token, TokenAmount } from "@uniswap/sdk";
import { BigNumberish, Contract } from "ethers";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";
import { addresses, desiredChain } from "../constants";
import { useContract } from "./useContract";
import { DataType } from "../utils";
import { ERC20, ERC20__factory } from "../src/types";

function getTokenBalance(contract: Contract, token: Token): (address: string) => Promise<TokenAmount> {
  return async (address: string): Promise<TokenAmount> =>
    contract
      .balanceOf(address)
      .then((balance: { toString: () => string }) => new TokenAmount(token, balance.toString()));
}

export function useTokenBalance(
  chainId: number = desiredChain.chainId,
  address?: string | null,
  token?: string | null,
  suspense = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): SWRResponse<TokenAmount, any> {
  // const { chainId } = useWeb3React();
  if (token == null) {
    token = addresses[chainId as number].ERC20_TOKEN_ADDRESS;
  }
  const contract = useContract(token as string, ERC20__factory.abi);

  const result = useSWR(
    typeof address === "string" && contract ? [address, chainId, token, DataType.TokenBalance] : null,
    getTokenBalance(contract as Contract, new Token(chainId as ChainId, token, 18)),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getTokenBalanceSimple(contract: Contract): (address: string) => Promise<string> {
  return async (address: string): Promise<string> =>
    contract.balanceOf(address).then((balance: BigNumberish) => balance.toString());
}

export function useTokenBalanceSimple(
  chainId: number = desiredChain.chainId,
  address?: string | null,
  token?: string | null,
  suspense = false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): SWRResponse<any, any> {
  // const { chainId } = useWeb3React();
  if (token == null) {
    token = addresses[chainId as number].ERC20_TOKEN_ADDRESS;
  }
  const contract = <ERC20>useContract(token as string, ERC20__factory.abi);

  const result = useSWR(
    typeof address === "string" && contract ? [address, chainId, token, DataType.ETHBalance] : null,
    getTokenBalanceSimple(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}
