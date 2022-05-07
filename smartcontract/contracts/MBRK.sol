// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "./libraries/AccountsLibrary.sol";
import "./libraries/RepositoriesLibrary.sol";

contract Mbrk {
    using AccountsLibrary for AccountsLibrary.Accounts;
    using RepositoriesLibrary for RepositoriesLibrary.Repositories;

    AccountsLibrary.Accounts accounts;
    RepositoriesLibrary.Repositories repos;

    event RepoUpdated(
        address user
    );

    event UserUpdated(
        address user
    );

    constructor() {
        accounts.enableUser(msg.sender);
        accounts.setAdmin(msg.sender);
        repos.enableRepo(msg.sender);
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

        accounts.enableUser(key);
        repos.enableRepo(key);

        emit RepoUpdated(key);
        emit UserUpdated(key);
    }

    function deleteUser(address key) external onlyAdmin {
        require(msg.sender != key, "Caller is user");
        accounts.resetUser(key);
        repos.resetRepo(key);

        emit UserUpdated(key);
        emit RepoUpdated(key);
    }

    function grantAdmin(address key) external onlyAdmin {
        if (!accounts.exists(key)) {
            revert("User does not exist");
        }
        accounts.setAdmin(key);

        emit UserUpdated(key);
    }

    function revokeAdmin(address key) external onlyAdmin {
        require(msg.sender != key, "Caller is user");
        accounts.resetAdmin(key);

        emit UserUpdated(key);
    }

    function getUser() external view returns (User memory) {
        User storage user = accounts.getUser(msg.sender);
        require(user.isValid, "User does not exist");
        return user;
    }

    function grantReadAccess(address key) external {
        if (!repos.exists(msg.sender)) {
            revert("Repository does not exist");
        }
        if(repos.exists(key,msg.sender)){
            revert("User already has access");
        }
        if (!accounts.exists(key)) {
            revert("User does not exist");
        }
        if(key == msg.sender){
            revert("User is repository owner");
        }

        accounts.addRepo(msg.sender, key);
        repos.addUser(key, msg.sender);

        emit RepoUpdated(msg.sender);
        emit UserUpdated(key);
    }

    function revokeReadAccess(address key) external {
        accounts.removeRepo(msg.sender, key);
        repos.removeUser(key, msg.sender);

        emit RepoUpdated(msg.sender);
        emit UserUpdated(key);
    }

    function getRepo()
        external
        view
        returns (
            address repoOwner,
            string[] memory filenames,
            address[] memory owners,
            address[] memory accessList,
            bool isValid
        )
    {
        Repository storage repo = repos.getRepo(msg.sender);
        require(repo.isValid, "Repository does not exist");

        string[] memory allFilenames = repo.filenames;
        address[] memory allOwners = fillAddressArray(
            allFilenames.length,
            msg.sender
        );
        User storage user = accounts.getUser(msg.sender);

        for (uint256 i = 0; i < user.accessList.length; i++) {
            Repository storage otherRepo = repos.getRepo(user.accessList[i]);
            if (!otherRepo.isValid) {
                continue;
            }
            allFilenames = concatenateStringArrays(
                allFilenames,
                otherRepo.filenames
            );
            address[] memory otherOwnerArr = fillAddressArray(
                otherRepo.filenames.length,
                user.accessList[i]
            );
            allOwners = concatenateAddressArrays(allOwners, otherOwnerArr);
        }

        return (msg.sender, allFilenames, allOwners, repo.accessList, repo.isValid);
    }

    function createFile(
        string calldata filename,
        string calldata cid,
        uint256 filesize
    ) external {
        if (!repos.exists(msg.sender)) {
            revert("Repository does not exist");
        }
        if (repos.exists(filename, msg.sender)) {
            revert("File already exists");
        }
        repos.storeFileMeta(filename, cid, filesize, msg.sender);

        emit RepoUpdated(msg.sender);
    }

    function deleteFile(string calldata filename) external {
        repos.resetFileMeta(filename, msg.sender);

        emit RepoUpdated(msg.sender);
    }

    function getFile(string calldata filename)
        external
        view
        returns (File memory)
    {
        File memory file = repos.loadFileMeta(filename, msg.sender);
        require(file.isValid, "File does not exist");
        return file;
    }

    function checkFileExists(string calldata filename)
        external
        view
        returns (bool isValid)
    {
        return repos.exists(filename, msg.sender);
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
