// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract SnowmanToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    address public main_contract_addy;

    constructor() ERC721("SnowmanSoda", "SST") {}

    modifier onlyAddy() {
        console.log(msg.sender);
        require(main_contract_addy == msg.sender, "You're not the owner!");
        _;
    }

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function set_Addy(address proxy) public onlyOwner {
        console.log(msg.sender);
        main_contract_addy = proxy;
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract VendingmachineV3 is Initializable {
    uint public soda_amount;
    address public owner;
    mapping(address => uint) owners;
    uint public soda_price;
    uint public sold_sodas;
    address public SnowmanAddy;
    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner!");
        _;
    }

    modifier onlyMembers() {
        require(owners[msg.sender] > 0, "You're not a owner yet!");
        _;
    }

    event BoughtSoda(address indexed buyer, uint indexed tokenID);

    function initialize(
        uint _numSodas,
        address _snowmanAddress
    ) public initializer {
        soda_amount = _numSodas;
        owner = msg.sender;
        soda_price = 1000;
        sold_sodas = 0;
        SnowmanAddy = _snowmanAddress;
    }

    function purchaseSoda() public payable {
        require(soda_price > 0, "There's no free soda today!");
        require(msg.value >= 1000 wei, "You must pay 1000 wei for a soda!");
        require(soda_amount >= 1, "Out of soda!");
        soda_amount--;
        sold_sodas++;
        SnowmanToken token = SnowmanToken(SnowmanAddy);
        token.safeMint(
            msg.sender,
            "ipfs://QmPWXKhu8FC5PMuJSEu1h7pab6gTHKyzseeWer1rxfLsVh"
        );
        emit BoughtSoda(msg.sender, 0);
        owners[msg.sender] += 1;
    }

    function withdraw() public onlyOwner {
        require(
            address(this).balance > 0,
            "Profits must be greater than 0 in order to withdraw!"
        );
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send ether");
    }

    function restockSoda(uint restock_amount) public onlyOwner {
        soda_amount += restock_amount;
    }

    function update_price(uint _soda_price) public onlyOwner {
        soda_price = _soda_price;
    }

    function getMySodas() public view onlyMembers returns (uint) {
        return owners[msg.sender];
    }
}
