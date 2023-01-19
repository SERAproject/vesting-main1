import React from "react";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import { formatEther } from "@ethersproject/units";
import { BigNumber } from "ethers";
import BN from "bignumber.js";
import { toast } from "react-toastify";
import {
  useComputeReleasableAmount,
  useComputeVestingScheduleIdForAddressAndIndex,
  useRelease,
  useVestingScheduleByAddressAndIndex,
  useSetTimeStamp,
  useStart,
} from "../hooks/useTokenPreVesting";
import { secondsToDhms } from "../utils";
import { useTokenSymbol } from "../hooks/useTokenSymbol";
import { addresses, desiredChain } from "../constants";


const Claim = props => {
  // WEB3 Connection
  const { account, chainId } = useWeb3React();

  const { data: tokenSymbol } = useTokenSymbol(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );

  // Setting up variables to fetch details from hooks
  const vestingSchedule = useVestingScheduleByAddressAndIndex(
    account as string,
    props.vestingContractAddress,
    props.vestingScheduleIndex,
  );
  const { data: vestingScheduleId } = useComputeVestingScheduleIdForAddressAndIndex(
    account as string,
    props.vestingContractAddress,
    props.vestingScheduleIndex,
  );
  const { data: releasableAmount } = useComputeReleasableAmount(props.vestingContractAddress, vestingScheduleId);
  const { data: startTimeInSeconds } = useStart(props.vestingContractAddress);
  const toBeUnlockedAmount =
    vestingSchedule !== undefined && releasableAmount
      ? BigNumber.from(vestingSchedule[6]).sub(BigNumber.from(vestingSchedule[7])).sub(releasableAmount)
      : BigNumber.from("0");
  const toBeUnlocked =
    vestingSchedule !== undefined && releasableAmount ? parseFloat(formatEther(toBeUnlockedAmount)).toFixed(4) : "0";
  const claimable = releasableAmount ? parseFloat(formatEther(BigNumber.from(releasableAmount))).toFixed(4) : "0";
  const claim = useRelease(props.vestingContractAddress, vestingScheduleId, releasableAmount);
  const { data: timeStampSet } = useSetTimeStamp(props.vestingContractAddress);
  const claimingDate =
    timeStampSet && vestingSchedule != undefined && startTimeInSeconds && startTimeInSeconds != undefined
      ? moment
          .unix(parseInt(vestingSchedule[2]) + parseInt(startTimeInSeconds.toString()))
          .format("DD MMM YYYY, hh:mm:ss a")
      : "-";
  const unlockingDate =
    timeStampSet && vestingSchedule != undefined && startTimeInSeconds != undefined
      ? moment
          .unix(parseInt(vestingSchedule[3]) + parseInt(startTimeInSeconds.toString()) + parseInt(vestingSchedule[2]))
          .format("DD MMM YYYY, hh:mm:ss a")
      : "-";
  const splMessage = `Vesting Schedule: ${
    vestingSchedule && vestingSchedule[9] ? new BN(vestingSchedule[9]).div("100") : "-"
  }% TGE then daily linear for ${
    vestingSchedule && (vestingSchedule[3] as number) > 0 ? secondsToDhms(vestingSchedule[3] as number) : "-"
  }`;

  const handleClaim = async e => {
    e.preventDefault();
    const claimTx = await claim();
    await notifyClaim(claimTx.wait(1));
  };

  const notifyClaim = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Claiming ${claimable} ${tokenSymbol}`,
      success: `Claimed ${claimable} ${tokenSymbol}👌`,
      error: `Failed to claim ${claimable} ${tokenSymbol} 🤯"`,
    });
  };

  return (
    <div>
      {account && releasableAmount && (BigNumber.from(releasableAmount).gt("0") || toBeUnlockedAmount.gt("0")) && (
        <div>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <div className="ms-2 c-details">
                <h6 className="mb-0">{tokenSymbol} to be unlocked: </h6>
                <h6 className="mb-0">{tokenSymbol} Claimable: </h6>
              </div>
            </div>
            <div className="badge">
              <span> {toBeUnlocked} </span>
              <span className="Claimable"> {claimable} </span>
            </div>
          </div>
          <div className="div-claim_btn">
            <button
              type="button"
              className="btn btn-warning"
              onClick={e => handleClaim(e)}
              disabled={!BigNumber.from(releasableAmount).gt(0) || !timeStampSet}
            >
              Claim
            </button>
          </div>
          <div className="mt-3">
            <div className="text1 ms-2 mb-1">{splMessage}</div>
            <div className="d-flex justify-content-between">
              <div className="ms-2">
                <div className="text2">Claiming starts: </div>
                <div className="text2">Claiming ends: </div>
              </div>
              <div>
                <div className="text2"> {claimingDate} </div>
                <div className="text2"> {unlockingDate} </div>
              </div>
            </div>
          </div>
          <hr></hr>
        </div>
      )}
    </div>
  );
};

export default Claim;
