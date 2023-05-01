import { useEffect, useState } from "react";
import React from "react";
import Navigation from "./components/Head/navigation/navigation";
import "./App.css";
import Feety from "./components/Footer/footer";
import { ethers } from "ethers";
import { SEPOLIA_CHAIN_ID } from "./constants/ETH_ChainId";
import { WariningMessageType } from "./constants/MessageTypes";
import Message from "./components/Messages/Message";
function App() {
  let signer;
  let formattedAddress = "Connect Wallet!";
  let connected = false;
  const [WalletState, SetWalletState] = useState(formattedAddress);
  const [WalletConnected, SetWalletConnected] = useState(connected);
  const [Signer, SetSigner] = useState(signer);
  const [Provider, setProvider] = useState();
  const [ErrorMessage, setErrorMessage] = useState("");
  const [ErrorMessageVisible, ErrorMessageSetVisible] = useState(false);
  const [MessageVisible, setMessageVisible] = useState("hidden");
  const [isLoading, setLoading] = useState(true);
  const getAccount = async () => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();
      console.log(Number(network.chainId));
      if (Number(network.chainId) != SEPOLIA_CHAIN_ID) {
        console.log("Fired");
        setMessageVisible("");
        setTimeout(() => {
          setMessageVisible("hidden");
        }, 6000);
      }
      const accounts = await web3Provider.send("eth_accounts");
      if (accounts.length > 0) {
        await web3Provider.send("eth_requestAccounts", []);
        signer = await web3Provider.getSigner();
        SetSigner(signer);
        const address = signer.address;
        formattedAddress = `${address.substring(0, 4)}...${address.substring(
          address.length - 5,
          address.length
        )}`;
        SetWalletState(formattedAddress);
        SetWalletConnected(true);
      }
    }
  };
  useEffect(() => {
    async function getData() {
      await getAccount();
      setLoading(false);
    }
    getData();
  }, [isLoading]);

  return (
    <div className="flex flex-col h-screen items-center">
      {!isLoading ? (
        <Navigation
          WalletState={WalletState}
          SetWalletState={SetWalletState}
          WalletConnected={WalletConnected}
          SetWalletConnected={SetWalletConnected}
          Provider={Provider}
          ErrorMessageSetVisible={ErrorMessageSetVisible}
          SetSigner={SetSigner}
          Signer={Signer}
          setErrorMessage={setErrorMessage}
        />
      ) : (
        ""
      )}
      <div class={`alert flex items-end justify-end ${MessageVisible}`}>
        <div className="bg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="black"
            viewBox="0 0 24 24"
            class="stroke-info flex-shrink-0 w-6 h-6 text-yellow"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div className="flex-none text-black">
            <h3 class="font-bold">Network Provider!</h3>
            <div class="text-xs">
              Caution this application is only deployed on Sepolia Network!
            </div>
          </div>
        </div>
      </div>

      <Feety />
    </div>
  );
}

export default App;
