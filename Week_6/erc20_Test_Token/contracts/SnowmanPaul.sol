//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SnowmanPaul is ERC20 {
    uint256 constant _initial_supply = 14 * (10**18);

    constructor() ERC20("SnowmanPaul", "SP") {
        _mint(msg.sender, _initial_supply);
    }
}
