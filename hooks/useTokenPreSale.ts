import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import useSWR, { SWRResponse } from "swr";
import { DataType } from "../utils";
import { addresses } from "../constants";
import { ERC20, ERC20__factory, TokenPreSale, TokenPreSale__factory } from "../src/types";
import { useContract } from "./useContract";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";

export function useStartSale(chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.setSaleStatus("1");
  };
}

export function useEndSale(chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.endSale();
  };
}

export function useBuyTokensWithBusd(amount: any, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.buyTokensUsingBUSD(amount);
  };
}

export function useBuyTokensWithUsdt(amount: any, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.buyTokensUsingUSDT(amount);
  };
}

//setting tge value in tokensale
export function useSetAvailableAtTGE(chainId: number, availableAtTGE: BigNumber): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.setAvailableAtTGE(availableAtTGE);
  };
}
//setting cliff period in tokensale
export function useSetCliffPeriod(chainId: number, cliff: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.setCliff(cliff);
  };
}
//setting duration value in tokensale
export function useSetDuration(chainId: number, duration: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.setDuration(duration);
  };
}

function getVestingContractAddress(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.vesting().then((result: string) => result.toString());
}

function getTimelockContractAddress(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.timelock().then((result: string) => result.toString());
}

export function useVestingContractAddress(chainId: number, suspense = false): SWRResponse<any, any> {
  // const { chainId } = useWeb3React();
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract ? [chainId, "vesting", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getVestingContractAddress(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

export function useTimeLockContractAddress(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract ? [chainId, "timelock", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getTimelockContractAddress(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

//Allowance
function getTokenAllowance(account: string, contract: ERC20, chainId: number): (address: string) => Promise<string> {
  return async (): Promise<string> =>
    contract
      .allowance(account, addresses[chainId as number].IDO_TOKEN_PRE_SALE)
      .then((result: BigNumber) => result.toString());
}

export function useTokenAllowance(account: string, token: string, suspense = false): SWRResponse<any, any> {
  const { chainId } = useWeb3React();
  const contract = <ERC20>useContract(token, ERC20__factory.abi, true);
  const result: any = useSWR(
    contract ? [chainId, token, DataType.Address] : null,
    getTokenAllowance(account as string, contract, chainId as number),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getBUSD(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.BUSD().then((result: string) => result.toString());
}

export function useBUSD(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract ? [chainId, "busd", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getBUSD(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getUSDT(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.USDT().then((result: string) => result.toString());
}

export function useUSDT(chainId: number, suspense = false): SWRResponse<any, any> {
  // const { chainId } = useWeb3React();
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract ? [chainId, "usdt", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getUSDT(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getAvailableAtTGE(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.availableAtTGE().then((result: BigNumber) => result.toString());
}

export function useAvailableAtTGE(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract ? [chainId, "tge", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getAvailableAtTGE(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

export function useTxApprove(token: string, amount: BigNumber, chainId: number): any {
  const contract = <ERC20>useContract(token, ERC20__factory.abi, true);
  return async () => {
    return contract.approve(addresses[chainId as number].IDO_TOKEN_PRE_SALE, amount).then((result: any) => result);
  };
}

//DASHBOARD FUNCTIONALITY _ IDO TOKEN PRESALE
function getPreSaleTokenAddress(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.token().then((result: string) => result.toString());
}

export function useTokenPreSaleAddress(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract ? [chainId, "tokenPresale", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getPreSaleTokenAddress(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

//Fetching owner --
export function usePreSaleFetchOwner(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreSale>useContract(contractAddress, TokenPreSale__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "tokenPreSaleOwner", contractAddress, DataType.Address] : null,
    getOwner(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getOwner(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.owner().then((result: string) => result.toString());
}

//Coins Sold
export function usePreSaleCoinsSoldInfo(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreSale>useContract(contractAddress, TokenPreSale__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "tokenPreSaleCoinsSold", contractAddress, DataType.Address] : null,
    getCoinsSold(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getCoinsSold(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.coinsSold().then((result: BigNumber) => result.toString());
}

//Exchange Prices
export function useExchangePriceUsdt(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract
      ? [chainId, "tokenPreSaleExchangePriceUsdt", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.ETHBalance]
      : null,
    getExhangePriceUSDT(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getExhangePriceUSDT(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.exchangePriceUSDT().then((result: BigNumber) => result.toString());
}

export function useExchangePriceBusd(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract
      ? [chainId, "tokenPreSaleExchangePriceBusd", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.ETHBalance]
      : null,
    getExhangePriceBUSD(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getExhangePriceBUSD(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.exchangePriceBUSD().then((result: BigNumber) => result.toString());
}

//get duration
export function useDuration(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract
      ? [chainId, "tokenPreSaleDuration", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address]
      : null,
    getDuration(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getDuration(contract: TokenPreSale): (address: string) => Promise<any> {
  return async (): Promise<any> => contract.duration().then((result: any) => BigNumber.from(result).toNumber());
}

//get sale status
export function useGetSaleStatus(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract ? [chainId, "tokensalestatus", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getSaleStatus(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getSaleStatus(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.saleStatus().then((result: number) => result.toString());
}

//get cliff
export function useCliff(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract ? [chainId, "tokenPreSaleCliff", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address] : null,
    getCliff(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getCliff(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.cliff().then((result: BigNumber) => result.toString());
}

//get min buy amt
export function useMinBuyAmountUSDT(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract
      ? [chainId, "tokenPreSaleMinUsdt", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address]
      : null,
    getMinBuyAmtUsdt(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}
export function useMaxBuyAmountUSDT(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract
      ? [chainId, "tokenPreSaleMaxUsdt", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address]
      : null,
    getMaxBuyAmtUsdt(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}
export function useMinBuyAmountBusd(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract
      ? [chainId, "tokenPreSaleMinBusd", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address]
      : null,
    getMinBuyAmtBusd(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

export function useMaxBuyAmountBusd(chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi)
  );
  const result: any = useSWR(
    contract
      ? [chainId, "tokenPreSaleMaxBusd", addresses[chainId as number].IDO_TOKEN_PRE_SALE, DataType.Address]
      : null,
    getMaxBuyAmtBusd(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getMinBuyAmtUsdt(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.minBuyAmountUSDT().then((result: BigNumber) => result.toString());
}

function getMaxBuyAmtUsdt(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.maxBuyAmountUSDT().then((result: BigNumber) => result.toString());
}

function getMinBuyAmtBusd(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.minBuyAmountBUSD().then((result: BigNumber) => result.toString());
}

function getMaxBuyAmtBusd(contract: TokenPreSale): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.maxBuyAmountBUSD().then((result: BigNumber) => result.toString());
}

//setExchangePriceUSDT
export function useSetExchangePriceUsdt(price: BigNumber, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.setExchangePriceUSDT(price).then((result: any) => result);
  };
}

//setExchangePriceBUSD
export function useSetExchangePriceBusd(price: BigNumber, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.setExchangePriceBUSD(price).then((result: any) => result);
  };
}

//setBuyAmountRangeBUSD
export function useSetBuyAmountRangeBUSD(min: BigNumber, max: BigNumber, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.setBuyAmountRangeBUSD(min, max).then((result: any) => result);
  };
}

//setBuyAmountRangeUSDT
export function useSetBuyAmountRangeUSDT(min: BigNumber, max: BigNumber, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.setBuyAmountRangeUSDT(min, max).then((result: any) => result);
  };
}

//Withdraw BUSD
export function useWithdrawBUSD(chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.withdrawBUSD().then((result: any) => result);
  };
}

//Withdraw USDT
export function useWithdrawUSDT(chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.withdrawUSDT().then((result: any) => result);
  };
}
//Withdraw from vesting
export function useWithdrawFromVesting(amount: BigNumber, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.withdrawFromVesting(amount).then((result: any) => result);
  };
}
//Revoke
export function useRevokePreSale(vestingScheduleId: string, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.revoke(vestingScheduleId).then((result: any) => result);
  };
}

//transfer accidentally locked tokens
export function useTransferAccidentallyLockedTokensFromTimelock(
  contractAddress: string,
  token: string,
  amount: number,
): any {
  const contract = <TokenPreSale>useContract(contractAddress, TokenPreSale__factory.abi, true);
  return async () => {
    return contract.transferAccidentallyLockedTokensInTimeLock(token, amount);
  };
}

export function useSetTimestampTokenPresale(contractAddress: string, chainId: number, timePeriod: number): any {
  const contract = <TokenPreSale>useContract(contractAddress, TokenPreSale__factory.abi, true);
  return async () => {
    return contract.setTimeStamp(timePeriod);
  };
}

//transfer ownership
export function useTransferOwnershipPreSale(contractAddress: string, newOwnerAddress: string): any {
  const contract = <TokenPreSale>useContract(contractAddress, TokenPreSale__factory.abi, true);
  return async () => {
    return contract.transferOwnership(newOwnerAddress);
  };
}

//compute token for busd
export function useComputeTokensForBUSD(amount: BigNumber, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.computeTokensForBUSD(amount);
  };
}

//compute token for usdt
export function useComputeTokensForUSDT(amount: BigNumber, chainId: number): any {
  const contract = <TokenPreSale>(
    useContract(addresses[chainId as number].IDO_TOKEN_PRE_SALE, TokenPreSale__factory.abi, true)
  );
  return async () => {
    return contract.computeTokensForUSDT(amount);
  };
}
