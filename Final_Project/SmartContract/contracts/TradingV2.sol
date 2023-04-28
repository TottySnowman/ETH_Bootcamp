// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./VendingmachineV4.sol";
import "hardhat/console.sol";

type ItemId is uint;
type ItemIndex is uint;

contract TradingV2 is Initializable {
    using Counters for Counters.Counter;
    Counters.Counter private _ListingID;
    uint public amount_listed;

    function initialize() public initializer {
        amount_listed = 0;
    }

    struct Listing {
        uint id;
        uint price;
        address nftAddress;
        uint tokenID;
        address owner;
        bool exists;
    }
    struct personalListing {
        address owner;
        Listing[] listings;
    }

    mapping(address => Listing[]) p_Listing;
    mapping(ItemId => ItemIndex) p_ListingIndex;

    mapping(uint => Listing) Listings;
    mapping(address => uint) withdrawable_amount;
    modifier notListed(address nftAddress, uint tokenID) {
        require(
            IERC721(nftAddress).ownerOf(tokenID) != address(this),
            "The NFT is already listed!"
        );
        _;
    }
    modifier isListed(uint ID) {
        Listing storage listi = Listings[ID];
        require(listi.exists, "Item is not listed!");
        _;
    }

    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    event Transfer(
        address indexed from,
        address indexed to,
        address nftAddress,
        uint256 indexed tokenId
    );

    function listItem(
        uint tokenID,
        address nftAddress,
        uint price
    ) public notListed(nftAddress, tokenID) {
        require(price > 0, "Price can't be initial");
        IERC721 nft = IERC721(nftAddress);
        require(
            nft.ownerOf(tokenID) == msg.sender,
            "You're not the owner of the NFT!"
        );
        require(
            nft.isApprovedForAll(msg.sender, address(this)),
            "The contract is not approved!"
        );

        nft.safeTransferFrom(msg.sender, address(this), tokenID);
        Listing memory new_listing = Listing(
            _ListingID.current(),
            price,
            nftAddress,
            tokenID,
            msg.sender,
            true
        );
        Listings[_ListingID.current()] = new_listing;
        Listing[] storage listings = p_Listing[msg.sender];
        listings.push(new_listing);
        amount_listed++;
        p_ListingIndex[ItemId.wrap(_ListingID.current())] = ItemIndex.wrap(
            listings.length - 1
        );
        _ListingID.increment();
        emit Transfer(msg.sender, address(this), nftAddress, tokenID);
    }

    function buyItem(uint listingID) public payable isListed(listingID) {
        Listing storage buyingItem = Listings[listingID];
        require(buyingItem.exists, "Listing does not exist!");
        require(buyingItem.owner != msg.sender, "You can't buy your own NFT!");
        require(msg.value >= buyingItem.price, "Price not met!");
        IERC721 nft = IERC721(buyingItem.nftAddress);
        nft.safeTransferFrom(address(this), msg.sender, buyingItem.tokenID);
        emit Transfer(
            address(this),
            msg.sender,
            buyingItem.nftAddress,
            buyingItem.tokenID
        );
        withdrawable_amount[buyingItem.owner] += msg.value;

        uint itemIndex = ItemIndex.unwrap(
            p_ListingIndex[ItemId.wrap(listingID)]
        );
        Listing storage listi = p_Listing[buyingItem.owner][itemIndex];
        listi.exists = false;
        amount_listed--;
        delete (Listings[listingID]);
    }

    function withdraw_amount() public payable {
        require(
            withdrawable_amount[msg.sender] > 0,
            "There's nothing to withdraw!"
        );

        bool sent = payable(msg.sender).send(withdrawable_amount[msg.sender]);
        require(sent, "Failed to Withdraw! Try again!");
        withdrawable_amount[msg.sender] = 0;
    }

    function getWithdrawableAmount() public view returns (uint) {
        return withdrawable_amount[msg.sender];
    }

    function cancelListing(uint listingID) public isListed(listingID) {
        uint itemIndex = ItemIndex.unwrap(
            p_ListingIndex[ItemId.wrap(listingID)]
        );
        Listing storage cancelItem = p_Listing[msg.sender][itemIndex];
        //Listing storage cancelItem = Listings[listingID];
        require(cancelItem.exists, "Listing does not exist!");
        require(cancelItem.owner == msg.sender, "You're not the Owner!");
        IERC721 nft = IERC721(cancelItem.nftAddress);
        nft.safeTransferFrom(address(this), msg.sender, cancelItem.tokenID);
        emit Transfer(
            address(this),
            msg.sender,
            cancelItem.nftAddress,
            cancelItem.tokenID
        );
        delete (Listings[listingID]);
        amount_listed--;
        //delete (pListings[msg.sender][listingID]);
        cancelItem.exists = false;
    }

    function getPersonalListings() public view returns (Listing[] memory) {
        return p_Listing[msg.sender];
    }

    function getAllListings() public view returns (Listing[] memory) {
        Listing[] memory allListings = new Listing[](amount_listed);
        uint count = 0;
        for (uint x = 0; x <= _ListingID.current(); x++) {
            if (Listings[x].exists) {
                allListings[count] = Listings[x];
                count++;
            }
        }

        return allListings;
    }

    function getListing(uint listingId) public view returns (Listing memory) {
        return Listings[listingId];
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
