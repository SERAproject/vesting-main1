import React, { ReactNode } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Head from "next/head";
import Image from "next/image";
// import Link from "next/link";
import { useEagerConnect } from "../hooks/useEagerConnect";
import Account from "./Account";

type Props = {
  children?: ReactNode;
  title?: string;
};

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider);
}

export default function Layout({ children, title = "This is the default title" }: Props): JSX.Element {
  // automatically try connecting to the injected connector on pageload
  const triedToEagerConnect = useEagerConnect();
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      {/* <div> */}
        <Head>
          <title>{title}</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <div className="navigation">
          <nav className="navbar navbar-light fixed-top">
            <div className="container">
              <a className="navbar-brand" href="https://seraproject.org/">
                <Image
                  src="https://seraproject.org/views/front//images/logo.png"
                  width="50px"
                  height="60px"
                  alt="Logo"
                ></Image>
              </a>
              {/* <ul className="navbar-nav custom d-none d-sm-none d-md-none d-lg-block d-xl-block d-xxl-block">
                <li className="nav-item">
                  <Link href="/vesting">
                    <a className="nav-link">Claim</a>
                  </Link>
                  <Link href="/presale">
                    <a className="nav-link">Presale</a>
                  </Link>
                  <Link href="/dashboard">
                    <a className="nav-link">Dashboard</a>
                  </Link>
                </li>
              </ul> */}
              <div>
                {(
                  <Account triedToEagerConnect={triedToEagerConnect} />
                )}
              </div>
            </div>
          </nav>
        </div>
        {/* end Header */}
        {children}
        {/* START SECTION */}
        <section className="custom-social2" id="Socials">
          <div className="container">
            <div className="row">
              <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="heading">
                  <h2 className="title">Join Sera Community</h2>
                </div>
                <div className="text">
                  <p></p>
                </div>
                <ul className="social2">
                  <li>
                    <a href="https://twitter.com/Project_SERA">
                      <span>
                        <i className="bi bi-twitter"></i>
                      </span>
                      <span>
                        <a>Twitter</a>
                      </span>
                    </a>
                  </li>

                  <li>
                    <a href="https://t.me/Sera_Project">
                      <span>
                        <i className="bi bi-telegram"></i>
                      </span>
                      <span>
                        <a>Telegram</a>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="https://bit.ly/SERA_Project">
                      <span>
                        <i className="bi bi-youtube"></i>
                      </span>
                      <span>
                        <a>Youtube</a>
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* END SECTION */}
        {/* START FOOTER */}
        <footer className="footer" id="footer">
          <div className="container">
            <div className="row">
              <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-12 col-sm-12">
                <div data-aos-delay="500" data-aos="fade-right" className="text"></div>
              </div>
              <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-12 col-sm-12"></div>
            </div>
            <div className="row">
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="copyrights">
                  <p>SERA Technologies Ltd. Copyright © 2021-2022. All rights reserved.</p>
                </div>
              </div>
              <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="copyrights">
                  <p>Sera is Beta group company</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
        {/* END FOOTER */}
        {/* Footer closed */}
      {/* </div> */}
    </Web3ReactProvider>
  );
}
