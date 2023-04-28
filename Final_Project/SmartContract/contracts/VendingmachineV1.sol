// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract VendingmachineV1 is Initializable {
    uint public soda_amount;
    address public owner;

    function initialize(uint _numSodas) public initializer {
        soda_amount = _numSodas;
        owner = msg.sender;
    }

    function purchaseSoda() public payable {
        require(msg.value >= 1000 wei, "You must pay 1000 wei for a soda!");
        require(soda_amount >= 1, "Out of soda!");
        soda_amount--;
    }
}
