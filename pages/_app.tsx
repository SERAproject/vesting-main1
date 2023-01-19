import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import { ToastContainer } from 'react-toastify';
import getLibrary from "../getLibrary";
import Layout from "../components/Layout";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css'
import "../styles/lib/css/bootstrap-icons.css";
import "../styles/lib/css/aos.css";
import "../styles/css/ltr/mz-l.css";
import "../styles/css/custom.css";
import "../images/favicon.png";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Layout title="SERA private sale">
        <Component {...pageProps} />
        <ToastContainer />
      </Layout>
    </Web3ReactProvider>
  );
}

export default MyApp;
