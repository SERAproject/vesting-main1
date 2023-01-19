import { BigNumber, BigNumberish } from "ethers";
import { useWeb3React } from "@web3-react/core";
import useSWR, { SWRResponse } from "swr";
import { TokenPreVesting, TokenPreVesting__factory } from "../src/types";
import { useContract } from "./useContract";
import { DataType } from "../utils";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";

//creating vesting schedule from dashboard page -- bulk
export function useCreateBulkVestingSchedule(
  preVestingContractAddress: string,
  beneficiaries: string[],
  cliffs: string[],
  durations: BigNumberish[],
  slicePeriodSeconds: BigNumberish[],
  revocables: boolean[],
  amounts: BigNumberish[],
  tges: BigNumberish[],
): any {
  const contract = <TokenPreVesting>useContract(preVestingContractAddress, TokenPreVesting__factory.abi, true);
  return async () => {
    return contract["createVestingSchedule(address[],uint256[],uint256[],uint256[],bool[],uint256[],uint256[])"](
      beneficiaries,
      cliffs,
      durations,
      slicePeriodSeconds,
      revocables,
      amounts,
      tges,
    );
  };
}

function getVestingSchedulesCountByBeneficiary(contract: TokenPreVesting): (address: string) => Promise<number> {
  return async (address: string): Promise<number> =>
    contract.getVestingSchedulesCountByBeneficiary(address).then((result: any) => result.toNumber());
}

