import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";
import type { Fixture } from "ethereum-waffle";
import { TokenVesting, Token, ERC20, TokenSale } from "../src/types";
import { MockTokenVesting } from "../src/types/MockTokenVesting";

declare module "mocha" {
  export interface Context {
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
    token: ERC20;
    testToken: Token;
    tokenVesting: TokenVesting;
    mockTokenVesting: MockTokenVesting;
    busd: ERC20;
    usdt: ERC20;
    tokenSale: TokenSale;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  owner: SignerWithAddress;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  charlie: SignerWithAddress;
  beneficiary: SignerWithAddress;
}
