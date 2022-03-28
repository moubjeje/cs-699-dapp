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
        accounts.addUser(msg.sender);
        accounts.setAdmin(msg.sender);
    }

    modifier onlyAdmin() {
        require(accounts.checkAdmin(msg.sender), "Caller is not admin");
        _;
    }

    function ping() external pure {}

    function createUser(address key) external onlyAdmin {
        if (accounts.exists(key)) {
            revert("User already exists");
        }

        accounts.addUser(key);
        antHills.enableHill(key);
    }

    function deleteUser(address key) external onlyAdmin {
        require(msg.sender != key, "Caller is user");
        accounts.resetUser(key);
        antHills.resetHill(key);
    }

    function grantAdmin(address key) external onlyAdmin {
        if (!accounts.exists(key)) {
            revert("User does not exist");
        }
        accounts.setAdmin(key);
    }

    function revokeAdmin(address key) external onlyAdmin {
        require(msg.sender != key, "Caller is user");
        accounts.resetAdmin(key);
    }

    function getUser()
        external
        view
        returns (User memory)
    {
        User memory user = accounts.getUser(msg.sender);
        require(user.isValid, "User does not exist");
        return user;
    }

    function grantReadAccess(address key) external {
        if (!antHills.exists(msg.sender)) {
            revert("Hill does not exist");
        }
        antHills.addUser(msg.sender, key);
    }

    function revokeReadAccess(address key) external {
        antHills.removeUser(msg.sender, key);
    }

    function getHill()
        external
        view
        returns (
            address[] memory accessList,
            bool isValid
        )
    {
        AntHill storage hill = antHills.getHill(msg.sender);
        require(hill.isValid, "Hill does not exist");
        return (hill.accessList, hill.isValid);
    }

    function createFile(string calldata filename, string calldata cid, uint filesize) external {
        if(!antHills.exists(msg.sender)){
            revert("Hill does not exist");
        }
        if(antHills.exists(filename, msg.sender)){
            revert("File already exists");
        }
        antHills.storeFileMeta(filename, cid, filesize, msg.sender);
    }

    function deleteFile(string calldata filename) external {
        antHills.resetFileMeta(filename, msg.sender);
    }

    function getFile(string calldata filename)
        external
        view
        returns (File memory)
    {
        File memory file = antHills.loadFileMeta(filename, msg.sender);
        require(file.isValid, "File does not exist");
        return file;
    }

    function checkFileExists(string calldata filename)
        external
        view
        returns (bool isValid)
    {
        return antHills.exists(filename, msg.sender);
    }
}