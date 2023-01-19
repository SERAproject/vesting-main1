import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { formatEther } from "@ethersproject/units";
import { BigNumber } from "ethers";
import moment from "moment";
import {
  useAlreadyWithdrawn,
  useBalances,
  useInitialTimestamp,
  useTimeperiod,
  useTimestampSet,
  useTransferTimeLockedTokensAfterTimePeriod,
} from "../hooks/useTokenPreTimelock";
import { useTokenSymbol } from "../hooks/useTokenSymbol";
import { addresses, desiredChain } from "../constants";
import { useBlockTimestamp } from "../hooks/useBlockTimestamp";

const ClaimTGE = props => {
  // WEB3 Connection
  const { account, chainId } = useWeb3React();
  const [disableClaimTGE, setDisableClaimTGE] = useState<boolean>(true);

  const { data: currentBlockTimestamp } = useBlockTimestamp();
  const { data: tokenSymbol } = useTokenSymbol(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );
  const { data: timestampsetForTimelockSeedRound } = useTimestampSet(props.timelockContractAddress);
  const { data: balances } = useBalances(props.timelockContractAddress, account as string);
  const { data: alreadyWithdrawn } = useAlreadyWithdrawn(props.timelockContractAddress, account as string);
  const balancesTobeWithdrawn = balances ? parseFloat(formatEther(BigNumber.from(balances))).toFixed(4) : "0";
  const balancesAlreadyWithdrawn = alreadyWithdrawn
    ? parseFloat(formatEther(BigNumber.from(alreadyWithdrawn))).toFixed(4)
    : "0";
  const { data: startTime } = useInitialTimestamp(props.timelockContractAddress);
  const { data: timePeriod } = useTimeperiod(props.timelockContractAddress);
  const lockStartDate =
    startTime != undefined && parseInt(startTime.toString()) > 0
      ? moment.unix(parseInt(startTime.toString())).format("DD MMM YYYY, hh:mm:ss a")
      : "-";
  const lockEndDate =
    timePeriod != undefined && parseInt(timePeriod.toString()) > 0
      ? moment.unix(parseInt(timePeriod.toString())).format("DD MMM YYYY, hh:mm:ss a")
      : "-";
  const transferTGE = useTransferTimeLockedTokensAfterTimePeriod(
    props.timelockContractAddress,
    props.token,
    account as string,
    balances as BigNumber,
  );

  useEffect(() => {
    if (
      timestampsetForTimelockSeedRound !== undefined &&
      timestampsetForTimelockSeedRound !== null &&
      balances !== undefined &&
      balances !== null &&
      currentBlockTimestamp !== undefined &&
      currentBlockTimestamp !== null &&
      timePeriod !== undefined &&
      timePeriod !== null
    ) {
      setDisableClaimTGE(!timestampsetForTimelockSeedRound || balances?.eq("0") || currentBlockTimestamp < timePeriod);
    }
  }, [balances, timestampsetForTimelockSeedRound, currentBlockTimestamp, timePeriod]);

  const handleClaimTGE = async e => {
    e.preventDefault();
    const transferTGEtx = await transferTGE();
    await notifyTransfer(transferTGEtx.wait(1));
  };

  const notifyTransfer = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Claiming ${balancesTobeWithdrawn} ${tokenSymbol}`,
      success: `Claimed ${balancesTobeWithdrawn} ${tokenSymbol}👌`,
      error: `Failed to claim ${balancesTobeWithdrawn} ${tokenSymbol} 🤯"`,
    });
  };
  return (
    <div>
      {account && balances && (BigNumber.from(balances).gt(0) || alreadyWithdrawn?.gt(0)) && (
        <div>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <div className="ms-2 c-details">
                <h6 className="mb-0">{tokenSymbol} to be withdrawn: </h6>
                <h6 className="mb-0">{tokenSymbol} already withdrawn : </h6>
              </div>
            </div>
            <div className="badge">
              <span> {balancesTobeWithdrawn} </span>
              <span className="Claimable"> {balancesAlreadyWithdrawn} </span>
            </div>
          </div>
          <div className="div-claim_btn mt-2">
            <button
              type="button"
              className="btn btn-warning"
              onClick={e => handleClaimTGE(e)}
              disabled={disableClaimTGE}
            >
              Claim TGE
            </button>
          </div>
          <div className="mt-3">
            <div className="d-flex justify-content-between">
              <div className="ms-2">
                <div className="text2">Claiming starts： </div>
                <div className="text2">Claiming ends： </div>
              </div>
              <div>
                <div className="text2"> {lockStartDate} </div>
                <div className="text2"> {lockEndDate} </div>
              </div>
            </div>
          </div>
          <hr></hr>
        </div>
      )}
    </div>
  );
};

export default ClaimTGE;
