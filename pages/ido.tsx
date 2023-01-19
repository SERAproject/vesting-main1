import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Modal, Button, Form } from "react-bootstrap";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { formatEther, parseUnits } from "@ethersproject/units";
import moment from "moment";
import {
  useTokenAllowance,
  useBuyTokensWithBusd,
  useTxApprove,
  useBuyTokensWithUsdt,
  useBUSD,
  useUSDT,
} from "../hooks/useTokenSale";
import {
  useComputeTokensForBUSD,
  useComputeTokensForUSDT,
  usePreSaleFetchOwner,
  useExchangePriceUsdt,
  useVestingContractAddress,
  useTimeLockContractAddress,
} from "../hooks/useTokenPreSale";
import { useTokenBalanceSimple } from "../hooks/useTokenBalance";
import { useETHBalance } from "../hooks/useETHBalance";
import { addresses, desiredChain } from "../constants";
import {
  useGetSaleStatus,
  useMaxBuyAmountBusd,
  useMaxBuyAmountUSDT,
  useMinBuyAmountBusd,
  useMinBuyAmountUSDT,
} from "../hooks/useTokenPreSale";
import { useTokenSymbol } from "../hooks/useTokenSymbol";
import Countdown from "../components/Countdown";
import { useIncomingDepositsFinalisedPreVesting } from "../hooks/useTokenPreVesting";
import { useIncomingDepositsFinalisedTimelock } from "../hooks/useTokenPreTimelock";

const options: Highcharts.Options = {
  chart: {
    type: "pie",
    options3d: {
      enabled: true,
      alpha: 45,
    },
  },
  title: {
    text: "",
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
  },
  accessibility: {
    point: {
      valueSuffix: "%",
    },
  },
  colors: [
    "#BFBFF3",
    "#C0D0F2",
    "#A1C6FA",
    "#65ADFF",
    "#2C8EF9",
    "#0179F3",
    "#0A03FF",
    "#3522F8",
    "#5651E9",
    "#0A03FF",
    "#A19FF3",
    "#65ADFF",
  ],
  plotOptions: {
    pie: {
      innerSize: 210,
      depth: 45,
    },
  },
  series: [
    {
      name: "Tokenomics",
      colorByPoint: true,
      type: "pie",
      data: [
        {
          name: "Liquidity",
          y: 2,
        },
        {
          name: "SEED ROUND",
          y: 10,
        },
        {
          name: "Private Sale",
          y: 10,
        },
        {
          name: "Public Sale",
          y: 1.5,
        },
        {
          name: "Team",
          y: 18,
        },
        {
          name: "Marketing",
          y: 7.5,
        },
        {
          name: "Ecosystem",
          y: 25,
        },
        {
          name: "Advisors",
          y: 10,
        },
        {
          name: "Treasury and Reserve",
          y: 6,
        },
        {
          name: "Staking",
          y: 10,
        },
      ],
    },
  ],
  credits: {
    enabled: false,
  },
};

