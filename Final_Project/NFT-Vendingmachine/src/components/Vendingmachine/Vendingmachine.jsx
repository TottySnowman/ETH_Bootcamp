import abi from "../ContractABI/VendingmachineABI.json";
import { ethers } from "ethers";
import React from "react";
import {
  SuccessMessageType,
  ErrorMessageType,
} from "../../constants/MessageTypes";
import { VendingmachineAddress } from "../../constants/ContractAddresses";
import Message from "../Messages/Message";
import UpdatePrice from "./UpdatePrice";
import RestockSoda from "./Restock";
export class Vendingmachine extends React.Component {
  constructor() {
    super();
    this.state = {
      price: 0,
      left: 0,
      sold: 0,
      self_minted: 0,
      MessageVisible: false,
      MessageType: "",
      Message: "",
      isOwner: false,
      withdrawableAmount: 0,
      VendingmachineContract: null,
      web3Provider: null,
      isLoading: true,
    };
    this.handleBuySoda = this.handleBuySoda.bind(this);
    this.getVendingmachineDetails = this.getVendingmachineDetails.bind(this);
    this.handleResetMessage = this.handleResetMessage.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.handleShowMessage = this.handleShowMessage.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.resetState = this.resetState.bind(this);
  }
  async componentDidMount() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    }

    try {
      await this.getVendingmachineDetails();
    } catch (error) {
      if (error.message.includes("revert")) {
        this.setState({
          MessageVisible: true,
          MessageType: ErrorMessageType,
          Message: error.message.split('"')[1].trim(),
        });
        this.forceUpdate();
      }
    }
  }
  async handleAccountsChanged() {
    this.resetState();
    await this.getVendingmachineDetails();
  }
  resetState() {
    this.setState({
      price: 0,
      left: 0,
      sold: 0,
      self_minted: 0,
      MessageVisible: false,
      MessageType: "",
      Message: "",
      isOwner: false,
      withdrawableAmount: 0,
      VendingmachineContract: null,
      web3Provider: null,
      isLoading: true,
    });
    this.forceUpdate();
  }
  async getVendingmachineDetails() {
    if (!window.ethereum) {
      this.resetState();
      this.setState({ isLoading: false });
      return;
    }
    const web3Provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await web3Provider.send("eth_accounts");
    let VendingmachineContract;
    if (accounts.length > 0) {
      const signer = await web3Provider.getSigner();
      VendingmachineContract = new ethers.Contract(
        VendingmachineAddress,
        abi,
        signer
      );
      this.setState({ VendingmachineContract: VendingmachineContract });
      const ownerAddy = await VendingmachineContract.owner();
      if (ownerAddy == signer.address) {
        const withdrawableAmount =
          await VendingmachineContract.getAddressWithdrawAmount();
        this.setState({
          isOwner: true,
          withdrawableAmount: ethers
            .formatEther(withdrawableAmount.toString())
            .toString(),
        });
      }
    } else {
      VendingmachineContract = new ethers.Contract(
        VendingmachineAddress,
        abi,
        web3Provider
      );
    }

    let new_state = {
      price: ethers
        .formatEther(await VendingmachineContract.soda_price())
        .toString(),
      left: (await VendingmachineContract.soda_amount()).toString(),
      sold: (await VendingmachineContract.sold_sodas()).toString(),
      web3Provider: web3Provider,
      isLoading: false,
    };

    try {
      new_state.self_minted = (
        await VendingmachineContract.getMySodas()
      ).toString();
    } catch (error) {
      if (error.message.includes("revert")) {
        new_state.self_minted = error.message.split('"')[1].trim();
      }
    }
    this.setState(new_state);
  }

  async handleWithdraw() {
    const signer = await this.state.web3Provider.getSigner();

    let VendingmachineContract = new ethers.Contract(
      VendingmachineAddress,
      abi,
      signer
    );
    try {
      const tx = await VendingmachineContract.withdraw();
      this.setState({
        MessageVisible: true,
        MessageType: SuccessMessageType,
        Message: "Withdrawing...",
      });
      this.forceUpdate();
      await tx.wait();
      this.setState({
        MessageVisible: true,
        MessageType: SuccessMessageType,
        Message: "Successfully withdrawn!",
      });
    } catch (error) {
      if (error.message.includes("revert")) {
        this.setState({
          MessageVisible: true,
          MessageType: ErrorMessageType,
          Message: error.message.split('"')[1].trim(),
        });
        this.forceUpdate();
      } else {
        this.setState({
          MessageVisible: true,
          MessageType: ErrorMessageType,
          Message:
            errorCodeMapping[error.code] || `Withdraw failed: ${error.message}`,
        });
      }
    }
  }
  async handleBuySoda() {
    await this.state.web3Provider.send("eth_requestAccounts", []);
    const signer = await this.state.web3Provider.getSigner();
    let VendingmachineContract = new ethers.Contract(
      VendingmachineAddress,
      abi,
      signer
    );
    let price = await VendingmachineContract.soda_price();
    let transaction;
    try {
      transaction = await VendingmachineContract.purchaseSoda({
        value: price,
      });
      this.setState({
        MessageVisible: true,
        MessageType: SuccessMessageType,
        Message: "Your soda is on the way!",
      });
    } catch (error) {
      if (error.message.includes("revert")) {
        this.setState({
          MessageVisible: true,
          MessageType: ErrorMessageType,
          Message: error.message.split('"')[1].trim(),
        });
        return;
      } else {
        this.setState({
          MessageVisible: true,
          MessageType: ErrorMessageType,
          Message:
            errorCodeMapping[error.code] ||
            `Failed to buy a soda: ${error.message}`,
        });
      }
    }

    await transaction.wait();
    await this.getVendingmachineDetails();
    this.setState({
      MessageVisible: true,
      MessageType: SuccessMessageType,
      Message: "Soda minted!",
    });
  }
  handleResetMessage() {
    this.setState({
      MessageVisible: false,
      Message: "",
    });
  }
  handleShowMessage(messageType, message, messageVisible) {
    this.setState({
      MessageVisible: messageVisible,
      MessageType: messageType,
      Message: message,
    });
  }
  render() {
    const { isLoading, isOwner, price } = this.state;
    if (isLoading) {
      return (
        <div className="prose p-4">
          <h1>Loading Vendingmachine data...</h1>
        </div>
      );
    }
    return (
      <div className="prose p-4">
        {price ? (
          <>
            <h1>The Vendingmachine!</h1>
            <p>Amount bought sodas: {this.state.sold}</p>
            <p>Available sodas for now: {this.state.left} </p>
            <p>Current price for a single soda: {this.state.price} ETH</p>
            <button className="btn btn-secondary" onClick={this.handleBuySoda}>
              Buy a soda!
            </button>
            <p>You bought yourself: {this.state.self_minted} Sodas!</p>
            {isOwner ? (
              <div className="border">
                <h2>Owner Dashboard</h2>
                <div className="flex items-center">
                  <p className="w-1/2 font-bold">
                    Currently the withdrawble amount is:{" "}
                    {this.state.withdrawableAmount} ETH!
                  </p>
                  <button
                    onClick={this.handleWithdraw}
                    className="btn btn-primary w-1/2 m-4"
                  >
                    Withdraw now!
                  </button>
                </div>
                <div>
                  <UpdatePrice
                    VendingmachineContract={this.state.VendingmachineContract}
                    handleShowMessage={this.handleShowMessage}
                    LoadVendingmachineDetails={this.getVendingmachineDetails}
                    currentPrice={price}
                  />
                </div>
                <div>
                  <RestockSoda
                    VendingmachineContract={this.state.VendingmachineContract}
                    handleShowMessage={this.handleShowMessage}
                    LoadVendingmachineDetails={this.getVendingmachineDetails}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <div className="border rounded border-primary">
            <h2 className="m-0 p-4">
              Whoops seems like Metamask is not connected!
            </h2>
          </div>
        )}
        <Message
          MessageVisible={this.state.MessageVisible}
          Message={this.state.Message}
          MessageType={this.state.MessageType}
          handleResetMessage={this.handleResetMessage}
        />
      </div>
    );
  }
}
