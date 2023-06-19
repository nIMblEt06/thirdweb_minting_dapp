import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThirdwebProvider, walletConnect, metamaskWallet, coinbaseWallet } from "@thirdweb-dev/react"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={"goerli"} supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()]}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);
