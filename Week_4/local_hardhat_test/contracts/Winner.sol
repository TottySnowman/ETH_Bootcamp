
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
interface IContract {
    function attempt() external;
}


contract Winner{
    function SendAttempt() external{
        address contractAddress = 0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502; 
        IContract(contractAddress).attempt();
    }
}