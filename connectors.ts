import { NetworkConnector } from "@web3-react/network-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

import { INFURA_PREFIXES } from "./utils";
import { desiredChain } from "./constants";

export function getNetwork(defaultChainId = desiredChain.chainId): NetworkConnector {
  return new NetworkConnector({
    urls: [1, 3, 4, 5, 42, 31337, 1337, 97, 56].reduce((urls, chainId) => {
      return Object.assign(urls, {
        [chainId]:
          chainId == 31337 || chainId == 1337
            ? `http://localhost:8545`
            : chainId == 97
            ? `https://data-seed-prebsc-1-s1.binance.org:8545`
            : chainId == 56
            ? `https://bsc-dataseed.binance.org/`
            : `https://${INFURA_PREFIXES[chainId]}.infura.io/v3/79afc96778564bdf97fc989ed9310e32`,
      });
    }, {}),
    defaultChainId,
  });
}

export const injected = new InjectedConnector({ supportedChainIds: [desiredChain.chainId] });