export function useVestingScheduleCountBeneficiary(
  vesting: string,
  address?: string | null,
  suspense = false,
): SWRResponse<any, any> {
  const { chainId } = useWeb3React();
  const contract = <TokenPreVesting>useContract(vesting, TokenPreVesting__factory.abi);

  const result: any = useSWR(
    typeof address === "string" && contract ? [address, chainId, vesting, DataType.TokenBalance] : null,
    getVestingSchedulesCountByBeneficiary(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getVestingScheduleByAddressAndIndex(
  account: string,
  index: string,
  contract: TokenPreVesting,
): (address: string) => Promise<string> {
  return async (): Promise<string> =>
    contract
      .getVestingScheduleByAddressAndIndex(account, index)
      .then((result: TokenPreVesting.VestingScheduleStructOutput) => result.toString());
}

export function useVestingScheduleByAddressAndIndex(
  account: string,
  vesting: string,
  index: string,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(vesting, TokenPreVesting__factory.abi, true);
  const result: any = useSWR(
    contract ? [vesting, account, index, "VestingScheduleByAddressAndIndex", DataType.Address] : null,
    getVestingScheduleByAddressAndIndex(account as string, index, contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result && result.data && result.data.split(",");
}

function getComputeVestingScheduleIdForAddressAndIndex(
  account: string,
  index: string,
  contract: TokenPreVesting,
): (address: string) => Promise<string> {
  return async (): Promise<string> =>
    contract.computeVestingScheduleIdForAddressAndIndex(account, index).then((result: string) => result.toString());
}

export function useComputeVestingScheduleIdForAddressAndIndex(
  account: string,
  vesting: string,
  index: string,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(vesting, TokenPreVesting__factory.abi, true);
  const result: any = useSWR(
    contract ? [vesting, index, account, "getComputeVestingScheduleIdForAddressAndIndex", DataType.Address] : null,
    getComputeVestingScheduleIdForAddressAndIndex(account, index, contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getComputeReleasableAmount(
  scheduleId: string,
  contract: TokenPreVesting,
): (address: string) => Promise<string> {
  return async (): Promise<string> =>
    contract.computeReleasableAmount(scheduleId).then((result: BigNumber) => result.toString());
}

function getTimeStampSet(contract: TokenPreVesting): (address: string) => Promise<boolean> {
  return async (): Promise<boolean> => contract.timestampSet().then((result: boolean) => result);
}

export function useComputeReleasableAmount(
  vesting: string,
  vestingScheduleId: string,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(vesting, TokenPreVesting__factory.abi, true);
  const result: any = useSWR(
    contract ? [vesting, vestingScheduleId, "getComputeReleasableAmount", DataType.Address] : null,
    getComputeReleasableAmount(vestingScheduleId, contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

export function useRelease(vesting: string, scheduleId: string, amount: string): any {
  const contract = <TokenPreVesting>useContract(vesting, TokenPreVesting__factory.abi, true);
  return async () => {
    return contract.release(scheduleId, amount).then((result: any) => result);
  };
}

export function useSetTimeStamp(vesting: string, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(vesting, TokenPreVesting__factory.abi, true);
  const result: any = useSWR(contract ? [vesting, "timestampset", Boolean] : null, getTimeStampSet(contract), {
    suspense,
  });
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

//Fetching owner --
export function usePreVestingFetchOwner(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "vestingOwner", contractAddress, DataType.Address] : null,
    getOwner(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getOwner(contract: TokenPreVesting): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.owner().then((result: string) => result.toString());
}

//Fetching Token ---
export function usePreVestingToken(contractAddress: string, chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "vestingToken", contractAddress, DataType.Address] : null,
    getToken(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getToken(contract: TokenPreVesting): (address: string) => Promise<string> {
  return async (): Promise<string> => contract.getToken().then((result: string) => result.toString());
}

// Timestamp
export function useTimestampStatusVesting(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "vestingTimestamp", contractAddress, DataType.Address] : null,
    getTimestampStatus(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getTimestampStatus(contract: TokenPreVesting): (address: string) => Promise<boolean> {
  return async (): Promise<boolean> => contract.timestampSet().then((result: boolean) => result);
}

// Initial Timestamp
export function useTimestampInitialStatusVesting(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "vestingInitialStatus", contractAddress, DataType.Address] : null,
    getTimestampInitialStatus(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getTimestampInitialStatus(contract: TokenPreVesting): (address: string) => Promise<any> {
  return async (): Promise<any> => contract.initialTimestamp().then((result: any) => BigNumber.from(result).toNumber());
}

//Start
export function useStartPreVesting(contractAddress: string, chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "vestingStart", contractAddress, DataType.Address] : null,
    getStartTime(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getStartTime(contract: TokenPreVesting): (address: string) => Promise<any> {
  return async (): Promise<any> => contract.start().then((result: any) => BigNumber.from(result).toNumber());
}

//Vesting schedules total amount
export function useVestingScheduleTotalAmt(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "vestingTotalAmount", contractAddress, DataType.TokenBalance] : null,
    getVestingSchedulesTotalAmt(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getVestingSchedulesTotalAmt(contract: TokenPreVesting): (address: string) => Promise<string> {
  return async (): Promise<string> =>
    contract.getVestingSchedulesTotalAmount().then((result: BigNumber) => result.toString());
}

//Vesting schedules total count
export function useVestingScheduleTotalCount(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "vestingTotalCount", contractAddress, DataType.Address] : null,
    getVestingSchedulesCount(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getVestingSchedulesCount(contract: TokenPreVesting): (address: string) => Promise<any> {
  return async (): Promise<any> =>
    contract.getVestingSchedulesCount().then((result: any) => BigNumber.from(result).toNumber());
}

//Withdrawable amount
export function useWithdrawableAmt(contractAddress: string, chainId: number, suspense = false): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "vestingWithdrawableAmt", contractAddress, DataType.Address] : null,
    getWithdrawAmt(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getWithdrawAmt(contract: TokenPreVesting): (address: string) => Promise<any> {
  return async (): Promise<any> =>
    contract.getWithdrawableAmount().then((result: any) => BigNumber.from(result).toNumber());
}

//WRITE CALLS
//setting timeperiod value in setTimestamp function
export function useSetTimestampPreVesting(contractAddress: string, timePeriod: number): any {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi, true);
  return async () => {
    return contract.setTimestamp(timePeriod);
  };
}

//transfer ownership
export function useTransferOwnershipVesting(contractAddress: string, newOwnerAddress: string): any {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi, true);
  return async () => {
    return contract.transferOwnership(newOwnerAddress);
  };
}

//withdraw
export function useVestingWithdraw(contractAddress: string, amount: BigNumber): any {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi, true);
  return async () => {
    return contract.withdraw(amount);
  };
}

//revoke
export function useRevoke(contractAddress: string, vestingScheduleId: string): any {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi, true);
  return async () => {
    return contract.revoke(vestingScheduleId);
  };
}

//all incoming deposits finalised or not?
function getIncomingDepositStatus(contract: TokenPreVesting): (address: string) => Promise<boolean> {
  return async (): Promise<boolean> => contract.allIncomingDepositsFinalised().then((result: boolean) => result);
}

export function useIncomingDepositsFinalisedPreVesting(
  contractAddress: string,
  chainId: number,
  suspense = false,
): SWRResponse<any, any> {
  const contract = <TokenPreVesting>useContract(contractAddress, TokenPreVesting__factory.abi);
  const result: any = useSWR(
    contract ? [chainId, "allIncomingDepositsFinalizedStatus", contractAddress, DataType.Address] : null,
    getIncomingDepositStatus(contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

function getStart(contract: TokenPreVesting): () => Promise<string> {
  return async (): Promise<string> => contract.start().then((result: BigNumber) => result.toString());
}

export function useStart(vesting: string, suspense = false): SWRResponse<string, any> {
  const contract = <TokenPreVesting>useContract(vesting, TokenPreVesting__factory.abi, true);
  const result: any = useSWR(contract ? [vesting, "start", Boolean] : null, getStart(contract), {
    suspense,
  });
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}