function PresaleModal(props) {
  const { chainId } = useWeb3React();
  const [checked] = React.useState<boolean>(false);
  const [checkoutShow] = React.useState<boolean>(false);
  const [mining, setMining] = React.useState<boolean>(false);
  const [txStatusMessage, setTxStatusMessage] = React.useState<string>("");
  const [busdAmount, setBusdAmount] = React.useState<string>("");
  const [usdtAmount, setUsdtAmount] = React.useState<string>("");

  const { data: busdAllowance } = useTokenAllowance(props.account as string, props.busd); //check allowance
  const { data: usdtAllowance } = useTokenAllowance(props.account as string, props.usdt); //check allowance
  const { data: ownerAddressIDOPreSale } = usePreSaleFetchOwner(
    chainId != undefined
      ? addresses[chainId as number].IDO_TOKEN_PRE_SALE
      : addresses[desiredChain.chainId].IDO_TOKEN_PRE_SALE,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: ownerPreSaleContractAllowance } = useTokenAllowance(
    ownerAddressIDOPreSale,
    chainId != undefined
      ? addresses[chainId as number].ERC20_TOKEN_ADDRESS
      : addresses[desiredChain.chainId].ERC20_TOKEN_ADDRESS,
  );

  const { data: minUsdt } = useMinBuyAmountUSDT(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: maxUsdt } = useMaxBuyAmountUSDT(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: minBusd } = useMinBuyAmountBusd(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: maxBusd } = useMaxBuyAmountBusd(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: tokenSymbol } = useTokenSymbol(
    chainId !== undefined ? (chainId as number) : desiredChain.chainId,
    chainId !== undefined
      ? addresses[chainId as number].ERC20_TOKEN_ADDRESS
      : addresses[desiredChain.chainId as number].ERC20_TOKEN_ADDRESS,
  );

  const approveBusdToken = useTxApprove(
    props.busd,
    busdAmount == "" ? BigNumber.from("0") : parseUnits(busdAmount, "18"),
    props.chainId,
  ); // send amount from user
  const approveUsdtToken = useTxApprove(
    props.usdt,
    usdtAmount == "" ? BigNumber.from("0") : parseUnits(usdtAmount, "18"),
    props.chainId,
  ); // send amount from user
  const buyTokensWithBusd = useBuyTokensWithBusd(
    busdAmount == "" ? BigNumber.from("0") : parseUnits(busdAmount, "18"),
    props.chainId !== undefined ? props.chainId : desiredChain.chainId,
  );
  const buyTokensWithUsdt = useBuyTokensWithUsdt(
    usdtAmount == "" ? BigNumber.from("0") : parseUnits(usdtAmount, "18"),
    props.chainId !== undefined ? props.chainId : desiredChain.chainId,
  );

  const tokenForBusd = useComputeTokensForBUSD(
    busdAmount == "" ? BigNumber.from("0") : parseUnits(busdAmount, "18"),
    props.chainId !== undefined ? props.chainId : desiredChain.chainId,
  );
  const tokenForUsdt = useComputeTokensForUSDT(
    usdtAmount == "" ? BigNumber.from("0") : parseUnits(usdtAmount, "18"),
    props.chainId !== undefined ? props.chainId : desiredChain.chainId,
  );

  const handleBuyTokenUsingBusd = async amount => {
    const _amountInDecimals = parseUnits(amount, "18");
    const _tokenForBusd = await tokenForBusd();
    if (BigNumber.from(ownerPreSaleContractAllowance).gte(_tokenForBusd)) {
      if (BigNumber.from(props.busdBalance).gte(_amountInDecimals)) {
        if (_amountInDecimals.gte(minBusd) && _amountInDecimals.lte(maxBusd)) {
          try {
            if (BigNumber.from(busdAllowance).gte(_amountInDecimals)) {
              setMining(true);
              setTxStatusMessage("Transaction is being processed...");
              const buyTokensWithBusdtx = await buyTokensWithBusd();
              await notifyBuy(buyTokensWithBusdtx.wait(1));
              setMining(false);
              setTxStatusMessage(`You got 2% ${tokenSymbol} at TGE and rest vested.`);
            } else {
              setMining(true);
              setTxStatusMessage("Transaction is being processed...");
              const approveBusdTokentx = await approveBusdToken();
              await notifyApprove(approveBusdTokentx.wait(1));
              const buyTokensWithBusdtx = await buyTokensWithBusd();
              await notifyBuy(buyTokensWithBusdtx.wait(1));
              setMining(false);
              setTxStatusMessage(`You got 2% ${tokenSymbol} at TGE and rest vested.`);
            }
          } catch (e: any) {
            setTxStatusMessage(e?.message as string);
            setMining(false);
          }
        } else {
          toast.warn(
            `You can buy token for minimum ${parseFloat(formatEther(minBusd)).toFixed(4)} or maximum ${parseFloat(
              formatEther(maxBusd),
            ).toFixed(4)} BUSD`,
          );
        }
      } else {
        toast.warn(`You do not have enough balance to buy token`);
      }
    } else {
      toast.info(`Insufficient token to sale`);
    }
  };

  const handleBuyTokensUsingUsdt = async amount => {
    const _amountInDecimals = parseUnits(amount, "18");
    const _tokenForUsdt = await tokenForUsdt();
    if (BigNumber.from(ownerPreSaleContractAllowance).gte(_tokenForUsdt)) {
      if (BigNumber.from(props.usdtBalance).gte(_amountInDecimals)) {
        if (_amountInDecimals.gte(minUsdt) && _amountInDecimals.lte(maxUsdt)) {
          try {
            if (BigNumber.from(usdtAllowance).gte(_amountInDecimals)) {
              setTxStatusMessage("Transaction is being processed...");
              setMining(true);
              const buyTokensWithUsdttx = await buyTokensWithUsdt();
              await notifyBuy(buyTokensWithUsdttx.wait(1));
              setMining(false);
              setTxStatusMessage(`You got 2% ${tokenSymbol} at TGE and rest vested."`);
            } else {
              setTxStatusMessage("Transaction is being processed...");
              setMining(true);
              const tx = await approveUsdtToken();
              await notifyApprove(tx.wait(1));
              const buyTokensWithUsdttx = await buyTokensWithUsdt();
              await notifyBuy(buyTokensWithUsdttx.wait(1));
              setMining(false);
              setTxStatusMessage(`You got 2% ${tokenSymbol} at TGE and rest vested.`);
            }
          } catch (e: any) {
            setTxStatusMessage(e?.message);
            setMining(false);
          }
        } else {
          toast.warn(
            `You can buy token for minimum ${parseFloat(formatEther(minUsdt)).toFixed(4)} or maximum ${parseFloat(
              formatEther(maxUsdt),
            ).toFixed(4)} USDT`,
          );
        }
      } else {
        toast.warn(`You do not have enough balance to buy token`);
      }
    } else {
      toast.info(`Insufficient token to sale`);
    }
  };

  const notifyApprove = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Approving token...`,
      success: `Tokens has been approved👌`,
      error: `Failed to approve tokens 🤯"`,
    });
  };

  const notifyBuy = async promiseObj => {
    await toast.promise(promiseObj, {
      pending: `Buying Tokens...`,
      success: `Tokens has been bought👌`,
      error: `Failed to buy tokens 🤯"`,
    });
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      {(!checked || !checkoutShow) && (
        <div>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <h4>Purchase {tokenSymbol} Token</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="form_one">
                <Form.Label className="amtLabel">BUSD Amount</Form.Label>
                <Form.Control
                  type="number"
                  className="amtTextbox"
                  placeholder="Enter BUSD amount"
                  value={busdAmount}
                  onChange={e => setBusdAmount(e.target.value)}
                  disabled={mining || !props.enoughBusd}
                />
                <Button
                  className="amtButton"
                  onClick={() => handleBuyTokenUsingBusd(busdAmount)}
                  disabled={mining || !props.enoughBusd}
                >
                  Buy Tokens with BUSD
                </Button>
                <span className="buylink">
                  Available Balance:{" "}
                  {props && props.busdBalance && parseFloat(formatEther(props.busdBalance)).toFixed(2)} BUSD
                </span>
              </Form.Group>
              <Form.Group controlId="form_two">
                <Form.Label className="amtLabel">USDT Amount</Form.Label>
                <Form.Control
                  type="number"
                  className="amtTextbox"
                  placeholder="Enter USDT amount"
                  value={usdtAmount}
                  onChange={e => setUsdtAmount(e.target.value)}
                  disabled={mining || !props.enoughUsdt}
                />
                <Button
                  className="amtButton"
                  onClick={() => handleBuyTokensUsingUsdt(usdtAmount)}
                  disabled={mining || !props.enoughUsdt}
                >
                  Buy Tokens with USDT
                </Button>
                <span className="buylink">
                  Available Balance:{" "}
                  {props && props.usdtBalance && parseFloat(formatEther(props.usdtBalance)).toFixed(2)} USDT
                </span>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {mining && <div>{txStatusMessage}</div>}
            <Button variant="primary" onClick={props.onHide}>
              Close
            </Button>
          </Modal.Footer>
        </div>
      )}
    </Modal>
  );
}

