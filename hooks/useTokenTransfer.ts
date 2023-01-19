import { BigNumberish, Contract } from "ethers";
import { addresses } from "../constants";
import { ERC20__factory } from "../src/types";
import { useContract } from "./useContract";

//transferring tokens to seed round => pre timelock contract
export function useTokenTransfer(recipient: string, amount: BigNumberish, chainId: number): any {
  const token = addresses[chainId as number].ERC20_TOKEN_ADDRESS;
  const contract = useContract(token, ERC20__factory.abi, true);
  return async () => {
    return (contract as Contract).transfer(recipient, amount).then((result: any) => result);
  };
}
