import { BigNumber, BigNumberish } from "ethers";
import useSWR, { SWRResponse } from "swr";
import { useContract } from "./useContract";
import { TokenPreTimelock__factory, TokenPreTimelock } from "../src/types";
import { DataType } from "../utils";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";

//desposit tokens in bulk
export function useBulkDepositTokens(tokenPreTimeLockAddress: string, address: string[], amounts: BigNumber[]): any {
  const contract = <TokenPreTimelock>useContract(tokenPreTimeLockAddress, TokenPreTimelock__factory.abi, true);
  return async () => {
    return contract.bulkDepositTokens(address, amounts).then((result: any) => result);
  };
}

//Fetching owner --
export function usePreTimelockFetchOwner(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreTimelock>useContract(contractAddress, TokenPreTimelock__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "timelockOwner", contractAddress, DataType.Address] : null,
    getOwner(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getOwner(contract: TokenPreTimelock): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.owner().then((result: string) => result.toString());
}

//Fetching token --
export function usePreTimelockToken(contractAddress: string, chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreTimelock>useContract(contractAddress, TokenPreTimelock__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "timelockToken", contractAddress, DataType.Address] : null,
    getToken(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getToken(contract: TokenPreTimelock): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.getToken().then((result: string) => result.toString());
}

// Timestamp
export function useTimestampStatus(contractAddress: string, chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreTimelock>useContract(contractAddress, TokenPreTimelock__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "timelockStatus", contractAddress, DataType.Address] : null,
    getTimestampStatus(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getTimestampStatus(contract: TokenPreTimelock): (address: string) => Promise<boolean> {
  return async (): Promise<boolean> => contract.timestampSet().then((result: any) => result);
}

//Timetamp initial value
export function useTimestampInitialStatus(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreTimelock>useContract(contractAddress, TokenPreTimelock__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "timelockInitialStatus", contractAddress, DataType.Address] : null,
    getTimestampInitialStatus(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getTimestampInitialStatus(contract: TokenPreTimelock): (address: string) => Promise<any> {
  return async (): Promise<any> => contract.initialTimestamp().then((result: any) => BigNumber.from(result).toNumber());
}

// time period
export function useTimeperiodValue(contractAddress: string, chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreTimelock>useContract(contractAddress, TokenPreTimelock__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "timelockPeriod", contractAddress, DataType.Address] : null,
    getTimeperiod(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

//setting timeperiod value in setTimestamp function
export function useSetTimestampPreTimelock(contractAddress: string, timePeriod: number): any {
  const contract = <TokenPreTimelock>useContract(contractAddress, TokenPreTimelock__factory.abi, true);
  return async () => {
    return contract.setTimestamp(timePeriod);
  };
}

//transfer ownership
export function useTransferOwnershipTimelock(contractAddress: string, newOwnerAddress: string): any {
  const contract = <TokenPreTimelock>useContract(contractAddress, TokenPreTimelock__factory.abi, true);
  return async () => {
    return contract.transferOwnership(newOwnerAddress);
  };
}

//transfer accidentally locked tokens
export function useTransferAccidentallyLockedTokens(contractAddress: string, token: string, amount: BigNumberish): any {
  const contract = <TokenPreTimelock>useContract(contractAddress, TokenPreTimelock__factory.abi, true);
  return async () => {
    return contract.transferAccidentallyLockedTokens(token, amount);
  };
}
//transfer timelocked tokens
export function useTransferTimeLockedTokensAfterTimePeriod(
  tokenPreTimeLockAddress: string,
  token: string,
  to: string,
  amount: BigNumber,
): any {
  const contract = <TokenPreTimelock>useContract(tokenPreTimeLockAddress, TokenPreTimelock__factory.abi, true);
  return async () => {
    return contract.transferTimeLockedTokensAfterTimePeriod(token, to, amount).then((result: any) => result);
  };
}

function getTimeStampSet(contract: TokenPreTimelock): () => Promise<boolean> {
  return async (): Promise<boolean> => contract.timestampSet().then((result: boolean) => result);
}

export function useTimestampSet(timelock: string, suspense = false): SWRResponse<boolean, any> {
  const contract = <TokenPreTimelock>useContract(timelock, TokenPreTimelock__factory.abi, true);
  const result: any = useSWR(contract ? [timelock, "timestampset", Boolean] : null, getTimeStampSet(contract), {
    suspense,
  });
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getAlreadyWithdrawn(contract: TokenPreTimelock, account: string): () => Promise<BigNumber> {
  return async (): Promise<BigNumber> => contract.alreadyWithdrawn(account).then((result: BigNumber) => result);
}

export function useAlreadyWithdrawn(timelock: string, account: string, suspense = false): SWRResponse<BigNumber, any> {
  const contract = <TokenPreTimelock>useContract(timelock, TokenPreTimelock__factory.abi, true);
  const result: any = useSWR(
    contract ? [timelock, "alreadywithdrawn", DataType.TokenBalance] : null,
    getAlreadyWithdrawn(contract, account),
    {
      suspense,
    },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getBalances(contract: TokenPreTimelock, account: string): () => Promise<BigNumber> {
  return async (): Promise<BigNumber> => contract.balances(account).then((result: BigNumber) => result);
}

export function useBalances(timelock: string, account: string, suspense = false): SWRResponse<BigNumber, any> {
  const contract = <TokenPreTimelock>useContract(timelock, TokenPreTimelock__factory.abi, true);
  const result: any = useSWR(
    contract ? [timelock, "balances", DataType.TokenBalance] : null,
    getBalances(contract, account),
    {
      suspense,
    },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getInitialTimestamp(contract: TokenPreTimelock): () => Promise<string> {
  return async (): Promise<string> => contract.initialTimestamp().then((result: BigNumber) => result.toString());
}

export function useInitialTimestamp(timelock: string, suspense = false): SWRResponse<BigNumber, any> {
  const contract = <TokenPreTimelock>useContract(timelock, TokenPreTimelock__factory.abi, true);
  const result: any = useSWR(
    contract ? [timelock, "initialtimestamp", DataType.TokenBalance] : null,
    getInitialTimestamp(contract),
    {
      suspense,
    },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getTimeperiod(contract: TokenPreTimelock): () => Promise<number> {
  return async (): Promise<number> => contract.timePeriod().then((result: BigNumber) => result.toNumber());
}

export function useTimeperiod(timelock: string, suspense = false): SWRResponse<number, any> {
  const contract = <TokenPreTimelock>useContract(timelock, TokenPreTimelock__factory.abi, true);
  const result: any = useSWR(
    contract ? [timelock, "timeperiod", DataType.TokenBalance] : null,
    getTimeperiod(contract),
    {
      suspense,
    },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

//all incoming deposits finalised or not?
function getIncomingDepositStatus(contract: TokenPreTimelock): (address: string) => Promise<boolean> {
  return async (): Promise<boolean> => contract.allIncomingDepositsFinalised().then((result: boolean) => result);
}

export function useIncomingDepositsFinalisedTimelock(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreTimelock>useContract(contractAddress, TokenPreTimelock__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "allIncomingDepositsFinalizedStatus", contractAddress, DataType.Address] : null,
    getIncomingDepositStatus(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}
