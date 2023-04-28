// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract VendingmachineV2 is Initializable {
    uint public soda_amount;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "You're not the owner!");
        _;
    }

    function initialize(uint _numSodas) public initializer {
        soda_amount = _numSodas;
        owner = msg.sender;
    }

    function purchaseSoda() public payable {
        require(msg.value >= 1000 wei, "You must pay 1000 wei for a soda!");
        require(soda_amount >= 1, "Out of soda!");
        soda_amount--;
    }

    function withdraw() public onlyOwner {
        require(
            address(this).balance > 0,
            "Profits must be greater than 0 in order to withdraw!"
        );
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send ether");
    }
}
