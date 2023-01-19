import useSWR, { SWRResponse } from "swr";
import { Contract } from "ethers";
import { useKeepSWRDATALiveAsBlocksArrive } from "./useKeepSWRDATALiveAsBlocksArrive";
import { useContract } from "./useContract";
import { DataType } from "../utils";
import { useWeb3React } from "@web3-react/core";
import { TokenVesting__factory } from "../src/types";

function computeStartDate(contract: Contract): (address: string) => Promise<string> {
  return async (address: string): Promise<string> =>
    contract.getLastVestingScheduleForHolder(address).then((result: string) => result);
}
// function computeCliff (contract: Contract): (address: string) => Promise<any> {
//   return async (address: string): Promise<any> => contract.getLastVestingScheduleForHolder(address).then((result: any) => result.cliff.toNumber())
// }
// function computeDuration (contract: Contract): (address: string) => Promise<any> {
//   return async (address: string): Promise<any> => contract.getLastVestingScheduleForHolder(address).then((result: any) => result.duration.toNumber())
// }
export function useStart(vesting, address?: string | null, suspense = false): SWRResponse<any, any> {
  const { chainId } = useWeb3React();

  const contract = useContract(vesting, TokenVesting__factory.abi);

  const result: any = useSWR(
    typeof address === "string" && contract ? [address, chainId, vesting, DataType.TokenBalance] : null,
    computeStartDate(contract as Contract),
    { suspense },
  );
  useKeepSWRDATALiveAsBlocksArrive(result.mutate);
  // console.log("Result:", result.data);
  // const startdate: number = BigNumber.from(result.data[3]).toNumber();
  // const cliff: number = BigNumber.from(result.data[2]).toNumber();
  // const duration: number = BigNumber.from(result.data[4]).toNumber();
  // const startFormat: string = moment.unix(startdate).format("dddd, MMMM Do, YYYY h:mm:ss A");
  // const cliffFormat: string = moment.unix(cliff).format("dddd, MMMM Do, YYYY h:mm:ss A");
  // const durationFormat: string = moment.unix(duration).format("dddd, MMMM Do, YYYY h:mm:ss A");
  // console.log("start date:", startFormat);
  // console.log("cliff:", cliffFormat);
  // console.log("duration:", durationFormat);

  return result;
}
// export function useDuration (address?: string[] | null, suspense = false): SWRResponse<any, any> {
//   const { chainId } = useWeb3React();

//   const contract = useContract(PRIVATE_SALE_ADDRESS, PSABI);

//   const result: any = useSWR(
//     typeof address === "string" && contract ? [address, chainId, PRIVATE_SALE_ADDRESS, DataType.TokenBalance] : null,
//     computeDuration(contract as Contract),
//     { suspense },
//   );
//   useKeepSWRDATALiveAsBlocksArrive(result.mutate);
//   console.log("duration:", result.data);
//   return result;
// }
// export function useCliff (address?: string[] | null, suspense = false): SWRResponse<any, any> {
//   const { chainId } = useWeb3React();

//   const contract = useContract(PRIVATE_SALE_ADDRESS, PSABI);

//   const result: any = useSWR(
//     typeof address === "string" && contract ? [address, chainId, PRIVATE_SALE_ADDRESS, DataType.TokenBalance] : null,
//     computeCliff(contract as Contract),
//     { suspense },
//   );
//   useKeepSWRDATALiveAsBlocksArrive(result.mutate);
//   console.log("cliff:", result.data);
//   return result;
// }

// export function useSurveyOwners(surveys: string[], suspense = false): SWRResponse<any, any> {
//   const { chainId } = useWeb3React();

//   let result: any = [];
//   for (const survey of surveys) {
//       const contract = useContract(survey, TrustedSurvey?.abi, true);
//       const owner = useSWR(TrustedSurvey && contract ? [chainId, survey] : null,
//           getSurveyOwner(contract as Contract), {
//           suspense
//       });
//       result.push(owner.data)
//   }

//   // useKeepSWRDATALiveAsBlocksArrive(result.mutate)
//   return result;
// }
