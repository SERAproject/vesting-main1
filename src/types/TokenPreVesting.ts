/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export declare namespace TokenPreVesting {
  export type VestingScheduleStruct = {
    initialized: boolean;
    beneficiary: string;
    cliff: BigNumberish;
    duration: BigNumberish;
    slicePeriodSeconds: BigNumberish;
    revocable: boolean;
    amountTotal: BigNumberish;
    released: BigNumberish;
    revoked: boolean;
    tge: BigNumberish;
  };

  export type VestingScheduleStructOutput = [
    boolean,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    boolean,
    BigNumber,
    BigNumber,
    boolean,
    BigNumber
  ] & {
    initialized: boolean;
    beneficiary: string;
    cliff: BigNumber;
    duration: BigNumber;
    slicePeriodSeconds: BigNumber;
    revocable: boolean;
    amountTotal: BigNumber;
    released: BigNumber;
    revoked: boolean;
    tge: BigNumber;
  };
}

export interface TokenPreVestingInterface extends utils.Interface {
  contractName: "TokenPreVesting";
  functions: {
    "allIncomingDepositsFinalised()": FunctionFragment;
    "computeNextVestingScheduleIdForHolder(address)": FunctionFragment;
    "computeReleasableAmount(bytes32)": FunctionFragment;
    "computeVestingScheduleIdForAddressAndIndex(address,uint256)": FunctionFragment;
    "createVestingSchedule(address,uint256,uint256,uint256,bool,uint256,uint256)": FunctionFragment;
    "getCurrentTime()": FunctionFragment;
    "getLastVestingScheduleForHolder(address)": FunctionFragment;
    "getToken()": FunctionFragment;
    "getVestingIdAtIndex(uint256)": FunctionFragment;
    "getVestingSchedule(bytes32)": FunctionFragment;
    "getVestingScheduleByAddressAndIndex(address,uint256)": FunctionFragment;
    "getVestingSchedulesCount()": FunctionFragment;
    "getVestingSchedulesCountByBeneficiary(address)": FunctionFragment;
    "getVestingSchedulesTotalAmount()": FunctionFragment;
    "getWithdrawableAmount()": FunctionFragment;
    "initialTimestamp()": FunctionFragment;
    "owner()": FunctionFragment;
    "release(bytes32,uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "revoke(bytes32)": FunctionFragment;
    "setTimestamp(uint256)": FunctionFragment;
    "start()": FunctionFragment;
    "timestampSet()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "allIncomingDepositsFinalised",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "computeNextVestingScheduleIdForHolder",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "computeReleasableAmount",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "computeVestingScheduleIdForAddressAndIndex",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createVestingSchedule",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      boolean,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentTime",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getLastVestingScheduleForHolder",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "getToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getVestingIdAtIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingSchedule",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingScheduleByAddressAndIndex",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingSchedulesCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingSchedulesCountByBeneficiary",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingSchedulesTotalAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getWithdrawableAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialTimestamp",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "release",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "revoke", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "setTimestamp",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "start", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "timestampSet",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "allIncomingDepositsFinalised",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeNextVestingScheduleIdForHolder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeReleasableAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeVestingScheduleIdForAddressAndIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createVestingSchedule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLastVestingScheduleForHolder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getVestingIdAtIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingSchedule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingScheduleByAddressAndIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingSchedulesCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingSchedulesCountByBeneficiary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingSchedulesTotalAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWithdrawableAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initialTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "release", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revoke", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "start", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "timestampSet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Released(uint256)": EventFragment;
    "Revoked()": EventFragment;
    "VestingScheduleCreated(address,bytes32)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Released"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Revoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "VestingScheduleCreated"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type ReleasedEvent = TypedEvent<[BigNumber], { amount: BigNumber }>;

export type ReleasedEventFilter = TypedEventFilter<ReleasedEvent>;

export type RevokedEvent = TypedEvent<[], {}>;

export type RevokedEventFilter = TypedEventFilter<RevokedEvent>;

export type VestingScheduleCreatedEvent = TypedEvent<
  [string, string],
  { beneficiary: string; vestingScheduleId: string }
>;

export type VestingScheduleCreatedEventFilter =
  TypedEventFilter<VestingScheduleCreatedEvent>;

export interface TokenPreVesting extends BaseContract {
  contractName: "TokenPreVesting";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TokenPreVestingInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    allIncomingDepositsFinalised(overrides?: CallOverrides): Promise<[boolean]>;

    computeNextVestingScheduleIdForHolder(
      holder: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    computeReleasableAmount(
      vestingScheduleId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    computeVestingScheduleIdForAddressAndIndex(
      holder: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    "createVestingSchedule(address,uint256,uint256,uint256,bool,uint256,uint256)"(
      _beneficiary: string,
      _cliff: BigNumberish,
      _duration: BigNumberish,
      _slicePeriodSeconds: BigNumberish,
      _revocable: boolean,
      _amount: BigNumberish,
      _tge: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "createVestingSchedule(address[],uint256[],uint256[],uint256[],bool[],uint256[],uint256[])"(
      _beneficiaries: string[],
      _cliffs: BigNumberish[],
      _durations: BigNumberish[],
      _slicePeriodSeconds: BigNumberish[],
      _revocables: boolean[],
      _amounts: BigNumberish[],
      _tges: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getCurrentTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    getLastVestingScheduleForHolder(
      holder: string,
      overrides?: CallOverrides
    ): Promise<[TokenPreVesting.VestingScheduleStructOutput]>;

    getToken(overrides?: CallOverrides): Promise<[string]>;

    getVestingIdAtIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getVestingSchedule(
      vestingScheduleId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[TokenPreVesting.VestingScheduleStructOutput]>;

    getVestingScheduleByAddressAndIndex(
      holder: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[TokenPreVesting.VestingScheduleStructOutput]>;

    getVestingSchedulesCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    getVestingSchedulesCountByBeneficiary(
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getVestingSchedulesTotalAmount(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getWithdrawableAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    initialTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    release(
      vestingScheduleId: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revoke(
      vestingScheduleId: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setTimestamp(
      _timePeriodInSeconds: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    start(overrides?: CallOverrides): Promise<[BigNumber]>;

    timestampSet(overrides?: CallOverrides): Promise<[boolean]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  allIncomingDepositsFinalised(overrides?: CallOverrides): Promise<boolean>;

  computeNextVestingScheduleIdForHolder(
    holder: string,
    overrides?: CallOverrides
  ): Promise<string>;

  computeReleasableAmount(
    vestingScheduleId: BytesLike,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  computeVestingScheduleIdForAddressAndIndex(
    holder: string,
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  "createVestingSchedule(address,uint256,uint256,uint256,bool,uint256,uint256)"(
    _beneficiary: string,
    _cliff: BigNumberish,
    _duration: BigNumberish,
    _slicePeriodSeconds: BigNumberish,
    _revocable: boolean,
    _amount: BigNumberish,
    _tge: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "createVestingSchedule(address[],uint256[],uint256[],uint256[],bool[],uint256[],uint256[])"(
    _beneficiaries: string[],
    _cliffs: BigNumberish[],
    _durations: BigNumberish[],
    _slicePeriodSeconds: BigNumberish[],
    _revocables: boolean[],
    _amounts: BigNumberish[],
    _tges: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getCurrentTime(overrides?: CallOverrides): Promise<BigNumber>;

  getLastVestingScheduleForHolder(
    holder: string,
    overrides?: CallOverrides
  ): Promise<TokenPreVesting.VestingScheduleStructOutput>;

  getToken(overrides?: CallOverrides): Promise<string>;

  getVestingIdAtIndex(
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getVestingSchedule(
    vestingScheduleId: BytesLike,
    overrides?: CallOverrides
  ): Promise<TokenPreVesting.VestingScheduleStructOutput>;

  getVestingScheduleByAddressAndIndex(
    holder: string,
    index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<TokenPreVesting.VestingScheduleStructOutput>;

  getVestingSchedulesCount(overrides?: CallOverrides): Promise<BigNumber>;

  getVestingSchedulesCountByBeneficiary(
    _beneficiary: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getVestingSchedulesTotalAmount(overrides?: CallOverrides): Promise<BigNumber>;

  getWithdrawableAmount(overrides?: CallOverrides): Promise<BigNumber>;

  initialTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  release(
    vestingScheduleId: BytesLike,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revoke(
    vestingScheduleId: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setTimestamp(
    _timePeriodInSeconds: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  start(overrides?: CallOverrides): Promise<BigNumber>;

  timestampSet(overrides?: CallOverrides): Promise<boolean>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    allIncomingDepositsFinalised(overrides?: CallOverrides): Promise<boolean>;

    computeNextVestingScheduleIdForHolder(
      holder: string,
      overrides?: CallOverrides
    ): Promise<string>;

    computeReleasableAmount(
      vestingScheduleId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    computeVestingScheduleIdForAddressAndIndex(
      holder: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "createVestingSchedule(address,uint256,uint256,uint256,bool,uint256,uint256)"(
      _beneficiary: string,
      _cliff: BigNumberish,
      _duration: BigNumberish,
      _slicePeriodSeconds: BigNumberish,
      _revocable: boolean,
      _amount: BigNumberish,
      _tge: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "createVestingSchedule(address[],uint256[],uint256[],uint256[],bool[],uint256[],uint256[])"(
      _beneficiaries: string[],
      _cliffs: BigNumberish[],
      _durations: BigNumberish[],
      _slicePeriodSeconds: BigNumberish[],
      _revocables: boolean[],
      _amounts: BigNumberish[],
      _tges: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    getCurrentTime(overrides?: CallOverrides): Promise<BigNumber>;

    getLastVestingScheduleForHolder(
      holder: string,
      overrides?: CallOverrides
    ): Promise<TokenPreVesting.VestingScheduleStructOutput>;

    getToken(overrides?: CallOverrides): Promise<string>;

    getVestingIdAtIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getVestingSchedule(
      vestingScheduleId: BytesLike,
      overrides?: CallOverrides
    ): Promise<TokenPreVesting.VestingScheduleStructOutput>;

    getVestingScheduleByAddressAndIndex(
      holder: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<TokenPreVesting.VestingScheduleStructOutput>;

    getVestingSchedulesCount(overrides?: CallOverrides): Promise<BigNumber>;

    getVestingSchedulesCountByBeneficiary(
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingSchedulesTotalAmount(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWithdrawableAmount(overrides?: CallOverrides): Promise<BigNumber>;

    initialTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    release(
      vestingScheduleId: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    revoke(
      vestingScheduleId: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setTimestamp(
      _timePeriodInSeconds: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    start(overrides?: CallOverrides): Promise<BigNumber>;

    timestampSet(overrides?: CallOverrides): Promise<boolean>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(amount: BigNumberish, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Released(uint256)"(amount?: null): ReleasedEventFilter;
    Released(amount?: null): ReleasedEventFilter;

    "Revoked()"(): RevokedEventFilter;
    Revoked(): RevokedEventFilter;

    "VestingScheduleCreated(address,bytes32)"(
      beneficiary?: null,
      vestingScheduleId?: null
    ): VestingScheduleCreatedEventFilter;
    VestingScheduleCreated(
      beneficiary?: null,
      vestingScheduleId?: null
    ): VestingScheduleCreatedEventFilter;
  };

  estimateGas: {
    allIncomingDepositsFinalised(overrides?: CallOverrides): Promise<BigNumber>;

    computeNextVestingScheduleIdForHolder(
      holder: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    computeReleasableAmount(
      vestingScheduleId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    computeVestingScheduleIdForAddressAndIndex(
      holder: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "createVestingSchedule(address,uint256,uint256,uint256,bool,uint256,uint256)"(
      _beneficiary: string,
      _cliff: BigNumberish,
      _duration: BigNumberish,
      _slicePeriodSeconds: BigNumberish,
      _revocable: boolean,
      _amount: BigNumberish,
      _tge: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "createVestingSchedule(address[],uint256[],uint256[],uint256[],bool[],uint256[],uint256[])"(
      _beneficiaries: string[],
      _cliffs: BigNumberish[],
      _durations: BigNumberish[],
      _slicePeriodSeconds: BigNumberish[],
      _revocables: boolean[],
      _amounts: BigNumberish[],
      _tges: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getCurrentTime(overrides?: CallOverrides): Promise<BigNumber>;

    getLastVestingScheduleForHolder(
      holder: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getToken(overrides?: CallOverrides): Promise<BigNumber>;

    getVestingIdAtIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingSchedule(
      vestingScheduleId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingScheduleByAddressAndIndex(
      holder: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingSchedulesCount(overrides?: CallOverrides): Promise<BigNumber>;

    getVestingSchedulesCountByBeneficiary(
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingSchedulesTotalAmount(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWithdrawableAmount(overrides?: CallOverrides): Promise<BigNumber>;

    initialTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    release(
      vestingScheduleId: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revoke(
      vestingScheduleId: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setTimestamp(
      _timePeriodInSeconds: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    start(overrides?: CallOverrides): Promise<BigNumber>;

    timestampSet(overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    allIncomingDepositsFinalised(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    computeNextVestingScheduleIdForHolder(
      holder: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    computeReleasableAmount(
      vestingScheduleId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    computeVestingScheduleIdForAddressAndIndex(
      holder: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "createVestingSchedule(address,uint256,uint256,uint256,bool,uint256,uint256)"(
      _beneficiary: string,
      _cliff: BigNumberish,
      _duration: BigNumberish,
      _slicePeriodSeconds: BigNumberish,
      _revocable: boolean,
      _amount: BigNumberish,
      _tge: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "createVestingSchedule(address[],uint256[],uint256[],uint256[],bool[],uint256[],uint256[])"(
      _beneficiaries: string[],
      _cliffs: BigNumberish[],
      _durations: BigNumberish[],
      _slicePeriodSeconds: BigNumberish[],
      _revocables: boolean[],
      _amounts: BigNumberish[],
      _tges: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getCurrentTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getLastVestingScheduleForHolder(
      holder: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getVestingIdAtIndex(
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingSchedule(
      vestingScheduleId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingScheduleByAddressAndIndex(
      holder: string,
      index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingSchedulesCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingSchedulesCountByBeneficiary(
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingSchedulesTotalAmount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getWithdrawableAmount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialTimestamp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    release(
      vestingScheduleId: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revoke(
      vestingScheduleId: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setTimestamp(
      _timePeriodInSeconds: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    start(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    timestampSet(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}