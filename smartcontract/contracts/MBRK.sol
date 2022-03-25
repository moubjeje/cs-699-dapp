// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./libraries/AccountsLibrary.sol";
import "./libraries/AntHillsLibrary.sol";

contract Mbrk {
    using AccountsLibrary for AccountsLibrary.Accounts;
    using AntHillsLibrary for AntHillsLibrary.AntHills;

    AccountsLibrary.Accounts accounts;
    AntHillsLibrary.AntHills antHills;

    constructor() {
    }

    function ping() public pure {}

    function createUser(address key) external {
        if(!accounts.addUser(key)){
            revert("User already exists");
        }
        antHills.enableHill(key);
    }

    function deleteUser(address key) external {
        if(!accounts.resetUser(key)){
            revert("User does not exist");
        }
        antHills.resetHill(key);
    }

    function getUser(address key) external view returns(address _key, bool isAdmin, bool isValid) {
        return accounts.getUser(key);
    }

    function grantReadAccess(address hillOwner, address key) external{
        if(!antHills.exists(hillOwner)){
            revert("Hill does not exist");
        }
        antHills.addUser(hillOwner, key);
    }

    function revokeReadAccess(address hillOwner, address key) external {
        antHills.removeUser(hillOwner, key);
    }

    function getHill(address hillOwner) external view returns(address _hillOwner, address[] memory accessList, bool isValid) {
        return antHills.getHill(hillOwner);
    }
}