// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

library RepositoriesLibrary {
    using RepositoriesLibrary for Repositories;

    struct Repositories {
        mapping(address => Repository) _repos;
    }

    function enableRepo(Repositories storage self, address owner) internal {
        self._repos[owner].isValid = true;
    }

    function resetRepo(Repositories storage self, address owner) internal {
        self._repos[owner].isValid = false;
        delete self._repos[owner].accessList;
    }

    function addUser(
        Repositories storage self,
        address key,
        address owner
    ) internal {
        self._repos[owner].accessList.push(key);
    }

    function removeUser(
        Repositories storage self,
        address key,
        address owner
    ) internal {
        uint256 len = self._repos[owner].accessList.length;
        uint256 idx = findIndexOfUser(self, owner, key);

        if (idx >= len) {
            return;
        }

        self._repos[owner].accessList[idx] = self
            ._repos[owner]
            .accessList[len - 1];
        self._repos[owner].accessList.pop();
    }

    function findIndexOfUser(
        Repositories storage self,
        address key,
        address owner
    ) private view returns (uint256) {
        uint256 len = self._repos[owner].accessList.length;
        for (uint256 i = 0; i < len; i++) {
            if (self._repos[owner].accessList[i] == key) {
                return i;
            }
        }

        return len;
    }

    function findIndexOfFilename(
        Repositories storage self,
        string calldata filename,
        address owner
    ) private view returns (uint256) {
        uint256 len = self._repos[owner].filenames.length;
        for (uint256 i = 0; i < len; i++) {
            if (
                keccak256(bytes(self._repos[owner].filenames[i])) ==
                keccak256(bytes(filename))
            ) {
                return i;
            }
        }

        return len;
    }

    function storeFileMeta(
        Repositories storage self,
        string calldata filename,
        string calldata cid,
        uint256 filesize,
        address owner
    ) internal {
        self._repos[owner].filenames.push(filename);
        self._repos[owner].files[filename].cid = cid;
        self._repos[owner].files[filename].size = filesize;
        self._repos[owner].files[filename].isValid = true;
    }

    function loadFileMeta(
        Repositories storage self,
        string calldata filename,
        address owner
    ) internal view returns (File storage) {
        return self._repos[owner].files[filename];
    }

    function resetFileMeta(
        Repositories storage self,
        string calldata filename,
        address owner
    ) internal {
        uint256 len = self._repos[owner].filenames.length;
        uint256 idx = findIndexOfFilename(self, filename, owner);

        if (idx >= len) {
            return;
        }

        self._repos[owner].filenames[idx] = self
            ._repos[owner]
            .filenames[len - 1];
        self._repos[owner].filenames.pop();
        delete self._repos[owner].files[filename];
    }

    function getRepo(Repositories storage self, address owner)
        internal
        view
        returns (Repository storage)
    {
        return self._repos[owner];
    }

    function exists(Repositories storage self, address owner)
        internal
        view
        returns (bool)
    {
        return self._repos[owner].isValid;
    }

    function exists(
        Repositories storage self,
        string calldata filename,
        address owner
    ) internal view returns (bool) {
        return self._repos[owner].files[filename].isValid;
    }

    function exists(
        Repositories storage self,
        address user,
        address owner
    ) internal view returns (bool) {
        uint256 i = findIndexOfUser(self, user, owner);
        return (i < self._repos[owner].accessList.length);
    }
}

struct Repository {
    address[] accessList;
    string[] filenames;
    mapping(string => File) files;
    bool isValid;
}

struct File {
    string cid;
    uint256 size;
    bool isValid;
}
