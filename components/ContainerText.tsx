import { useWeb3React } from "@web3-react/core";
import React from "react";
import { addresses, desiredChain } from "../constants";
import { useTokenSymbol } from "../hooks/useTokenSymbol";

const ContainerText = props => {

  const {chainId} = useWeb3React()

  const { data: tokenSymbol } = useTokenSymbol(
    chainId !== undefined ? (chainId as number) : desiredChain.chainId,
    chainId !== undefined
      ? addresses[chainId as number].ERC20_TOKEN_ADDRESS
      : addresses[desiredChain.chainId as number].ERC20_TOKEN_ADDRESS,
  );
  return (
    <div className="h-60 w-96">
      <div className="w-full bg-black h-10 opacity-100 text-white text-xl">
        <div className="py-2 px-10">{props.title_}</div>
      </div>

      <div className="h-60 w-full bg-zinc-800 px-3 py-3 text-slate-300">
        <div className="flex flex-row flex-wrap justify-between ">
          <div>{tokenSymbol} to be unlocked:</div>
          <div className="text-yellow-300">{props.unlocked}</div>
        </div>
        <div className="flex flex-row flex-wrap justify-between">
          <div>{tokenSymbol} Claimable:</div>
          <div className="text-white">{props.claimable}</div>
        </div>
        <div className="flex flex-wrap justify-end">
          <div className="bg-yellow-500 w-16">
            <button className="text-white" onClick={props.claim} disabled={props.claimButtonDisable}>
              Claim
            </button>
          </div>
        </div>
        <div className="text-left	text-white text-xs py-5">
          <div className="mb-2">{props.splMessage}</div>
          <div className="text-xs">
            Claiming Date:{"   "}
            {props.claimingDate}
          </div>
          <div className="text-xs">
            Unlocking Date:{"  "}
            {props.unlockingDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerText;
