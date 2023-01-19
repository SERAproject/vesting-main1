import useSWR, { SWRResponse } from "swr";
import { Contract } from "ethers";
// import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";
import { useContract } from "./useContract";
import { DataType } from "../utils";
import { useWeb3React } from "@web3-react/core";
import { TokenVesting__factory } from "../src/types";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";

function getVestingSchedulesCountByBeneficiary(contract: Contract): (address: string) => Promise<number> {
  return async (address: string): Promise<number> =>
    contract.getVestingSchedulesCountByBeneficiary(address).then((result: any) => result.toNumber());
}

export function useVestingScheduleCountBeneficiary(
  vesting: string,
  address?: string | null,
  suspense = false,
): SWRResponse<any, any> {
  const { chainId } = useWeb3React();
  const contract = useContract(vesting, TokenVesting__factory.abi);

  const result: any = useSWR(
    typeof address === "string" && contract ? [address, chainId, vesting, DataType.TokenBalance] : null,
    getVestingSchedulesCountByBeneficiary(contract as Contract),
    { suspense },
  );
  // useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  //let res: any = BigNumber.from(result.data).toNumber();
  return result;
}

function getVestingScheduleByBeneficiary(
  account: string,
  token: string,
  contract: Contract,
): (address: string) => Promise<number> {
  return async (): Promise<number> =>
    contract.getLastVestingScheduleForHolder(account).then((result: string) => result.toString());
}

export function useVestingScheduleBeneficiary(account: string, token: string, suspense = false): SWRResponse<any, any> {
  const { chainId } = useWeb3React();
  const contract = useContract(token, TokenVesting__factory.abi, true);
  const result: any = useSWR(
    contract ? [chainId, token, DataType.Address] : null,
    getVestingScheduleByBeneficiary(account as string, token as string, contract as Contract),
    { suspense },
  );
  // useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  //let res: any = BigNumber.from(result.data).toNumber();
  return result;
}

function getVestingScheduleByAddressAndIndex(
  account: string,
  index: string,
  contract: Contract,
): (address: string) => Promise<number> {
  return async (): Promise<number> =>
    contract.getVestingScheduleByAddressAndIndex(account, index).then((result: string) => result.toString());
}

export function useVestingScheduleByAddressAndIndex(
  account: string,
  vesting: string,
  index: string,
  suspense = false,
): SWRResponse<any, any> {
  const contract = useContract(vesting, TokenVesting__factory.abi, true);
  const result: any = useSWR(
    contract ? [vesting, DataType.Address] : null,
    getVestingScheduleByAddressAndIndex(account as string, index, contract as Contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result && result.data && result.data.split(",");
}

function getComputeVestingScheduleIdForAddressAndIndex(
  account: string,
  index: string,
  contract: Contract,
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
  const contract = useContract(vesting, TokenVesting__factory.abi, true);
  const result: any = useSWR(
    contract ? [vesting, index, DataType.Address] : null,
    getComputeVestingScheduleIdForAddressAndIndex(account, index, contract as Contract),
    { suspense },
  );
  return result;
}

function getComputeReleasableAmount(scheduleId: string, contract: Contract): (address: string) => Promise<string> {
  return async (): Promise<string> =>
    contract.computeReleasableAmount(scheduleId).then((result: string) => result.toString());
}

export function useComputeReleasableAmount(
  vesting: string,
  vestingScheduleId: string,
  suspense = false,
): SWRResponse<any, any> {
  const contract = useContract(vesting, TokenVesting__factory.abi, true);
  const result: any = useSWR(
    contract ? [vesting, vestingScheduleId, DataType.Address] : null,
    getComputeReleasableAmount(vestingScheduleId, contract as Contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  return result;
}

export function useRelease(vesting: string, scheduleId: string, amount: string): any {
  const contract = useContract(vesting, TokenVesting__factory.abi, true);
  return async () => {
    return (contract as Contract).release(scheduleId, amount).then((result: boolean) => result);
  };
}
