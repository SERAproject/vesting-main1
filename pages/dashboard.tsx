import React, { useEffect, useRef } from "react";
import Papa from "papaparse";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";
import BN from "bignumber.js";
import { toast } from "react-toastify";
import { useTokenTransfer } from "../hooks/useTokenTransfer";
import { addresses, desiredChain } from "../constants";
import {
  useCreateBulkVestingSchedule,
  useIncomingDepositsFinalisedPreVesting,
  usePreVestingFetchOwner,
} from "../hooks/useTokenPreVesting";
import {
  useBulkDepositTokens,
  useIncomingDepositsFinalisedTimelock,
  usePreTimelockFetchOwner,
} from "../hooks/useTokenPreTimelock";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { useTokenSymbol } from "../hooks/useTokenSymbol";
import { useTokenDecimals } from "../hooks/useTokenDecimals";
import TokenPreTimeLock from "../components/TokenPreTimeLock";
import TokenPreVesting from "../components/TokenPreVesting";
import TokenPreSale from "../components/TokenPreSale";
import { useTimeLockContractAddress, useVestingContractAddress } from "../hooks/useTokenPreSale";
import { getAddress } from "@ethersproject/address";
import { parseUnits } from "@ethersproject/units";

function Dashboard(): JSX.Element {
  const { chainId, active, account } = useWeb3React();
  const inputRef = useRef<any>();
  const { data: tokenBalance } = useTokenBalance(
    chainId == undefined ? desiredChain.chainId : (chainId as number),
    account,
    addresses[chainId == undefined ? desiredChain.chainId : (chainId as number)].ERC20_TOKEN_ADDRESS,
  );
  const [isValidTGE, setIsValidTGE] = React.useState<boolean>(true);
  const [isValidDuration, setIsValidDuration] = React.useState<boolean>(true);
  const [isValidCliff, setIsValidCliff] = React.useState<boolean>(true);
  const [enoughTokenBalance, setEnoughTokenBalance] = React.useState<boolean>(false);
  const [disableTGEButton, setDisableTGEButton] = React.useState<boolean>(false);
  const [availableTge, setAvailableTge] = React.useState<string>("0");
  const [tges, setTges] = React.useState<any>([]);
  const [duration, setDuration] = React.useState<string>("0");
  const [cliff, setCliff] = React.useState<string>("0");
  const [cliffs, setCliffs] = React.useState<any>([]);
  const [round, setRound] = React.useState<string>();
  //hooks for seed round
  const [beneficiaries, setBeneficiaries] = React.useState<any>([]);
  const [totalNonVestingAmt, setTotalNonVestingAmt] = React.useState<string>("0");
  const [totalVestingAmt, setTotalVestingAmt] = React.useState<any>("0");
  const [nonVestingAmt, setNonVestingAmt] = React.useState<any>("0");
  const [vestingAmt, setVestingAmt] = React.useState<any>([]);
  const [durations, setDurations] = React.useState<any>([]);
  const [revocables, setRevocables] = React.useState<any>([]);
  const [slice, setSlice] = React.useState<any>([]);

  const { data: tokenAddressIDOPreVesting } = useVestingContractAddress(
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: tokenAddressIDOPretimelock } = useTimeLockContractAddress(
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  // token
  const { data: tokenSymbol } = useTokenSymbol(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );
  const { data: tokenDecimals } = useTokenDecimals(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );

  //FOR SEED ROUND
  const sendTokenToPreTimeLockForSeed = useTokenTransfer(
    chainId != undefined
      ? addresses[chainId as number].SEED_PRE_TIME_LOCK
      : addresses[desiredChain.chainId].SEED_PRE_TIME_LOCK,
    totalNonVestingAmt == "" ? BigNumber.from("0") : BigNumber.from(totalNonVestingAmt),
    chainId == undefined ? desiredChain.chainId : chainId,
  );
  const sendTokenToPreVestingForSeed = useTokenTransfer(
    chainId != undefined
      ? addresses[chainId as number].SEED_PRE_VESTING
      : addresses[desiredChain.chainId].SEED_PRE_VESTING,
    totalVestingAmt == "" ? BigNumber.from("0") : BigNumber.from(totalVestingAmt),
    chainId == undefined ? desiredChain.chainId : chainId,
  );
  const createBulkVestingScheduleForSeed = useCreateBulkVestingSchedule(
    chainId != undefined
      ? addresses[chainId as number].SEED_PRE_VESTING
      : addresses[desiredChain.chainId].SEED_PRE_VESTING,
    beneficiaries,
    cliffs,
    durations,
    slice,
    revocables,
    vestingAmt,
    tges,
  );
  const createBulkDepositForSeed = useBulkDepositTokens(
    chainId != undefined
      ? addresses[chainId as number].SEED_PRE_TIME_LOCK
      : addresses[desiredChain.chainId].SEED_PRE_TIME_LOCK,
    beneficiaries,
    nonVestingAmt,
  );
  //FOR PRIVATE ROUND
  const sendTokenToPreTimeLockForPrivateSale = useTokenTransfer(
    chainId != undefined
      ? addresses[chainId as number].PRIVATE_SALE_PRE_TIME_LOCK
      : addresses[desiredChain.chainId].PRIVATE_SALE_PRE_TIME_LOCK,
    totalNonVestingAmt == "" ? BigNumber.from("0") : BigNumber.from(totalNonVestingAmt),
    chainId == undefined ? desiredChain.chainId : chainId,
  );
  const sendTokenToPreVestingForPrivateSale = useTokenTransfer(
    chainId != undefined
      ? addresses[chainId as number].PRIVATE_SALE_PRE_VESTING
      : addresses[desiredChain.chainId].PRIVATE_SALE_PRE_VESTING,
    totalVestingAmt == "" ? BigNumber.from("0") : BigNumber.from(totalVestingAmt),
    chainId == undefined ? desiredChain.chainId : chainId,
  );
  const createBulkVestingScheduleForPrivateSale = useCreateBulkVestingSchedule(
    chainId != undefined
      ? addresses[chainId as number].PRIVATE_SALE_PRE_VESTING
      : addresses[desiredChain.chainId].PRIVATE_SALE_PRE_VESTING,
    beneficiaries,
    cliffs,
    durations,
    slice,
    revocables,
    vestingAmt,
    tges,
  );
  const createBulkDepositForPrivateSale = useBulkDepositTokens(
    chainId != undefined
      ? addresses[chainId as number].PRIVATE_SALE_PRE_TIME_LOCK
      : addresses[desiredChain.chainId].PRIVATE_SALE_PRE_TIME_LOCK,
    beneficiaries,
    nonVestingAmt,
  );
  //contract addresses
  const seedPreTimelockAddress = addresses[chainId != undefined ? chainId : desiredChain.chainId].SEED_PRE_TIME_LOCK;
  const seedTokenPreVesting = addresses[chainId != undefined ? chainId : desiredChain.chainId].SEED_PRE_VESTING;
  const privatePreTimelockAddress =
    addresses[chainId != undefined ? chainId : desiredChain.chainId].PRIVATE_SALE_PRE_TIME_LOCK;
  const privateTokenPreVesting =
    addresses[chainId != undefined ? chainId : desiredChain.chainId].PRIVATE_SALE_PRE_VESTING;
  const idoTokenPreSaleAddress = addresses[chainId != undefined ? chainId : desiredChain.chainId].IDO_TOKEN_PRE_SALE;

  const { data: ownerAddressPretimelockSeed } = usePreTimelockFetchOwner(
    seedPreTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: ownerAddressPreVestingSeed } = usePreVestingFetchOwner(
    seedTokenPreVesting,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: ownerAddressPretimelockPrivate } = usePreTimelockFetchOwner(
    privatePreTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: ownerAddressPreVestingPrivate } = usePreVestingFetchOwner(
    privateTokenPreVesting,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  // ============================================

  const { data: incomingDepositFinalizedTimelockSeed } = useIncomingDepositsFinalisedTimelock(
    seedPreTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: incomingDepositFinalizedVestingSeed } = useIncomingDepositsFinalisedPreVesting(
    seedTokenPreVesting,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: incomingDepositFinalizedTimelockPrivate } = useIncomingDepositsFinalisedTimelock(
    privatePreTimelockAddress,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: incomingDepositFinalizedVestingPrivate } = useIncomingDepositsFinalisedPreVesting(
    privateTokenPreVesting,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  //web3
  const handleSendTGETokensNow = async e => {
    e.preventDefault();
    if (chainId !== undefined) {
      if (round == "seed") {
        await handleSeedRound();
      } else if (round == "private") {
        await handlePrivateRound();
      } else {
        console.log("ERROR: PLEASE SELECT A ROUND IN THE FORM");
      }
    }
  };

  const notifyTransfer = async (promiseObj, recipientContractName) => {
    await toast.promise(promiseObj, {
      pending: `Sending ${tokenSymbol} -> ${recipientContractName}`,
      success: `Sent ${tokenSymbol} -> ${recipientContractName}👌`,
      error: `Failed sending ${tokenSymbol} -> ${recipientContractName} 🤯"`,
    });
  };

  const notifyBulkDepositTokens = async (promiseObj, roundName) => {
    await toast.promise(promiseObj, {
      pending: `Create token lock schedule on pre time lock for ${roundName} round`,
      success: `Created token lock schedule for pre time lock for ${roundName} round👌`,
      error: `Failed to create token lock schedule for ${roundName} round 🤯"`,
    });
  };

  const notifyBulkVestingSchedule = async (promiseObj, roundName) => {
    await toast.promise(promiseObj, {
      pending: `Creating vesting schedule for ${roundName} round`,
      success: `Created vesting schedule for ${roundName} round👌`,
      error: `Failed to create vesting schedule for ${roundName} round 🤯"`,
    });
  };

  const handleSeedRound = async () => {
    if (
      BigNumber.from(totalNonVestingAmt).gt("0") &&
      getAddress(account as string) == getAddress(ownerAddressPretimelockSeed) &&
      !incomingDepositFinalizedTimelockSeed
    ) {
      // transfer tokens to pre time lock
      const sendTokenToPreTimeLockForSeedTx = await sendTokenToPreTimeLockForSeed();
      await notifyTransfer(sendTokenToPreTimeLockForSeedTx.wait(1), "Seed TokenPreTimeLock");

      // create bulk deposit transaction
      const bulkDepositForSeedTx = await createBulkDepositForSeed();
      await notifyBulkDepositTokens(bulkDepositForSeedTx.wait(1), "Seed");
    }

    if (
      BigNumber.from(totalVestingAmt).gt("0") &&
      getAddress(account as string) == getAddress(ownerAddressPreVestingSeed) &&
      !incomingDepositFinalizedVestingSeed
    ) {
      // transfer tokens to pre vesting
      const sendTokenToPreVestingForSeedTX = await sendTokenToPreVestingForSeed();
      await notifyTransfer(sendTokenToPreVestingForSeedTX.wait(1), "Seed TokenPreVesting");

      // create bulk vesting schedule
      const vestingScheduleForSeedTx = await createBulkVestingScheduleForSeed();
      await notifyBulkVestingSchedule(vestingScheduleForSeedTx.wait(1), "Seed");
    }
  };

  const handlePrivateRound = async () => {
    if (
      BigNumber.from(totalNonVestingAmt).gt("0") &&
      getAddress(account as string) == getAddress(ownerAddressPretimelockPrivate) &&
      !incomingDepositFinalizedTimelockPrivate
    ) {
      // transfer tokens to pre time lock
      const sendTokenToPreTimeLockForPrivateSaleTx = await sendTokenToPreTimeLockForPrivateSale();
      await notifyTransfer(sendTokenToPreTimeLockForPrivateSaleTx.wait(1), "PrivateSale TokenPreTimeLock");

      // create bulk deposit transaction
      const bulkDepositForPrivateSaleTx = await createBulkDepositForPrivateSale();
      await notifyBulkDepositTokens(bulkDepositForPrivateSaleTx.wait(1), "PrivateSale");
    }

    if (
      BigNumber.from(totalVestingAmt).gt("0") &&
      getAddress(account as string) == getAddress(ownerAddressPreVestingPrivate) &&
      !incomingDepositFinalizedVestingPrivate
    ) {
      // transfer tokens to pre vesting
      const sendTokenToPreVestingForPrivateSaleTX = await sendTokenToPreVestingForPrivateSale();
      await notifyTransfer(sendTokenToPreVestingForPrivateSaleTX.wait(1), "PrivateSale TokenPreVesting");

      // create bulk vesting schedule
      const vestingScheduleForPrivateSaleTx = await createBulkVestingScheduleForPrivateSale();
      await notifyBulkVestingSchedule(vestingScheduleForPrivateSaleTx.wait(1), "PrivateSale");
    }
  };

  const handleChange = e => {
    setRound(e.target.value);
  };

  useEffect(() => {
    setDisableTGEButton(
      !active ||
        !enoughTokenBalance ||
        !isValidCliff ||
        !isValidDuration ||
        !isValidTGE ||
        getAddress(account as string) != getAddress(ownerAddressPretimelockSeed) ||
        getAddress(account as string) != getAddress(ownerAddressPreVestingSeed) ||
        getAddress(account as string) != getAddress(ownerAddressPretimelockPrivate) ||
        getAddress(account as string) != getAddress(ownerAddressPreVestingPrivate) ||
        incomingDepositFinalizedTimelockSeed ||
        incomingDepositFinalizedVestingSeed ||
        incomingDepositFinalizedTimelockPrivate ||
        incomingDepositFinalizedVestingPrivate,
    );
  }, [
    round,
    active,
    enoughTokenBalance,
    isValidCliff,
    isValidDuration,
    isValidTGE,
    account,
    ownerAddressPretimelockSeed,
    ownerAddressPreVestingSeed,
    ownerAddressPretimelockPrivate,
    ownerAddressPreVestingPrivate,
    incomingDepositFinalizedTimelockSeed,
    incomingDepositFinalizedVestingSeed,
    incomingDepositFinalizedTimelockPrivate,
    incomingDepositFinalizedVestingPrivate,
  ]);

  const parseCSV = (data: any) => {
    const amountsArr = Object.values(data.map(d => parseUnits(d.amount, tokenDecimals)));
    console.log(amountsArr)
    let totalAmount = BigNumber.from("0");
    for (let i = 0; i < amountsArr.length; i++) {
      totalAmount = totalAmount.add(BigNumber.from(amountsArr[i]));
    }
    setEnoughTokenBalance(BigNumber.from(tokenBalance?.raw.toString()).gte(totalAmount));
    const beneficiariesArr = data.map(d => d.beneficiary);
    console.log(beneficiariesArr)
    setBeneficiaries(beneficiariesArr);
    const cliffsArr = new Array(beneficiariesArr.length).fill(cliff);
    setCliffs(cliffsArr);
    const tges = new Array(beneficiariesArr.length).fill(
      BigNumber.from(new BN(availableTge).multipliedBy("100").toString()),
      0,
    );
    setTges(tges);
    const nonVestingAmountsArr = Object.values(
      amountsArr.map(x =>
        BigNumber.from(x)
          .mul(BigNumber.from(new BN(availableTge.toString()).multipliedBy("100").toString()))
          .div("10000"),
      ),
    );
    setNonVestingAmt(nonVestingAmountsArr);
    const vestingAmountsArr = Object.values(amountsArr.map((x, i) => BigNumber.from(x).sub(nonVestingAmountsArr[i])));
    setVestingAmt(vestingAmountsArr);
    let nonVestingAmountTotal: BigNumber = BigNumber.from(0);
    let vestingAmountTotal: BigNumber = BigNumber.from(0);
    for (let i = 0; i < vestingAmountsArr.length; i++) {
      nonVestingAmountTotal = nonVestingAmountTotal.add(nonVestingAmountsArr[i]);
      vestingAmountTotal = vestingAmountTotal.add(vestingAmountsArr[i]);
    }
    setTotalNonVestingAmt(nonVestingAmountTotal.toString());
    setTotalVestingAmt(vestingAmountTotal.toString());
    const durationArr = new Array(amountsArr.length).fill(BigNumber.from(duration), 0);
    setDurations(durationArr);
    const slicesPerSecondsArr = new Array(amountsArr.length).fill(BigNumber.from("1"), 0);
    setSlice(slicesPerSecondsArr);
    const revocablesArr = new Array(amountsArr.length).fill(false, 0);
    setRevocables(revocablesArr);
  };

  const onFileUpload = () => {
    const input = inputRef ? inputRef.current : 0;
    const reader = new FileReader();
    const [file]: any = input && input.files;
    reader.onloadend = ({ target }) => {
      const csv = Papa.parse(target?.result, { header: true });
      if (chainId !== undefined) {
        if (chainId !== undefined) {
          if (csv && csv.data) {
            parseCSV(csv.data);
          }
        }
      } else {
        console.log("Please connect to web3");
      }
    };
    reader.readAsText(file);
  };

  const onChangeCliff = e => {
    e.preventDefault();
    setCliff(e.target.value);
    setIsValidCliff(typeof parseInt(e.target.value) == "number" && parseInt(e.target.value) >= 0);
  };

  const onChangeDuration = e => {
    e.preventDefault();
    setDuration(e.target.value);
    setIsValidDuration(typeof parseInt(e.target.value) == "number" && parseInt(e.target.value) >= 0);
  };

  const onChangeTGE = e => {
    e.preventDefault();
    setAvailableTge(e.target.value);
    setIsValidTGE(typeof parseInt(e.target.value) == "number" && parseInt(e.target.value) >= 0);
  };

  return (
    <div>
      {/* <!-- Section --> */}
      <div id="about-page" className="page">
        <div className="container">
          <div className="row">
            <div className="text col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
              <div className="container card-0 justify-content-center ">
                <div className="card-body px-sm-4 px-0">
                  <div className="row justify-content-center mb-5">
                    <div className="col-md-10 col">
                      <h3 className="font-weight-bold ml-md-0 mx-auto text-center text-sm-left"> PreSale Dashboard</h3>
                      <p className="font-weight-bold ml-md-0 mx-auto text-center text-sm-left">
                        {" "}
                        {`Send ${tokenSymbol} PreSale Setting.`}
                      </p>
                    </div>
                  </div>
                  <div className="row justify-content-center round">
                    <div className="col-lg-10 col-md-12 ">
                      <form
                        className="sign-up-form form-1 fadeInUp wow"
                        id="myForm"
                        method="post"
                        action="#"
                        encType="multipart/form-data"
                        data-wow-duration="2s"
                      >
                        <div className="card shadow-lg card-1">
                          {/* <div className="row justify-content-end mb-5"> */}
                          {/* <div className="col-lg-12 col-auto "> */}
                          {/* <button
                                type="button"
                                className="btn btn-primary btn-block"
                                disabled={!active}
                                onClick={handleStartSale}
                              >
                                <small className="font-weight-bold">Start</small>
                              </button> */}
                          {/* <button
                                type="button"
                                className="btn btn-danger btn-block"
                                onClick={handleEndSale}
                                disabled={!active}
                              >
                                <small className="font-weight-bold">Stop</small>
                              </button> */}
                          {/* <button type="button" className="btn btn-success btn-block">
                                <small className="font-weight-bold">Transfer Ownership</small>
                              </button>
                              <button type="button" className="btn btn-primary btn-block" onClick={dispCsvData}>
                                <small className="font-weight-bold">Display CSV data</small>
                              </button> */}
                          {/* </div> */}
                          {/* </div> */}
                          <div className="card-body inner-card border">
                            <div className="row justify-content-between text-left">
                              <div className="form-group col-sm-6 flex-column d-flex">
                                {" "}
                                <label className="form-control-label px-3">
                                  Available on tge
                                  <span className="text-danger"> *(in %)</span>
                                </label>{" "}
                                <input
                                  type="number"
                                  id="availableontge"
                                  name="availableontge"
                                  placeholder="Available on tge"
                                  value={availableTge}
                                  onChange={e => onChangeTGE(e)}
                                />{" "}
                              </div>
                              <div className="form-group col-sm-6 flex-column d-flex">
                                {" "}
                                <label className="form-control-label px-3">
                                  Duration<span className="text-danger"> *(in seconds)</span>
                                </label>
                                <input
                                  type="number"
                                  id="Duration"
                                  name="Duration"
                                  placeholder="Duration"
                                  value={duration}
                                  min={0}
                                  step={1}
                                  onChange={e => onChangeDuration(e) /*setDuration(e.target.value)*/}
                                />{" "}
                              </div>
                              {/* <div className="form-group col-sm-6 flex-column d-flex">
                                {" "}
                                <label className="form-control-label px-3">
                                  Cliff period<span className="text-danger"> *</span>
                                </label>
                                <input
                                  type="number"
                                  id="Cliffperiod"
                                  name="Cliffperiod"
                                  placeholder="Cliff period"
                                  value={cliffPeriod}
                                  onChange={e => setCliffPeriod(e.target.value)}
                                />{" "}
                              </div> */}
                            </div>
                            <div className="row justify-content-center text-left">
                              <div className="form-group col-sm-6 flex-column d-flex">
                                {" "}
                                <label className="form-control-label px-3">
                                  Cliff<span className="text-danger"> *(in seconds)</span>
                                </label>
                                <input
                                  type="number"
                                  id="cliff"
                                  name="cliff"
                                  placeholder="cliff"
                                  value={cliff}
                                  min={0}
                                  step={1}
                                  onChange={e => onChangeCliff(e) /*setCliff(e.target.value)*/}
                                />{" "}
                              </div>
                            </div>
                            <div className="row justify-content-center">
                              <div className="col-md-12 col-lg-10 col-12">
                                <div className="form-group files">
                                  <label className="my-auto">Upload private sale or seed round csv file </label>{" "}
                                  <div>
                                    <input
                                      ref={inputRef}
                                      type="file"
                                      disabled={!isValidTGE || !isValidDuration || !isValidCliff}
                                      className="form-control"
                                      onChange={() => onFileUpload()}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="seed"
                                value="seed"
                                checked={round === "seed"}
                                onChange={e => handleChange(e)}
                              />
                              <label className="form-check-label ms-3" htmlFor="seed">
                                SEED Round
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="private"
                                value="private"
                                checked={round === "private"}
                                onChange={e => handleChange(e)}
                              />
                              <label className="form-check-label  ms-3" htmlFor="private">
                                Private Round
                              </label>
                            </div>
                            <div className="row justify-content-center">
                              <div className="col-md-12 col-lg-10 col-12">
                                <div className="row justify-content-end mb-5">
                                  <div className="col-lg-4 col-auto ">
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-block"
                                      onClick={e => handleSendTGETokensNow(e)}
                                      disabled={
                                        // !active ||
                                        // !enoughTokenBalance ||
                                        // !isValidCliff ||
                                        // !isValidDuration ||
                                        // !isValidTGE
                                        disableTGEButton
                                      }
                                    >
                                      <small className="font-weight-bold">Send tge tokens now</small>
                                    </button>{" "}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <TokenPreTimeLock
                            title="SeedRoundTokenPreTimeLock"
                            preTimelockAddress={seedPreTimelockAddress}
                            isIDO={false}
                          />

                          <TokenPreVesting
                            title="SeedRoundTokenPreVesting"
                            tokenPreVestingAddress={seedTokenPreVesting}
                            isIDO={false}
                          />

                          <TokenPreTimeLock
                            title="PrivateRoundTokenPreTimeLock"
                            preTimelockAddress={privatePreTimelockAddress}
                            isIDO={false}
                          />

                          <TokenPreVesting
                            title="PrivateRoundTokenPreVesting"
                            tokenPreVestingAddress={privateTokenPreVesting}
                            isIDO={false}
                          />

                          <TokenPreSale title="IDOTokenPreSale" tokenPreSaleAddress={idoTokenPreSaleAddress} />

                          <TokenPreTimeLock
                            title="IDOTokenPreTimeLock"
                            preTimelockAddress={tokenAddressIDOPretimelock}
                            isIDO={true}
                          />

                          <TokenPreVesting
                            title="IDOTokenPreVesting"
                            tokenPreVestingAddress={tokenAddressIDOPreVesting}
                            isIDO={true}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
