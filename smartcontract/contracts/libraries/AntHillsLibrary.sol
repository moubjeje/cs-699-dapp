// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

library AntHillsLibrary {
    using AntHillsLibrary for AntHills;

    struct AntHills {
        mapping(address => AntHill) _hills;
    }

    function enableHill(AntHills storage self, address hillOwner) internal {
        self._hills[hillOwner].isValid = true;
    }

    function resetHill(AntHills storage self, address hillOwner) internal {
        self._hills[hillOwner].isValid = false;
        delete self._hills[hillOwner].accessList;
    }

    function addUser(AntHills storage self, address key, address hillOwner) internal {
        self._hills[hillOwner].accessList.push(key);
    }

    function removeUser(AntHills storage self, address key, address hillOwner) internal {
        uint len = self._hills[hillOwner].accessList.length;
        uint idx = findIndexOfUser(self,hillOwner,key);

        if(idx >= len){
            return;
        }

        self._hills[hillOwner].accessList[idx] = self._hills[hillOwner].accessList[len - 1];
        self._hills[hillOwner].accessList.pop();
    }

    function findIndexOfUser(AntHills storage self, address key, address hillOwner) private view returns (uint) {
        uint len = self._hills[hillOwner].accessList.length;
        for (uint i = 0; i < len; i++) {
            if (self._hills[hillOwner].accessList[i] == key) {
                return i;
            }
        }

        return len;
    }

    function storeFileMeta(AntHills storage self, string calldata filename, string calldata cid, uint filesize, address hillOwner) internal {
        self._hills[hillOwner].files[filename].cid = cid;
        self._hills[hillOwner].files[filename].size = filesize;
        self._hills[hillOwner].files[filename].isValid = true;
    }

    function loadFileMeta(AntHills storage self, string calldata filename, address hillOwner) internal view returns (File storage) {
        return self._hills[hillOwner].files[filename];
    }

    function resetFileMeta(AntHills storage self, string calldata filename, address hillOwner) internal {
        delete self._hills[hillOwner].files[filename];
    }


    function getHill(AntHills storage self, address hillOwner) internal view returns (AntHill storage) {
        return self._hills[hillOwner];
    }

    function exists(AntHills storage self, address hillOwner) internal view returns (bool) {
        return self._hills[hillOwner].isValid;
    }

    function exists(AntHills storage self, string calldata filename, address hillOwner) internal view returns (bool){
        return self._hills[hillOwner].files[filename].isValid;
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
    uint size;
    bool isValid;
}