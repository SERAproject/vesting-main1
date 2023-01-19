import React from "react";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import moment from "moment";
import { isAddress } from "@ethersproject/address";
import { BigNumber } from "ethers";
import { addresses, desiredChain } from "../constants";
import {
  useIncomingDepositsFinalisedPreVesting,
  usePreVestingFetchOwner,
  usePreVestingToken,
  useRevoke,
  useSetTimestampPreVesting,
  useStartPreVesting,
  useTimestampInitialStatusVesting,
  useTimestampStatusVesting,
  useTransferOwnershipVesting,
  useVestingScheduleTotalAmt,
  useVestingScheduleTotalCount,
  useVestingWithdraw,
  useWithdrawableAmt,
} from "../hooks/useTokenPreVesting";
import { useTokenSymbol } from "../hooks/useTokenSymbol";
import { useTokenDecimals } from "../hooks/useTokenDecimals";


const TokenPreVesting = props => {
  const { active, account, chainId } = useWeb3React();
  const [newOwner, setNewOwner] = React.useState<any>();
  const [withdrawAmount, setWithdrawAmount] = React.useState<any>();
  const [tokenAmountWithdraw, setTokenAmountWithdraw] = React.useState<any>();
  const [scheduleID, setScheduleID] = React.useState<any>();
  const [timePeriodPreVesting, setTimePeriodPreVesting] = React.useState<any>();

  const { data: tokenSymbol } = useTokenSymbol(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );
  const { data: tokenDecimals } = useTokenDecimals(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );

  const { data: ownerAddressPrevesting } = usePreVestingFetchOwner(
    props.tokenPreVestingAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: tokenAddressPrevesting } = usePreVestingToken(
    props.tokenPreVestingAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: timestampStatusVesting } = useTimestampStatusVesting(
    props.tokenPreVestingAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: timestampInitialStatusVesting } = useTimestampInitialStatusVesting(
    props.tokenPreVestingAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: startTimePreVesting } = useStartPreVesting(
    props.tokenPreVestingAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: preVestingTotalAmount } = useVestingScheduleTotalAmt(
    props.tokenPreVestingAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: preVestingTotalCount } = useVestingScheduleTotalCount(
    props.tokenPreVestingAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: preVestingWithdrawableAmount } = useWithdrawableAmt(
    props.tokenPreVestingAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: incomingDepositStatusPreVesting } = useIncomingDepositsFinalisedPreVesting(
    props.tokenPreVestingAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  
  const preVestingTimestampTx = useSetTimestampPreVesting(props.tokenPreVestingAddress, timePeriodPreVesting);
  const transferOwnershipVestingTx = useTransferOwnershipVesting(props.tokenPreVestingAddress, newOwner);
  const vestingWithdrawTx = useVestingWithdraw(
    props.tokenPreVestingAddress,
    withdrawAmount != undefined && tokenDecimals != undefined
      ? parseUnits(withdrawAmount, tokenDecimals)
      : BigNumber.from("0"),
  );
  const revokeParamsTx = useRevoke(props.tokenPreVestingAddress, scheduleID);

  const handleWithdrawFromVesting = async e => {
    e.preventDefault();
    if (tokenAmountWithdraw != undefined || tokenAmountWithdraw != "") {
      const txWithdraw = await vestingWithdrawTx();
      await notifyWhenWithdraw(txWithdraw.wait(1));
    } else {
      setTokenAmountWithdraw(0);
    }
  };

  const handleRevoke = async e => {
    e.preventDefault();
    if (scheduleID != undefined || scheduleID != "") {
      try {
        const txRevoke = await revokeParamsTx();
        await notifyRevoke(txRevoke.wait(1));
      } catch(e) {
        await notifyRevokeFail();
      }
      
      
    } else {
      setScheduleID(0);
    }
  };

  const handleTransferOwnershipPreVesting = async e => {
    e.preventDefault();
    if (newOwner != undefined || newOwner != "" || !isAddress(newOwner)) {
      const txTransfer = await transferOwnershipVestingTx();
      await notifyTransferOwnership(txTransfer.wait(1));
    } else {
      setNewOwner("0x");
    }
  };

  const handleTimestamp = async e => {
    e.preventDefault();
    if (timePeriodPreVesting != undefined || timePeriodPreVesting != "") {
      const txTimestamp = await preVestingTimestampTx();
      await notifySetTimestamp(txTimestamp.wait(1));
    } else {
      setTimePeriodPreVesting(0);
    }
  };

  const notifyWhenWithdraw = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Withdraw in progress...`,
      success: `Withdraw has successfully being made👌`,
      error: `Failed to withdraw 🤯"`,
    });
  };

  const notifyRevoke = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Revoking vesting schedule...`,
      success: `Vesting schedule cannot be revoked`,
      error: `Failed to revoke vesting schedule 🤯"`,
    });
  };

  const notifyRevokeFail = async() => {
    await toast.info(`Failed to revoke vesting schedule 🤯 vesting is not revocable as revocable amount is 0`);
  };

  const notifyTransferOwnership = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Transferring Ownership...`,
      success: `Ownership is Successfully Transferred👌`,
      error: `Failed to Transfer Ownership 🤯"`,
    });
  };

  const notifySetTimestamp = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Setting timestamp...`,
      success: `Timestamp is now SET👌`,
      error: `Failed to set the TIMESTAMP 🤯"`,
    });
  };

  return (
    <div className="mt-5 border">
      <div className="mt-4 font-weight-bold mx-auto text-center">{props.title}</div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Contract Address : {props.tokenPreVestingAddress}</li>
        <li className="list-group-item">owner : {ownerAddressPrevesting}</li>
        <li className="list-group-item">token : {tokenAddressPrevesting}</li>
        <li className="list-group-item">
          Incoming deposits are :{" "}
          {incomingDepositStatusPreVesting != undefined && incomingDepositStatusPreVesting == true && (
            <span style={{ color: "red" }}>FINALIZED</span>
          )}
          {incomingDepositStatusPreVesting != undefined && incomingDepositStatusPreVesting == false && (
            <span style={{ color: "green" }}>ACCEPTED</span>
          )}
        </li>
        <li className="list-group-item">
          Locking started : {timestampStatusVesting != undefined ? timestampStatusVesting.toString() : false}
        </li>
        <li className="list-group-item">
          Deposit finalized at :{" "}
          {(timestampInitialStatusVesting &&
            timestampStatusVesting != undefined &&
            timestampStatusVesting == true &&
            timestampInitialStatusVesting != 0 &&
            moment.unix(timestampInitialStatusVesting).format("MMMM DD, YYYY hh:mm:ss a")) ||
            "-"}
        </li>
        <li className="list-group-item">
          Vesting started at :{" "}
          {(startTimePreVesting && moment.unix(startTimePreVesting).format("MMMM DD, YYYY hh:mm:ss a")) || "- "}
        </li>
        <li className="list-group-item">
          Total tokens vested :{" "}
          {tokenDecimals && preVestingTotalAmount != undefined
            ? `${parseFloat(formatUnits(preVestingTotalAmount, tokenDecimals)).toFixed(4)} ${tokenSymbol}`
            : "-"}
        </li>
        <li className="list-group-item">vesting schedule count : {preVestingTotalCount}</li>
        <li className="list-group-item">
          withdrawable amount : {preVestingWithdrawableAmount} {tokenSymbol}
        </li>
        {!props.isIDO && (
          <>
            <li className="list-group-item">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="timestamp in seconds"
                  aria-label="timestamp in seconds"
                  aria-describedby="basic-addon2"
                  value={timePeriodPreVesting}
                  onChange={e => setTimePeriodPreVesting(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={e => handleTimestamp(e)}
                    disabled={
                      !active ||
                      (ownerAddressPrevesting != undefined ? ownerAddressPrevesting != account : false) ||
                      (timestampStatusVesting != undefined ? timestampStatusVesting != false : true)
                    }
                  >
                    set Time Stamp
                  </button>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="new owner"
                  aria-label="new owner"
                  aria-describedby="basic-addon2"
                  value={newOwner}
                  onChange={e => setNewOwner(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={e => handleTransferOwnershipPreVesting(e)}
                    disabled={
                      !active || (ownerAddressPrevesting != undefined ? ownerAddressPrevesting != account : false)
                    }
                  >
                    transfer Ownership
                  </button>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="token amount"
                  aria-label="token amount"
                  aria-describedby="basic-addon2"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={e => handleWithdrawFromVesting(e)}
                    disabled={
                      !active || (ownerAddressPrevesting != undefined ? ownerAddressPrevesting != account : false)
                    }
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            </li>
            <li className="list-group-item">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="vesting schedule id"
                  aria-label="vesting schedule id"
                  aria-describedby="basic-addon2"
                  value={scheduleID}
                  onChange={e => setScheduleID(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={e => handleRevoke(e)}
                    disabled={
                      !active || (ownerAddressPrevesting != undefined ? ownerAddressPrevesting != account : false)
                    }
                  >
                    REVOKE
                  </button>
                </div>
              </div>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default TokenPreVesting;
