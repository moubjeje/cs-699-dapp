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

    function addUser(AntHills storage self, address hillOwner, address key) internal {
        self._hills[hillOwner].accessList.push(key);
    }

    function removeUser(AntHills storage self, address hillOwner, address key) internal {
        uint len = self._hills[hillOwner].accessList.length;
        uint idx = findIndexOfUser(self,hillOwner,key);

        if(idx >= len){
            return;
        }

        self._hills[hillOwner].accessList[idx] = self._hills[hillOwner].accessList[len - 1];
        self._hills[hillOwner].accessList.pop();
    }

    function findIndexOfUser(AntHills storage self, address hillOwner, address key) private view returns (uint) {
        uint len = self._hills[hillOwner].accessList.length;
        for (uint i = 0; i < len; i++) {
            if (self._hills[hillOwner].accessList[i] == key) {
                return i;
            }
        }

        return len;
    }

    function getHill(AntHills storage self, address hillOwner) internal view returns (address owner, address[] memory accessList, bool isValid) {
        return(hillOwner, self._hills[hillOwner].accessList, self._hills[hillOwner].isValid);
    }

    function exists(AntHills storage self, address hillOwner) internal view returns (bool) {
        return self._hills[hillOwner].isValid;
    }
}

struct AntHill {
    bool isValid;
    address[] accessList;
}