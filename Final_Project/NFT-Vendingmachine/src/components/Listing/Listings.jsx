import React from "react";
import { ethers } from "ethers";
import tradingABI from "../ContractABI/TradingABI.json";
import ListingTemplate from "./ListingTemplate";
import Message from "../Messages/Message";
import { alchemy } from "../../constants/AlchemyConfig";
import { errorCodeMapping } from "../../constants/ErrorCodes";
import {
  SuccessMessageType,
  ErrorMessageType,
} from "../../constants/MessageTypes";
import { TradingContractAddress } from "../../constants/ContractAddresses";

export class Listings extends React.Component {
  constructor() {
    super();
    this.handleBuyNFT = this.handleBuyNFT.bind(this);
    this.handleResetMessage = this.handleResetMessage.bind(this);
    this.parseListings = this.parseListings.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.resetState = this.resetState.bind(this);

    this.state = {
      MessageVisible: false,
      MessageType: "",
      Message: "",
      parsedListings: null,
      TradingContract: null,
      accountConnected: false,
      web3Provider: null,
    };
  }
  async componentDidMount() {
    await this.parseListings();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    }
  }
  handleAccountsChanged = async () => {
    this.resetState();
    await this.parseListings();
  };
  resetState() {
    this.setState({
      MessageVisible: false,
      MessageType: "",
      Message: "",
      parsedListings: null,
      TradingContract: null,
      accountConnected: false,
      web3Provider: null,
    });
    this.forceUpdate();
  }
  async parseListings() {
    if (!window.ethereum) {
      this.resetState();
      return; //todo error
    }
    const web3Provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await web3Provider.send("eth_accounts");
    let TradingContract;
    if (accounts.length > 0) {
      const signer = await web3Provider.getSigner();
      TradingContract = new ethers.Contract(
        TradingContractAddress,
        tradingABI,
        signer
      );
      this.setState({ accountConnected: true });
    } else {
      TradingContract = new ethers.Contract(
        TradingContractAddress,
        tradingABI,
        web3Provider
      );
    }
    this.setState({
      TradingContract: TradingContract,
      web3Provider: web3Provider,
    });

    const allListedNFTs = await TradingContract.getAllListings();
    if (allListedNFTs.length == 0) {
      this.setState({ parsedListings: null });
      return;
    }
    const parsedListings = allListedNFTs.map((listing) => {
      if (listing.exists) {
        return {
          id: Number(listing.id),
          price: Number(listing.price),
          nftAddress: listing.nftAddress,
          tokenID: Number(listing.tokenID),
          owner: listing.owner,
          exists: listing.exists,
        };
      }
    });

    await parsedListings.map(async (listedNFT, index) => {
      const nftMetaData = await alchemy.nft.getNftMetadata(
        listedNFT.nftAddress,
        listedNFT.tokenID.toString(),
        "ERC721"
      );
      let nftData = parsedListings[index];
      nftData.description = nftMetaData.description;
      nftData.title = nftMetaData.title;
      let nft_img = "";
      if (nftMetaData.media.length > 0) {
        nft_img = nftMetaData.media[0].gateway;
      } else {
        nft_img = nftMetaData.tokenUri.gateway;
      }
      nftData.imgLink = nft_img;
      nftData.name = nftMetaData.contract.name;
      parsedListings[index] = nftData;
      this.setState({ parsedListings: parsedListings });
      this.forceUpdate();
    });
  }

  async handleBuyNFT(listingID) {
    const TradingContract = this.state.TradingContract;
    const BuyingItem = await TradingContract.getListing(listingID);
    const parsedListing = {
      id: Number(BuyingItem.id),
      price: Number(BuyingItem.price),
      nftAddress: BuyingItem.nftAddress,
      tokenID: Number(BuyingItem.tokenID),
      owner: BuyingItem.owner,
      exists: BuyingItem.exists,
    };
    if (parsedListing.exists) {
      try {
        const tx = await TradingContract.buyItem(listingID, {
          value: BuyingItem.price,
        });
        this.setState({
          MessageVisible: true,
          Message:
            "Your Transaction to buy asset " +
            parsedListing.tokenID +
            " is on the way!",
          MessageType: SuccessMessageType,
        });
        await tx.wait();
        await this.parseListings();
        this.setState({
          MessageVisible: true,
          Message: "Successfully bought asset Nr: " + parsedListing.tokenID,
          MessageType: SuccessMessageType,
        });
      } catch (error) {
        if (error.message.includes("revert")) {
          this.setState({
            MessageVisible: true,
            MessageType: ErrorMessageType,
            Message: error.message.split('"')[1].trim(),
          });
        } else {
          this.setState({
            MessageVisible: true,
            MessageType: ErrorMessageType,
            Message:
              errorCodeMapping[error.code] || `Buying failed: ${error.message}`,
          });
        }
      }
    } else {
      this.setState({
        MessageVisible: true,
        MessageType: ErrorMessageType,
        Message: "Sorry! Seems like this listing is no longer available",
      });
    }
  }

  handleResetMessage() {
    this.setState({
      MessageVisible: false,
      Message: "",
      MessageType: "",
    });
  }

  render() {
    const { parsedListings } = this.state;
    return (
      <div className="prose p-4">
        <h1>All Listings!</h1>
        <div className="flex">
          {parsedListings ? (
            <div className="grid grid-cols-3 gap-2 w-45 h-30">
              {parsedListings.map((nftListing, index) => {
                if (nftListing.imgLink != undefined) {
                  return (
                    <div class="card card-compact glass p-4 mb-4" key={index}>
                      <ListingTemplate
                        address={nftListing.nftAddress}
                        tokenID={nftListing.tokenID}
                        nft_img={nftListing.imgLink}
                        name={nftListing.name}
                        title={nftListing.title}
                        description={nftListing.description}
                        ListingNR={nftListing.id}
                      />
                      <h3>
                        {ethers
                          .formatEther(nftListing.price.toString())
                          .toString()}{" "}
                        ETH
                      </h3>
                      <div class="card-actions justify-center text-center">
                        {this.state.accountConnected ? (
                          <button
                            className="btn btn-primary font-bold rounded-full"
                            onClick={() => this.handleBuyNFT(nftListing.id)}
                          >
                            Buy NFT!
                          </button>
                        ) : (
                          <p>
                            You need to connect Metamask in order to Buy an
                            item!
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <h2 className="p-4">No Listings found!</h2>
          )}
        </div>
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
