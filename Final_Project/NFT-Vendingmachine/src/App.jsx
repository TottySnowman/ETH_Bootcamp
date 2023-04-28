import { useEffect, useState } from "react";
import React from "react";
import Navigation from "./components/Head/navigation/navigation";
import "./App.css";
import Feety from "./components/Footer/footer";
import { ethers } from "ethers";

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
  const [isLoading, setLoading] = useState(true);
  const getAccount = async () => {
    if (window.ethereum) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
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
      {isLoading ? (
        <div className="prose p-4">
          <h1>Loading...</h1>
        </div>
      ) : (
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
      )}

      <Feety />
    </div>
  );
}

export default App;
