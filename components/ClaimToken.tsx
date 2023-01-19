import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useAvailableAtTGE, useVestingContractAddress } from "../hooks/useTokenSale";
import moment from "moment";
import Account from "../components/AccountX";
import { useEagerConnect } from "../hooks/useEagerConnect";
import {
  useComputeReleasableAmount,
  useComputeVestingScheduleIdForAddressAndIndex,
  useRelease,
  useVestingScheduleByAddressAndIndex,
} from "../hooks/useVesting";
import { formatEther } from "@ethersproject/units";
import { BigNumber } from "ethers";
import { secondsToDhms } from "../utils";
import BN from "bignumber.js";
import { addresses, desiredChain } from "../constants";
import { useTokenSymbol } from "../hooks/useTokenSymbol";

const ClaimToken = props => {
  // WEB3 Connection
  const { account, chainId } = useWeb3React();
  // Account
  const triedToEagerConnect = useEagerConnect();
  // Setting up variables to fetch details from hooks
  const { data: vestingContractAddress } = useVestingContractAddress(
    chainId == undefined ? desiredChain.chainId : chainId,
  );
  const vestingSchedule = useVestingScheduleByAddressAndIndex(
    account as string,
    vestingContractAddress,
    props.vestingScheduleIndex,
  );

  const { data: vestingScheduleId } = useComputeVestingScheduleIdForAddressAndIndex(
    account as string,
    vestingContractAddress,
    props.vestingScheduleIndex,
  );

  const { data: tokenSymbol } = useTokenSymbol(
    chainId !== undefined ? (chainId as number) : desiredChain.chainId,
    chainId !== undefined
      ? addresses[chainId as number].ERC20_TOKEN_ADDRESS
      : addresses[desiredChain.chainId as number].ERC20_TOKEN_ADDRESS,
  );
  const { data: tge } = useAvailableAtTGE(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: releasableAmount } = useComputeReleasableAmount(vestingContractAddress, vestingScheduleId);
  const unlocked =
    vestingSchedule !== undefined && releasableAmount
      ? parseFloat(
          formatEther(BigNumber.from(vestingSchedule[7]).sub(BigNumber.from(vestingSchedule[8])).sub(releasableAmount)),
        ).toFixed(4)
      : "0";
  const claimable = releasableAmount ? parseFloat(formatEther(BigNumber.from(releasableAmount))).toFixed(4) : "0";
  const claim = useRelease(vestingContractAddress, vestingScheduleId, releasableAmount);

  const claimingDate = vestingSchedule != undefined ? moment.unix(vestingSchedule[2]).format("DD MMM YYYY") : "-";
  const unlockingDate =
    vestingSchedule != undefined
      ? moment.unix(parseInt(vestingSchedule[4]) + parseInt(vestingSchedule[3])).format("DD MMM YYYY")
      : "-";
  const splMessage = `Vesting Schedule: ${tge ? new BN(tge).div("100") : "-"}% TGE then daily linear for ${
    vestingSchedule && (vestingSchedule[4] as number) > 0 ? secondsToDhms(vestingSchedule[4] as number) : "-"
  }`;

  return (
    <div>
      {claimable.toString() > "0.0000" && account && (
        <div>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <div className="ms-2 c-details">
                <h6 className="mb-0">{tokenSymbol} to be unlocked: </h6>
                <h6 className="mb-0">{tokenSymbol} Claimable: </h6>
              </div>
            </div>
            <div className="badge">
              <span> {unlocked} </span>
              <span className="Claimable"> {claimable} </span>
            </div>
          </div>
          <div className="div-claim_btn">
            <button type="button" className="btn btn-warning" onClick={claim} disabled={props.claimButtonDisable}>
              Claim
            </button>
          </div>
          <div className="mt-5">
            <div className="mt-3">
              {" "}
              <span className="text1">{splMessage}</span>
              <br></br>
              <span className="text2">Claiming date：{claimingDate}</span> <br></br>
              <span className="text2">Unlocking date：{unlockingDate}</span>
            </div>
          </div>
          <hr></hr>
        </div>
      )}
      {account == undefined && (
        <div>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-row align-items-center">
              <div className="ms-2 c-details">
                <h6 className="mb-0">{tokenSymbol} to be unlocked: </h6>
                <h6 className="mb-0">{tokenSymbol} Claimable: </h6>
              </div>
            </div>
            <div className="badge">
              <span> --- </span>
              <span className="Claimable"> --- </span>
            </div>
          </div>
          <div className="div-claim_btn">
            <Account triedToEagerConnect={triedToEagerConnect} />
          </div>
          <div className="mt-5">
            <div className="mt-3">
              {" "}
              <span className="text1">Vesting Schedule</span>
              <br></br>
              <span className="text2">Claiming starts：Connect Metamask to Reveal</span> <br></br>
              <span className="text2">Unlocking ends：Connect Metamask to Reveal</span>
            </div>
          </div>
          <hr></hr>
        </div>
      )}
    </div>
  );
};

export default ClaimToken;
