/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useTimeLockContractAddress, useVestingContractAddress } from "../hooks/useTokenPreSale";
import { useWeb3React } from "@web3-react/core";
import { useVestingScheduleCountBeneficiary } from "../hooks/useTokenPreVesting";
import { addresses, desiredChain } from "../constants";
import Claim from "../components/Claim";
import ClaimTGE from "../components/ClaimTGE";
import { useTokenSymbol } from "../hooks/useTokenSymbol";

function Vesting(): JSX.Element {
  const { account, chainId } = useWeb3React();

  const { data: tokenSymbol } = useTokenSymbol(
    chainId != undefined ? (chainId as number) : (desiredChain.chainId as number),
    addresses[chainId != undefined ? (chainId as number) : (desiredChain.chainId as number)].ERC20_TOKEN_ADDRESS,
  );

  // IDO
  const { data: vestingContractAddressForIDO } = useVestingContractAddress(
    chainId == undefined ? desiredChain.chainId : chainId,
  );
  const { data: timelockContractAddressForIDO } = useTimeLockContractAddress(
    chainId == undefined ? desiredChain.chainId : chainId,
  );
  const { data: vestingScheduleCountForIDO } = useVestingScheduleCountBeneficiary(
    vestingContractAddressForIDO,
    account as string,
  );

  // Seed
  const vestingContractAddressForSeedRound =
    addresses[chainId == undefined ? desiredChain.chainId : chainId].SEED_PRE_VESTING;
  const timelockAddressForSeedRound =
    addresses[chainId == undefined ? desiredChain.chainId : chainId].SEED_PRE_TIME_LOCK;
  const { data: vestingScheduleCountForSeedRound } = useVestingScheduleCountBeneficiary(
    vestingContractAddressForSeedRound,
    account as string,
  );

  // Private
  const vestingContractAddressForPrivateRound =
    addresses[chainId == undefined ? desiredChain.chainId : chainId].PRIVATE_SALE_PRE_VESTING;
  const timelockAddressForPrivateRound =
    addresses[chainId == undefined ? desiredChain.chainId : chainId].PRIVATE_SALE_PRE_TIME_LOCK;

  const { data: vestingScheduleCountForPrivateRound } = useVestingScheduleCountBeneficiary(
    vestingContractAddressForPrivateRound,
    account as string,
  );

  
  return (
    <div className="light">
      {/* SECTION  */}
      <section className="about">
        <div className="container">
          <div className="row">
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <div className="heading">
                <h2 className="title">About Vesting Schedule</h2>
              </div>
              <div className="text">
                <p>
                  {" "}
                  Daily linear vesting on a block-by-block basis.Please don’t claim too frequently as you have to pay
                  gas fee every time you claim.{" "}
                </p>
                <p>
                  {" "}
                  <h2 className="titlenew2">
                    {tokenSymbol} :{" "}
                    {addresses[chainId !== undefined ? (chainId as number) : desiredChain.chainId].ERC20_TOKEN_ADDRESS}
                  </h2>
                </p>
              </div>
            </div>
            <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <div className="about-image"></div>
            </div>
          </div>
        </div>
      </section>
      <section id="about-page" className="page">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-xs-12">
              {/* STYLES   */}
              <div className="container mt-5 mb-3">
                <div className="row">
                  {/* <div className="col-md-4">
        </div> */}
                  <div className="col-md-4">
                    <div className="card p-3 mb-2">
                      <div className="heading newhead">
                        <h2 className="title">Seed Round Tokens</h2>
                      </div>
                      <div>
                        <ClaimTGE
                          timelockContractAddress={timelockAddressForSeedRound}
                          token={addresses[chainId == undefined ? desiredChain.chainId : chainId].ERC20_TOKEN_ADDRESS}
                        />
                        {vestingScheduleCountForSeedRound &&
                          vestingScheduleCountForSeedRound > 0 &&
                          Array.from({ length: vestingScheduleCountForSeedRound }, (_, index) => index).map(
                            _vestingScheduleIndex => (
                              <Claim
                                vestingContractAddress={vestingContractAddressForSeedRound}
                                key={_vestingScheduleIndex}
                                vestingScheduleIndex={_vestingScheduleIndex}
                              />
                            ),
                          )}
                      </div>
                    </div>
                  </div>
                  {/* SECTION FOR DISPLAYING TOKEN VESTING INFORMATION */}
                  <div className="col-md-4">
                    <div className="card p-3 mb-2">
                      <div className="heading newhead">
                        <h2 className="title">IDO ROUND</h2>
                      </div>
                      <div>
                        <ClaimTGE
                          timelockContractAddress={timelockContractAddressForIDO}
                          token={addresses[chainId == undefined ? desiredChain.chainId : chainId].ERC20_TOKEN_ADDRESS}
                        />
                        {vestingScheduleCountForIDO &&
                          vestingScheduleCountForIDO > 0 &&
                          Array.from({ length: vestingScheduleCountForIDO }, (_, index) => index).map(
                            _vestingScheduleIndex => (
                              <Claim
                                vestingContractAddress={vestingContractAddressForIDO}
                                key={_vestingScheduleIndex}
                                vestingScheduleIndex={_vestingScheduleIndex}
                              />
                            ),
                          )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card p-3 mb-2">
                      <div className="heading newhead">
                        <h2 className="title">Private Round tokens</h2>
                      </div>
                      <div>
                        <ClaimTGE
                          timelockContractAddress={timelockAddressForPrivateRound}
                          token={addresses[chainId == undefined ? desiredChain.chainId : chainId].ERC20_TOKEN_ADDRESS}
                        />
                        {vestingScheduleCountForPrivateRound &&
                          vestingScheduleCountForPrivateRound > 0 &&
                          Array.from({ length: vestingScheduleCountForPrivateRound }, (_, index) => index).map(
                            _vestingScheduleIndex => (
                              <Claim
                                vestingContractAddress={vestingContractAddressForPrivateRound}
                                key={_vestingScheduleIndex}
                                vestingScheduleIndex={_vestingScheduleIndex}
                              />
                            ),
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

Vesting.propTypes = {};
export default Vesting;
