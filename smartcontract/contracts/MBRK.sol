// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./libraries/AccountsLibrary.sol";

contract Mbrk {
    using AccountsLibrary for AccountsLibrary.Accounts;

    AccountsLibrary.Accounts accounts;

    constructor() {
    }

    function ping() public pure {}

    function createUser(address key) public {
        //user must not exist
        if(!accounts.addUser(key)){
            revert("User already exists");
        }
    }

    function deleteUser(address key) public {
        if(!accounts.resetUser(key)){
            revert("User does not exist");
        }
    }

    function getUser(address key) public view returns(address _key, bool isValid, bool isAdmin) {
        return accounts.getUser(key);
    }
}