// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./libraries/AccountsLibrary.sol";
import "./libraries/AntHillsLibrary.sol";

contract Mbrk {
    using AccountsLibrary for AccountsLibrary.Accounts;
    using AntHillsLibrary for AntHillsLibrary.AntHills;

    AccountsLibrary.Accounts accounts;
    AntHillsLibrary.AntHills antHills;

    event CreateUser(
        address key,
        address sender
    );

    constructor() {
        accounts.addUser(msg.sender);
        accounts.setAdmin(msg.sender);
        antHills.enableHill(msg.sender);
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

        emit CreateUser(key, msg.sender);
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

    function getUser() external view returns (User memory) {
        User storage user = accounts.getUser(msg.sender);
        require(user.isValid, "User does not exist");
        return user;
    }

    function grantReadAccess(address key) external {
        if (!antHills.exists(msg.sender)) {
            revert("Hill does not exist");
        }
        if(antHills.exists(key,msg.sender)){
            revert("User already has access");
        }
        if (!accounts.exists(key)) {
            revert("User does not exist");
        }

        accounts.addHill(msg.sender, key);
        antHills.addUser(key, msg.sender);
    }

    function revokeReadAccess(address key) external {
        accounts.removeHill(msg.sender, key);
        antHills.removeUser(key, msg.sender);
    }

    function getHill()
        external
        view
        returns (
            string[] memory filenames,
            address[] memory owners,
            address[] memory accessList,
            bool isValid
        )
    {
        AntHill storage hill = antHills.getHill(msg.sender);
        require(hill.isValid, "Hill does not exist");

        string[] memory allFilenames = hill.filenames;
        address[] memory allOwners = fillAddressArray(
            allFilenames.length,
            msg.sender
        );
        User storage user = accounts.getUser(msg.sender);

        for (uint256 i = 0; i < user.accessList.length; i++) {
            AntHill storage otherHill = antHills.getHill(user.accessList[i]);
            if (!otherHill.isValid) {
                continue;
            }
            allFilenames = concatenateStringArrays(
                allFilenames,
                otherHill.filenames
            );
            address[] memory otherOwnerArr = fillAddressArray(
                otherHill.filenames.length,
                user.accessList[i]
            );
            allOwners = concatenateAddressArrays(allOwners, otherOwnerArr);
        }

        return (allFilenames, allOwners, hill.accessList, hill.isValid);
    }

    function createFile(
        string calldata filename,
        string calldata cid,
        uint256 filesize
    ) external {
        if (!antHills.exists(msg.sender)) {
            revert("Hill does not exist");
        }
        if (antHills.exists(filename, msg.sender)) {
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

    function concatenateStringArrays(string[] memory a, string[] memory b)
        internal
        pure
        returns (string[] memory)
    {
        string[] memory r = new string[](a.length + b.length);
        uint256 i = 0;
        while (i < a.length) {
            r[i] = a[i];
            i++;
        }

        uint256 j = 0;
        while (j < b.length) {
            r[i] = b[j];
            j++;
            i++;
        }

        return r;
    }

    function concatenateAddressArrays(address[] memory a, address[] memory b)
        internal
        pure
        returns (address[] memory)
    {
        address[] memory r = new address[](a.length + b.length);
        uint256 i = 0;
        while (i < a.length) {
            r[i] = a[i];
            i++;
        }

        uint256 j = 0;
        while (j < b.length) {
            r[i] = b[j];
            j++;
            i++;
        }

        return r;
    }

    function fillAddressArray(uint256 length, address val)
        internal
        pure
        returns (address[] memory)
    {
        address[] memory r = new address[](length);

        for (uint256 i = 0; i < r.length; i++) {
            r[i] = val;
        }

        return r;
    }
}
