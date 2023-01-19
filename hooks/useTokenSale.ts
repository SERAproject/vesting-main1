import { useWeb3React } from "@web3-react/core";
import { BigNumber, Contract } from "ethers";
import useSWR, { SWRResponse } from "swr";
import { addresses } from "../constants";
import { TokenSale__factory, ERC20__factory, TokenSale, ERC20 } from "../src/types";
import { DataType } from "../utils";
import { useContract } from "./useContract";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";

export function useBuyTokensWithBusd(amount: any, chainId: number): any {
  const contract = useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenSale__factory.abi, true);
  return async () => {
    return (contract as Contract).buyTokensUsingBUSD(amount);
  };
}

export function useBuyTokensWithUsdt(amount: any, chainId: number): any {
  const contract = useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenSale__factory.abi, true);
  return async () => {
    return (contract as Contract).buyTokensUsingUSDT(amount);
  };
}

//setting tge value in tokensale
export function useSetAvailableAtTGE(chainId: number, availableAtTGE: number): any {
  const contract = useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenSale__factory.abi, true);
  return async () => {
    return (contract as Contract).setAvailableAtTGE(availableAtTGE);
  };
}
//setting cliff period in tokensale
export function useSetCliffPeriod(chainId: number, cliff: number): any {
  const contract = useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenSale__factory.abi, true);
  return async () => {
    return (contract as Contract).setCliff(cliff);
  };
}
//setting duration value in tokensale
export function useSetDuration(chainId: number, duration: number): any {
  const contract = useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenSale__factory.abi, true);
  return async () => {
    return (contract as Contract).setAvailableAtTGE(duration);
  };
}

function getVestingContractAddress(contract: Contract): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.vesting().then((result: string) => result.toString());
}

export function useVestingContractAddress(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenSale>useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenSale__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "vesting", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getVestingContractAddress(contract as Contract),
    { suspense },
  );
  return result;
}

//Allowance
function getTokenAllowance(account: string, contract: Contract, chainId: number): (address: string) => Promise<string> {
  return async (): Promise<string> =>
    contract
      .allowance(account, addresses[chainId as number].IDO_TOKEN_PRE_SALE)
      .then((result: BigNumber) => result.toString());
}

export function useTokenAllowance(account: string, token: string, suspense = false): SWRResponse<any, any> {
  const { chainId } = useWeb3React();
  const contract = useContract(token, ERC20__factory.abi, true);
  const result: any = useSWR(
    contract ? [chainId, token, "allowance", DataType.ETHBalance] : null,
    getTokenAllowance(account as string, contract as Contract, chainId as number),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getBUSD(contract: Contract): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.BUSD().then((result: string) => result.toString());
}

export function useBUSD(chainId: number, suspense = false): SWRResponse<any, any> {
  // const { chainId } = useWeb3React();
  const contract = useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenSale__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "busd", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getBUSD(contract as Contract),
    { suspense },
  );
  //let res: any = BigNumber.from(result.data).toNumber();
  return result;
}

function getUSDT(contract: Contract): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.USDT().then((result: string) => result.toString());
}

export function useUSDT(chainId: number, suspense = false): SWRResponse<any, any> {
  // const { chainId } = useWeb3React();
  const contract = useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenSale__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "usdt", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getUSDT(contract as Contract),
    { suspense },
  );
  //let res: any = BigNumber.from(result.data).toNumber();
  return result;
}

function getAvailableAtTGE(contract: Contract): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.availableAtTGE().then((result: string) => result.toString());
}

export function useAvailableAtTGE(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenSale__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "tge", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getAvailableAtTGE(contract as Contract),
    { suspense },
  );
  //let res: any = BigNumber.from(result.data).toNumber();
  return result;
}

export function useTxApprove(token: string, amount: BigNumber, chainId: number): any {
  const contract = <ERC20>useContract(token, ERC20__factory.abi, true);
  return async () => {
    return contract.approve(addresses[chainId as number].IDO_TOKEN_PRE_SALE, amount).then((result: any) => result);
  };
}
