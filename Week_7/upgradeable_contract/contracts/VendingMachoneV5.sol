// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract VendingMachineV5 is Initializable {
    // these state variables and their values
    // will be preserved forever, regardless of upgrading
    uint public numSodas;
    address public owner;
    mapping(address => uint) public sodaHistory;
    uint public testi;

    function initialize(uint _numSodas) public initializer {
        numSodas = _numSodas;
        owner = msg.sender;
        testi = 12;
    }

    function purchaseSoda() public payable {
        require(msg.value >= 1000 wei, "You must pay 1000 wei for a soda!");
        require(numSodas > 0, "No more sodas left!");
        numSodas--;
        sodaHistory[msg.sender] += 1;
        // challenge: add a mapping to keep track of user soda purchases!
    }

    function withdrawProfits() public onlyOwner {
        require(
            address(this).balance > 0,
            "Profits must be greater than 0 in order to withdraw!"
        );
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send ether");
    }

    function setNewOwner(address _newOwner) public onlyOwner {
        owner = _newOwner;
    }

    function restock(uint amount) public onlyOwner {
        numSodas += amount;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
}