function IDO(): JSX.Element {
  const initialCountdownSettings: { [name: string]: string | number | null | undefined } = {
    dateValue: "04-25-2022",
    timeValue: "13:07",
    ampmValue: "pm",
    unixEndDate: Number(moment("04-25-2022 13:07 pm", "MM-DD-YYYY hh:mm A").format("X")),
  };
  const initialCountdownTimer = {
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  };

  const [checked, setChecked] = React.useState<boolean>(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [countdownSettings, setCountdownSettings] = useState({ ...initialCountdownSettings });
  const [countdownTimer, setCountdownTimer] = useState({ ...initialCountdownTimer });
  const { account, active, chainId } = useWeb3React();

  const { data: minUsdt } = useMinBuyAmountUSDT(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: maxUsdt } = useMaxBuyAmountUSDT(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: minBusd } = useMinBuyAmountBusd(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: maxBusd } = useMaxBuyAmountBusd(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: currentSaleStatus } = useGetSaleStatus(
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: busd } = useBUSD(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: usdt } = useUSDT(chainId == undefined ? desiredChain.chainId : (chainId as number));
  const { data: busdBalance } = useTokenBalanceSimple(
    chainId == undefined ? desiredChain.chainId : (chainId as number),
    account,
    busd as string,
  );
  const { data: usdtBalance } = useTokenBalanceSimple(
    chainId == undefined ? desiredChain.chainId : (chainId as number),
    account,
    usdt as string,
  );
  const { data: ethBalance } = useETHBalance(account);
  const [enoughBusd, setEnoughBusd] = React.useState<boolean>(false);
  const [enoughUsdt, setEnoughUsdt] = React.useState<boolean>(false);
  const [enoughEth, setEnoughEth] = React.useState<boolean>(false);

  const { data: tokenSymbol } = useTokenSymbol(
    chainId !== undefined ? (chainId as number) : desiredChain.chainId,
    chainId !== undefined
      ? addresses[chainId as number].ERC20_TOKEN_ADDRESS
      : addresses[desiredChain.chainId as number].ERC20_TOKEN_ADDRESS,
  );
  const { data: valueExchangePriceUsdt } = useExchangePriceUsdt(
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: tokenAddressIDOPreVesting } = useVestingContractAddress(
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );
  const { data: tokenAddressIDOPretimelock } = useTimeLockContractAddress(
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: incomingDepositFinalizedVestingSeed } = useIncomingDepositsFinalisedPreVesting(
    tokenAddressIDOPreVesting,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  const { data: incomingDepositFinalizedTimelockPrivate } = useIncomingDepositsFinalisedTimelock(
    tokenAddressIDOPretimelock,
    chainId == undefined ? desiredChain.chainId : (chainId as number),
  );

  useEffect(() => {
    busdBalance !== undefined &&
      minBusd !== undefined &&
      maxBusd !== undefined &&
      setEnoughBusd(BigNumber.from(busdBalance).gte(minBusd));
    usdtBalance !== undefined &&
      minUsdt !== undefined &&
      maxUsdt !== undefined &&
      setEnoughUsdt(BigNumber.from(usdtBalance).gte(minUsdt));
    ethBalance !== undefined && setEnoughEth(ethBalance.greaterThan("0"));
  }, [busdBalance, usdtBalance, ethBalance, account, minBusd, maxBusd, minUsdt, maxUsdt]);

  useEffect(() => {
    const timer = setInterval(() => playTimer(countdownSettings.unixEndDate as number), 1000);

    function playTimer(currentUnixEndDate: number) {
      const distance = currentUnixEndDate - Number(moment().format("X"));

      if (distance > 0) {
        setCountdownTimer(prevCountdownTimer => {
          return {
            ...prevCountdownTimer,
            days: parseInt(Number(distance / (60 * 60 * 24)).toString(), 10).toString(),
            hours: parseInt(Number((distance % (60 * 60 * 24)) / (60 * 60)).toString(), 10).toString(),
            mins: parseInt(Number((distance % (60 * 60)) / 60).toString(), 10).toString(),
            secs: parseInt(Number(distance % 60).toString(), 10).toString(),
          };
        });
      } else {
        setCountdownSettings({ ...initialCountdownSettings, unixEndDate: null });
        setCountdownTimer({ ...initialCountdownTimer });
      }
    }

    return () => {
      clearInterval(timer);
      // timer = null;
    };
  }, [countdownSettings, initialCountdownSettings, initialCountdownTimer]);

  function handleClick(e) {
    e.preventDefault();
    setModalShow(true);
  }

  return (
    <div>
      {/* <!-- Start Page --> */}
      <div id="about-page" className="page">
        <div id="about-page" className="page">
          <div className="container">
            <div className="row">
              <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="heading heading2">
                  {tokenSymbol && <h2 className="title">{tokenSymbol} IDO is Now Open</h2>}

                  {tokenSymbol && (
                    <div className="about-image Privatepage">
                      {tokenSymbol} token price :{" "}
                      {valueExchangePriceUsdt !== undefined ? `$${formatEther(valueExchangePriceUsdt)} USD` : `-`}
                    </div>
                  )}
                  <h2 className="title">Just One simple step to buy!</h2>
                </div>
              </div>
              <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 Presale_side">
                <div className="heading heading2">
                  {tokenSymbol && (
                    <h2 className="titlenew">
                      Participate in <span className="titlespan">{tokenSymbol} IDO</span> now
                    </h2>
                  )}
                </div>

                <div className="text col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <p style={{ marginBottom: "20px" }}>
                    Participate in one of the best chances, Just one round at the cheapest price!
                  </p>
                </div>
                <div className="about-image buycontainer">
                  <h2 className="titlenew2">Please check the Agreement before you proceed.</h2>
                  <div className="buylinkSection">
                    <input
                      id="terms"
                      type="checkbox"
                      name="terms"
                      value="on"
                      onChange={e => setChecked(!!e.target.checked)}
                    />
                    <a href="https://seraproject.org/terms.PDF" rel="noreferrer" className="buylink" target="_blank">
                      {" "}
                      I Agree to {tokenSymbol} Terms And Conditions{" "}
                    </a>
                  </div>
                  {/*  */}

                  <p className="titlespanbuynot">You Must Agree to {tokenSymbol} Terms And Conditions</p>

                  <div className="wrap">
                    <button
                      type="button"
                      id="trem_check"
                      className="btn btn-light trem_check"
                      onClick={e => handleClick(e)}
                      disabled={
                        !active ||
                        !checked ||
                        !enoughEth ||
                        !(enoughBusd || enoughUsdt) ||
                        (currentSaleStatus != undefined ? currentSaleStatus != "1" : true) ||
                        incomingDepositFinalizedVestingSeed == true ||
                        incomingDepositFinalizedVestingSeed == "true" ||
                        incomingDepositFinalizedTimelockPrivate == true ||
                        incomingDepositFinalizedTimelockPrivate == "true"
                      }
                    >
                      {" "}
                      Buy {tokenSymbol} Now{" "}
                    </button>
                    {/* SHOW PRESALE MODAL */}
                    <PresaleModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      chainId={chainId}
                      account={account}
                      busd={busd}
                      usdt={usdt}
                      busdBalance={busdBalance}
                      usdtBalance={usdtBalance}
                      enoughBusd={enoughBusd}
                      enoughUsdt={enoughUsdt}
                    />
                  </div>
                </div>
                {countdownSettings.unixEndDate ? (
                  <>
                    <h2 className="titlenew">We will be live in</h2>
                    <Countdown countdownTimer={countdownTimer} />
                  </>
                ) : (
                  <h2 className="titlespanbuynot2"> We are live Now !</h2>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- End Section --> */}
        <section id="about-page" className="page">
          <div className="container">
            <div className="row">
              <div className="col-xxl-12 col-xl-12 col-lg-112 col-sm-12 col-xs-12">
                <div className="heading">
                  <h2 className="title">Token Distribution</h2>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-xs-12">
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <!-- Footer --> */}
      {/* <Footer /> */}
    </div>
  );
}

IDO.propTypes = {};
export default IDO;
