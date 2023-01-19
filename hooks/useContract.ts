import { Contract, ContractInterface } from "@ethersproject/contracts";
import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";

export function useContract(address?: string, ABI?: ContractInterface, withSigner = false): Contract | undefined {
  const { account, library } = useWeb3React();

  return useMemo(
    () =>
      !!address && !!ABI && !!library
        ? new Contract(address, ABI, withSigner ? library.getSigner(account).connectUnchecked() : library)
        : undefined,
    [address, ABI, withSigner, library, account],
  );
}
