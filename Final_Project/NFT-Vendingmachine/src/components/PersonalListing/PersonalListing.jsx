import React from "react";
import { ethers } from "ethers";
import nftABI from "../ContractABI/NFTABI.json";
import tradingABI from "../ContractABI/TradingABI.json";
import ListingTemplate from "../Listing/ListingTemplate";
import Message from "../Messages/Message";
import { errorCodeMapping } from "../../constants/ErrorCodes";
import {
  SuccessMessageType,
  ErrorMessageType,
} from "../../constants/MessageTypes";
import { alchemy } from "../../constants/AlchemyConfig";
import {
  TradingContractAddress,
  NFTContractAddress,
} from "../../constants/ContractAddresses";
export class PersonalListing extends React.Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      modalTitle: "",
      modalPrice: "",
      modalDescription: "",
      modalAssetID: "",
      modalAssetAddy: "",
      modalAssetImg: "",
      isApproved: false,
      ownedNFTs: null,
      parsedListings: null,
      MessageVisible: false,
      MessageType: "",
      Message: "",
      TradingContract: null,
      NFTContract: null,
      amountToWithdraw: 0,
      isLoading: true,
      web3Provider: null,
    };
    this.handleListItemModal = this.handleListItemModal.bind(this);
    this.handleListItem = this.handleListItem.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleCancelItem = this.handleCancelItem.bind(this);
    this.loadPersonalListings = this.loadPersonalListings.bind(this);
    this.handleResetMessage = this.handleResetMessage.bind(this);
    this.handleWithdraw = this.handleWithdraw.bind(this);
    this.handleRevokeAccess = this.handleRevokeAccess.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.resetState = this.resetState.bind(this);
  }
  async componentDidMount() {
    await this.loadPersonalListings();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", this.handleAccountsChanged);
    }
  }
  async handleAccountsChanged() {
    this.resetState();
    await this.loadPersonalListings();
  }
  resetState() {
    this.setState({
      modalVisible: false,
      modalTitle: "",
      modalPrice: "",
      modalDescription: "",
      modalAssetID: "",
      modalAssetAddy: "",
      modalAssetImg: "",
      isApproved: false,
      ownedNFTs: null,
      parsedListings: null,
      MessageVisible: false,
      MessageType: "",
      Message: "",
      TradingContract: null,
      NFTContract: null,
      amountToWithdraw: 0,
      isLoading: true,
      web3Provider: null,
    });
    this.forceUpdate();
  }
  async loadPersonalListings() {
    if (!window.ethereum) {
      this.resetState();
      this.setState({ isLoading: false });
      return;
    }
    const web3Provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await web3Provider.send("eth_accounts");
    if (accounts.length == 0) {
      this.setState({
        TradingContract: null,
        NFTContract: null,
        ownedNFTs: null,
        isApproved: false,
        parsedListings: null,
        isLoading: false,
        web3Provider: web3Provider,
      });
      this.forceUpdate();
      return;
    }

    const signer = await web3Provider.getSigner();
    const NFT_Contract = new ethers.Contract(
      NFTContractAddress,
      nftABI,
      signer
    );
    const TradingContract = new ethers.Contract(
      TradingContractAddress,
      tradingABI,
      signer
    );
    const isApproved = await NFT_Contract.isApprovedForAll(
      signer.address,
      TradingContractAddress
    );
    if (!isApproved) {
      this.setState({
        isLoading: false,
        web3Provider: web3Provider,
      });
      this.forceUpdate();
      return;
    }
    const ownedNFTs = await alchemy.nft.getNftsForOwner(signer.address);

    const amountToWithdraw = await TradingContract.getWithdrawableAmount();
    this.setState({
      ownedNFTs: ownedNFTs,
      isApproved: isApproved,
      TradingContract: TradingContract,
      NFTContract: NFT_Contract,
      amountToWithdraw: amountToWithdraw,
      isLoading: false,
      web3Provider: web3Provider,
    });
    this.forceUpdate();

    const listedNFTs = await TradingContract.getPersonalListings();
    if (listedNFTs.length == 0) {
      return;
    }

    let parsedListingsContract = listedNFTs.map((listing) => {
      return {
        id: Number(listing.id),
        price: Number(listing.price),
        nftAddress: listing.nftAddress,
        tokenID: Number(listing.tokenID),
        owner: listing.owner,
        exists: listing.exists,
      };
    });
    parsedListingsContract = parsedListingsContract.filter(
      (item) => item.exists
    );
    let parsedListings = [...parsedListingsContract];
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

  async handleCancelItem(listingID) {
    try {
      const TradingContract = this.state.TradingContract;
      const tx = await TradingContract.cancelListing(listingID);
      this.setState({
        MessageVisible: true,
        Message: "Canceling for listing: " + listingID + " is on the way!",
        MessageType: SuccessMessageType,
      });
      await tx.wait();

      this.setState({
        MessageVisible: true,
        Message: "Successfully canceled!",
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
            errorCodeMapping[error.code] ||
            `Failed to cancel: ${error.message}`,
        });
      }
    }
    this.setState({ parsedListings: null });
    await this.loadPersonalListings();
  }
  async handleListItem() {
    document.body.style.overflow = "unset";
    const TradingContract = this.state.TradingContract;
    try {
      const tx = await TradingContract.listItem(
        this.state.modalAssetID,
        this.state.modalAssetAddy,
        ethers.parseEther(this.state.modalPrice)
      );
      this.setState({
        MessageVisible: true,
        Message: "Listing asset Nr: " + this.state.modalAssetID,
        MessageType: SuccessMessageType,
      });
      this.setState({ modalVisible: "" });
      await tx.wait();
      await this.loadPersonalListings();
      this.setState({
        MessageVisible: true,
        Message:
          "Successfully listed asset Nr: " + this.state.modalAssetID + "!",
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
            errorCodeMapping[error.code] || `Listing failed: ${error.message}`,
        });
      }
    }
  }
  handleListItemModal(
    assetDescription,
    assetID,
    assetAddy,
    assetTitle,
    assetImg
  ) {
    this.setState({
      modalVisible: "",
      modalTitle: assetTitle,
      modalPrice: "",
      modalDescription: assetDescription,
      modalAssetID: assetID,
      modalAssetAddy: assetAddy,
      modalAssetImg: assetImg,
    });
    document.body.style.overflow = "hidden";
    this.setState({ modalVisible: "checked" });
  }
  handlePriceChange(event) {
    this.setState({ modalPrice: event.target.value });
  }
  async handleCloseModal() {
    document.body.style.overflow = "unset";
    this.setState({ modalVisible: "", modalPrice: "" });
  }
  async handleApprove() {
    console.log(this.state.web3Provider);
    const signer = await this.state.web3Provider.getSigner();
    const NFT_Contract = new ethers.Contract(
      NFTContractAddress,
      nftABI,
      signer
    );
    try {
      const tx = await NFT_Contract.setApprovalForAll(
        TradingContractAddress,
        true
      );
      this.setState({
        MessageVisible: true,
        Message: "Waiting for approval...",
        MessageType: SuccessMessageType,
      });
      await tx.wait();
      this.setState({
        MessageVisible: true,
        Message: "Successfully approved!",
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
            errorCodeMapping[error.code] ||
            `Approving failed: ${error.message}`,
        });
      }
    }
    await this.loadPersonalListings();
  }

  handleResetMessage() {
    this.setState({
      MessageVisible: false,
      Message: "",
      MessageType: "",
    });
  }
  async handleWithdraw() {
    try {
      const TradingContract = this.state.TradingContract;
      const transaction = await TradingContract.withdraw_amount();
      this.setState({
        MessageVisible: true,
        Message: "Withdrawing...",
        MessageType: SuccessMessageType,
      });
      await transaction.wait();
      this.setState({
        MessageVisible: true,
        Message: "Successfully withdrawn!",
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
            errorCodeMapping[error.code] ||
            `Failed to withdraw: ${error.message}`,
        });
      }
    }
    await this.loadPersonalListings();
  }
  async handleRevokeAccess() {
    const TradingContract = this.state.TradingContract;
    const listedNFTs = await TradingContract.getPersonalListings();
    listedNFTs.forEach((listedNFT) => {
      if (listedNFT.exists) {
        this.setState({
          MessageVisible: true,
          MessageType: ErrorMessageType,
          Message:
            "In order to disable the access you need to delist all your NFTs first!",
        });
        return;
      }
    });
    const NFT_Contract = this.state.NFTContract;
    try {
      const tx = await NFT_Contract.setApprovalForAll(
        TradingContractAddress,
        false
      );
      this.setState({
        MessageVisible: true,
        Message: "Waiting to rewoke approval...",
        MessageType: SuccessMessageType,
      });
      await tx.wait();
      this.setState({
        MessageVisible: true,
        Message: "No longer approved!",
        MessageType: SuccessMessageType,
      });
      await this.loadPersonalListings();
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
            errorCodeMapping[error.code] ||
            `Revert approval failed: ${error.message}`,
        });
      }
    }
  }
  render() {
    const { parsedListings, ownedNFTs, isApproved, isLoading } = this.state;
    if (isLoading) {
      return (
        <div className="prose p-4">
          <h1>Loading personal listings...</h1>
        </div>
      );
    }
    if (isApproved) {
      return (
        <div className="prose p-4">
          <div className="border m-5">
            <h2>Personal Dashboard</h2>
            <div className="">
              <div className="flex items-center justify-center">
                {ethers
                  .formatEther(this.state.amountToWithdraw.toString())
                  .toString() > 0 ? (
                  <>
                    <p className="w-1/2 font-bold">
                      You can withdraw:{" "}
                      {ethers
                        .formatEther(this.state.amountToWithdraw.toString())
                        .toString()}{" "}
                      ETH!
                    </p>
                    <button
                      className="btn btn-secondary w-1/2 m-4"
                      onClick={this.handleWithdraw}
                    >
                      Withdraw now!
                    </button>
                  </>
                ) : (
                  <div className="justify-center">
                    <p className="w-100 font-bold justify-center">
                      Nothing to withdraw yet!
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <p class="w-1/2 font-bold">You can revoke the access!</p>

                <button
                  onClick={this.handleRevokeAccess}
                  className="btn btn-info w-1/2 m-4"
                >
                  Revoke now!
                </button>
              </div>
            </div>
          </div>

          <h1 className="p-10">Personal Listings</h1>
          <h2>Not Listed NFTs</h2>

          {ownedNFTs ? (
            <div className="grid grid-cols-3 gap-2 w-45 h-30">
              {ownedNFTs.ownedNfts.map((nft, index) => {
                let nft_img = "";
                if (nft.media.length > 0) {
                  nft_img = nft.media[0].gateway;
                } else {
                  nft_img = nft.tokenUri.gateway;
                }
                return (
                  <div class="card card-compact glass p-4 mb-4" key={index}>
                    <ListingTemplate
                      address={nft.contract.address}
                      tokenID={nft.tokenId}
                      nft_img={nft_img}
                      name={nft.contract.name}
                      title={nft.title}
                      description={nft.description}
                    />
                    <div class="card-actions justify-center text-center">
                      {nft.contract.address ==
                      NFTContractAddress.toLowerCase() ? (
                        <button
                          className="btn btn-primary font-bold rounded-full"
                          onClick={() =>
                            this.handleListItemModal(
                              nft.description,
                              nft.tokenId,
                              nft.contract.address,
                              nft.contract.name,
                              nft_img
                            )
                          }
                        >
                          List now!
                        </button>
                      ) : (
                        <p>Sorry listing other NFTs is not implemented yet!</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <h2 className="prose p-4">No NFTs found!</h2>
          )}
          <h2>Listed NFTs</h2>
          {parsedListings ? (
            <div className="grid grid-cols-3 gap-2 w-45 h-30">
              {parsedListings.map((nftListing, index) => {
                if (nftListing.exists) {
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
                      <span className="font-bold">
                        {ethers
                          .formatEther(nftListing.price.toString())
                          .toString()}{" "}
                        ETH
                      </span>

                      <div class="card-actions justify-center text-center">
                        <button
                          className="btn btn-primary font-bold rounded-full"
                          onClick={() => {
                            this.handleCancelItem(nftListing.id);
                          }}
                        >
                          Cancel Listing
                        </button>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <h2 className="prose p-4">No current Listings!</h2>
          )}
          <input
            type="checkbox"
            id="listing_Modal"
            class="modal-toggle"
            checked={this.state.modalVisible}
          />
          <div class="modal">
            <form onSubmit={this.handleListItem}>
              <div class="modal-box">
                <h3 class="font-bold text-lg">
                  Listing of asset: {this.state.modalTitle}#
                  {this.state.modalAssetID}
                </h3>
                <p class="py-4">Description: {this.state.modalDescription}</p>
                <p>Contract address: {this.state.modalAssetAddy}</p>
                <div className="flex justify-center">
                  <figure>
                    <img
                      src={this.state.modalAssetImg}
                      alt="NFT"
                      className="w-60"
                    />
                  </figure>
                </div>

                <label>
                  Price in ETH:{" "}
                  <input
                    type="text"
                    name="price"
                    value={this.state.modalPrice}
                    onChange={this.handlePriceChange}
                    className="text-center"
                  />
                </label>
                <div class="modal-action">
                  <label
                    className="btn btn-secondary modal-button"
                    onClick={() => {
                      this.handleCloseModal();
                    }}
                  >
                    Close
                  </label>
                  <label
                    for="listing_Modal"
                    class="btn btn-primary modal-button"
                    onClick={() => {
                      this.handleListItem();
                    }}
                  >
                    List NFT!
                  </label>
                </div>
              </div>
            </form>
          </div>
          <Message
            MessageVisible={this.state.MessageVisible}
            Message={this.state.Message}
            MessageType={this.state.MessageType}
            handleResetMessage={this.handleResetMessage}
          />
        </div>
      );
    } else {
      return (
        <div className="p-4">
          <h1>
            In Order to list Sodas, you need to approve the Marketplace
            contract!
          </h1>
          <button className="btn btn-primary" onClick={this.handleApprove}>
            Here!
          </button>
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
}
