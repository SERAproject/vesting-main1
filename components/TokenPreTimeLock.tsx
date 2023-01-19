import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import moment from "moment";
import React from "react";
import { toast } from "react-toastify";
import { isAddress } from "@ethersproject/address";
import { TokenAmount } from "@uniswap/sdk";
import { addresses, desiredChain } from "../constants";
import {
  usePreTimelockFetchOwner,
  usePreTimelockToken,
  useTimeperiodValue,
  useTimestampInitialStatus,
  useTimestampStatus,
  useSetTimestampPreTimelock,
  useTransferOwnershipTimelock,
  useTransferAccidentallyLockedTokens,
  useIncomingDepositsFinalisedTimelock,
} from "../hooks/useTokenPreTimelock";

import { useTokenSymbol } from "../hooks/useTokenSymbol";
import { useTokenDecimals } from "../hooks/useTokenDecimals";
import { useTokenBalance } from "../hooks/useTokenBalance";

const TokenPreTimeLock = props => {
  const { active, account, chainId } = useWeb3React();

  const [timePeriodPreTimelock, setTimePeriodPreTimelock] = React.useState<any>();
  const [newOwner, setNewOwner] = React.useState<any>();
  const [tokenAddress, setTokenAddress] = React.useState<any>();
  const [tokenAmount, setTokenAmount] = React.useState<string>();

  const { data: tokenSymbol } = useTokenSymbol(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );
  const { data: tokenDecimals } = useTokenDecimals(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );

  const { data: preTimelockTotalTokens } = useTokenBalance(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    props.preTimelockAddress,
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );

  const { data: ownerAddressPretimelock } = usePreTimelockFetchOwner(
    props.preTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: tokenAddressPretimelock } = usePreTimelockToken(
    props.preTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: incomingDepositStatusPreTimelock } = useIncomingDepositsFinalisedTimelock(
    props.preTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: timestampStatusTimelock } = useTimestampStatus(
    props.preTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: timestampInitialStatusTimelock } = useTimestampInitialStatus(
    props.preTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: timePeriodValuePreTimelock } = useTimeperiodValue(
    props.preTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const preTimelockTimestampTx = useSetTimestampPreTimelock(props.preTimelockAddress, timePeriodPreTimelock);
  const transferOwnershipSeedTimelockTx = useTransferOwnershipTimelock(props.preTimelockAddress, newOwner);
  const transferLockedTokensSeedTimelockTx = useTransferAccidentallyLockedTokens(
    props.preTimelockAddress,
    tokenAddress,
    tokenAmount as any
  );

  const handleTransferOwnershipTimelock = async e => {
    e.preventDefault();
    if (newOwner != "" || newOwner != undefined || !isAddress(newOwner)) {
      const txTransferOwnership = await transferOwnershipSeedTimelockTx();
      await notifyTransferOwnership(txTransferOwnership.wait(1));
    } else {
      setNewOwner("0x");
    }
  };

  const handleTransferReleaseAccidentallyLockedTokens = async e => {
    e.preventDefault();
    if (tokenAmount != undefined || (tokenAmount != "" && tokenAddress != undefined) || tokenAddress != "") {
      const txRelease = await transferLockedTokensSeedTimelockTx();
      await notifyAccidentalTokenReleased(txRelease.wait(1));
    } else {
      setTokenAmount("0");
      setTokenAddress("0x");
    }
  };

  const handleSetTimestampTimelock = async e => {
    e.preventDefault();
    if (timePeriodPreTimelock != undefined || timePeriodPreTimelock != "") {
      const txTimestamp = await preTimelockTimestampTx();
      await notifySetTimestamp(txTimestamp.wait(1));
    } else {
      setTimePeriodPreTimelock(0);
    }
  };

  const notifyTransferOwnership = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Transferring Ownership...`,
      success: `Ownership is Successfully Transferred👌`,
      error: `Failed to Transfer Ownership 🤯"`,
    });
  };

  const notifyAccidentalTokenReleased = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Releasing Tokens...`,
      success: `Tokens has been released👌`,
      error: `Failed to release tokens 🤯"`,
    });
  };

  const handleSetTokenAmt = async (e) => {
    const newTokenAmt = e ? BigNumber.from(e) : "0";
    setTokenAmount(newTokenAmt as any);
  }

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
        <li className="list-group-item">
          <span className="font-weight-bold">Contract Address :</span> {props.preTimelockAddress}
        </li>
        <li className="list-group-item">Owner : {ownerAddressPretimelock}</li>
        <li className="list-group-item">Token : {tokenAddressPretimelock}</li>
        <li className="list-group-item">
          Incoming deposits are :{" "}
          {incomingDepositStatusPreTimelock != undefined && incomingDepositStatusPreTimelock == false && (
            <span style={{ color: "green" }}>ACCEPTED</span>
          )}
          {incomingDepositStatusPreTimelock != undefined && incomingDepositStatusPreTimelock == true && (
            <span style={{ color: "red" }}>FINALIZED</span>
          )}
        </li>
        <li className="list-group-item">
          Locking started : {timestampStatusTimelock != undefined ? timestampStatusTimelock.toString() : false}
        </li>
        <li className="list-group-item">
          Deposit finalized at :{" "}
          {(timestampInitialStatusTimelock &&
            timestampStatusTimelock != undefined &&
            timestampStatusTimelock == true &&
            timestampInitialStatusTimelock != 0 &&
            moment.unix(timestampInitialStatusTimelock).format("MMMM DD, YYYY hh:mm:ss a")) ||
            "-"}
        </li>
        <li className="list-group-item">
          TGE unlock date :{" "}
          {(timePeriodValuePreTimelock != undefined &&
            timestampStatusTimelock != undefined &&
            timestampStatusTimelock == true &&
            moment.unix(timePeriodValuePreTimelock).format("MMMM DD, YYYY hh:mm:ss a")) ||
            "-"}
        </li>
        <li className="list-group-item">
          Total tokens locked :{" "}
          {tokenDecimals && preTimelockTotalTokens != undefined
            ? `${(preTimelockTotalTokens as TokenAmount).toSignificant(4, { groupSeparator: "," })} ${tokenSymbol}`
            : "-"}
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
                  value={timePeriodPreTimelock}
                  onChange={e => setTimePeriodPreTimelock(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={e => handleSetTimestampTimelock(e)}
                    disabled={
                      !active ||
                      (ownerAddressPretimelock != undefined ? ownerAddressPretimelock != account : false) ||
                      (timestampStatusTimelock != undefined ? timestampStatusTimelock != false : true)
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
                    onClick={e => handleTransferOwnershipTimelock(e)}
                    disabled={
                      !active || (ownerAddressPretimelock != undefined ? ownerAddressPretimelock != account : false)
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
                  placeholder="token address"
                  aria-label="token address"
                  aria-describedby="basic-addon2"
                  value={tokenAddress}
                  onChange={e => setTokenAddress(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="token amount"
                  aria-label="token amount"
                  aria-describedby="basic-addon2"
                  value={tokenAmount}
                  onChange={e => handleSetTokenAmt(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-primary btn-block"
                    type="button"
                    onClick={e => handleTransferReleaseAccidentallyLockedTokens(e)}
                    disabled={
                      !active || (ownerAddressPretimelock != undefined ? ownerAddressPretimelock != account : false)
                    }
                  >
                    transfer Accidentally Locked Tokens
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

export default TokenPreTimeLock;