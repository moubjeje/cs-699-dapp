// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

library AntHillsLibrary {
    using AntHillsLibrary for FileLibrary;

    struct FileLibrary {
        mapping(address => AntHill) _hills;
    }

    function enableHill(FileLibrary storage self, address hillOwner) internal {
        self._hills[hillOwner].isValid = true;
    }

    function resetHill(FileLibrary storage self, address hillOwner) internal {
        self._hills[hillOwner].isValid = false;
        delete self._hills[hillOwner].accessList;
    }

    function addUser(
        FileLibrary storage self,
        address key,
        address hillOwner
    ) internal {
        self._hills[hillOwner].accessList.push(key);
    }

    function removeUser(
        FileLibrary storage self,
        address key,
        address hillOwner
    ) internal {
        uint256 len = self._hills[hillOwner].accessList.length;
        uint256 idx = findIndexOfUser(self, hillOwner, key);

        if (idx >= len) {
            return;
        }

        self._hills[hillOwner].accessList[idx] = self
            ._hills[hillOwner]
            .accessList[len - 1];
        self._hills[hillOwner].accessList.pop();
    }

    function findIndexOfUser(
        FileLibrary storage self,
        address key,
        address hillOwner
    ) private view returns (uint256) {
        uint256 len = self._hills[hillOwner].accessList.length;
        for (uint256 i = 0; i < len; i++) {
            if (self._hills[hillOwner].accessList[i] == key) {
                return i;
            }
        }

        return len;
    }

    function findIndexOfFilename(
        FileLibrary storage self,
        string calldata filename,
        address hillOwner
    ) private view returns (uint256) {
        uint256 len = self._hills[hillOwner].filenames.length;
        for (uint256 i = 0; i < len; i++) {
            if (
                keccak256(bytes(self._hills[hillOwner].filenames[i])) ==
                keccak256(bytes(filename))
            ) {
                return i;
            }
        }

        return len;
    }

    function storeFileMeta(
        FileLibrary storage self,
        string calldata filename,
        string calldata cid,
        uint256 filesize,
        address hillOwner
    ) internal {
        self._hills[hillOwner].filenames.push(filename);
        self._hills[hillOwner].files[filename].cid = cid;
        self._hills[hillOwner].files[filename].size = filesize;
        self._hills[hillOwner].files[filename].isValid = true;
    }

    function loadFileMeta(
        FileLibrary storage self,
        string calldata filename,
        address hillOwner
    ) internal view returns (File storage) {
        return self._hills[hillOwner].files[filename];
    }

    function resetFileMeta(
        FileLibrary storage self,
        string calldata filename,
        address hillOwner
    ) internal {
        uint256 len = self._hills[hillOwner].filenames.length;
        uint256 idx = findIndexOfFilename(self, filename, hillOwner);

        if (idx >= len) {
            return;
        }

        self._hills[hillOwner].filenames[idx] = self
            ._hills[hillOwner]
            .filenames[len - 1];
        self._hills[hillOwner].filenames.pop();
        delete self._hills[hillOwner].files[filename];
    }

    function getHill(FileLibrary storage self, address hillOwner)
        internal
        view
        returns (AntHill storage)
    {
        return self._hills[hillOwner];
    }

    function exists(FileLibrary storage self, address hillOwner)
        internal
        view
        returns (bool)
    {
        return self._hills[hillOwner].isValid;
    }

    function exists(
        FileLibrary storage self,
        string calldata filename,
        address hillOwner
    ) internal view returns (bool) {
        return self._hills[hillOwner].files[filename].isValid;
    }

    function exists(
        FileLibrary storage self,
        address user,
        address hillOwner
    ) internal view returns (bool) {
        uint256 i = findIndexOfUser(self, user, hillOwner);
        return (i < self._hills[hillOwner].accessList.length);
    }
}

struct AntHill {
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
