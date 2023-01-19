import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { getNetwork, injected } from "../connectors";
import { addresses, desiredChain } from "../constants";
import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { formatEtherscanLink, shortenHex } from "../utils";
import { useTokenBalance } from "../hooks/useTokenBalance";
import { TokenAmount } from "@uniswap/sdk";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import { useCallback } from "react";
import { useTokenSymbol } from "../hooks/useTokenSymbol";
import { Web3Provider } from "@ethersproject/providers";
import { useQueryParameters } from "../hooks/useQueryParameters";
import { QueryParameters } from "../constants";

type AccountProps = {
  triedToEagerConnect: boolean;
};

const Account = ({ triedToEagerConnect }: AccountProps) => {
  const { active, error, activate, chainId, account, setError } = useWeb3React<Web3Provider>();
  const { isMetaMaskInstalled, startOnboarding, stopOnboarding } = useMetaMaskOnboarding();

  //  initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>();
  useLayoutEffect(() => {
    onboarding.current = new MetaMaskOnboarding();
  }, []);

  // automatically try connecting to the network connector where applicable
  const queryParameters = useQueryParameters();
  const requiredChainId = queryParameters[QueryParameters.CHAIN];
  useEffect(() => {
    if (triedToEagerConnect && !active && !error) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      activate(getNetwork(requiredChainId));
    }
  }, [triedToEagerConnect, active, error, requiredChainId, activate]);

  const { data: symbol } = useTokenSymbol(
    chainId !== undefined ? (chainId as number) : desiredChain.chainId,
    chainId !== undefined
      ? addresses[chainId as number].ERC20_TOKEN_ADDRESS
      : addresses[desiredChain.chainId as number].ERC20_TOKEN_ADDRESS,
  );
  const { data: balance } = useTokenBalance(
    chainId !== undefined ? (chainId as number) : desiredChain.chainId,
    account as string,
    null,
  );

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);
  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      onboarding.current?.stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  const handleConnect = useCallback(async () => {
    if (window.ethereum?.isMetaMask) {
      console.log("hello");
      try {
        await (window as any).ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexlify(desiredChain.chainId) }], // binance testnet chain id (in hexadecimal)
        });
        activate(injected, undefined, true).catch(error => {
          // ignore the error if it's a user rejected request
          if (error instanceof UserRejectedRequestError) {
            setConnecting(false);
          } else {
            setError(error);
          }
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  ...desiredChain,
                  chainId: ethers.utils.hexlify(desiredChain.chainId),
                },
              ],
            });
            activate(injected, undefined, true).catch(error => {
              // ignore the error if it's a user rejected request
              if (error instanceof UserRejectedRequestError) {
                setConnecting(false);
              } else {
                setError(error);
              }
              toast.error(`${switchError.code}:${switchError?.message}`, {
                position: toast.POSITION.TOP_RIGHT,
              });
            });
          } catch (addError: any) {
            setError(addError);
            toast.error(`${switchError.code}:${switchError?.message}`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        } else {
          toast.error(`${switchError.code}:${switchError?.message}`, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } else {
      return (
        <div>
          <button onClick={startOnboarding}>Install Metamask</button>
        </div>
      );
    }
  }, [chainId, activate, setError, startOnboarding]);

  const ENSName = useENSName(account as string);
  if (error) {
    return null;
  } else if (!triedToEagerConnect) {
    return null;
  } else if (typeof account !== "string") {
    return (
      <div>
        {isMetaMaskInstalled ? (
          <button className="btn btn-green btn-launch-app" disabled={connecting} onClick={() => handleConnect()}>
            Connect
            <span>
              <i className="bi bi-app-indicator"></i>
            </span>
          </button>
        ) : (
          <button onClick={startOnboarding}>Install Metamask</button>
        )}
      </div>
    );
  }
  return (
    <>
      <span className="tokenAmt">
        <a
          {...{
            href: formatEtherscanLink("Account", [chainId as number, account]),
            target: "_blank",
            rel: "noopener noreferrer",
            className: "tokenAmt",
          }}
        >
          {ENSName || `${shortenHex(account, 4)}`} &nbsp;|&nbsp;{" "}
          {account != undefined &&
            balance != undefined &&
            (balance as TokenAmount).toSignificant(4, { groupSeparator: "," })}{" "}
          {symbol?.toUpperCase()}
        </a>
      </span>
    </>
  );
};

export default Account;
