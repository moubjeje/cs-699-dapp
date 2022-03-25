// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

library AccountsLibrary {
    using AccountsLibrary for Accounts;

    struct Accounts {
        mapping(address => User) _users;
        uint _size;
    }

    function addUser(Accounts storage self, address key) internal returns (bool) {
        if (exists(self, key)) {
            return false;
        }

        self._users[key].isValid = true;
        self._size = self._size + 1;
        return true;
    }

    function resetUser(Accounts storage self, address key) internal returns (bool) {
        if (!exists(self, key)){
            return false;
        }

        self._users[key].isValid = false;
        self._users[key].isAdmin = false;
        self._size = self._size - 1;
        
        return true;
    }

    function getUser(Accounts storage self, address key) internal view returns(address _key, bool isAdmin, bool isValid){
        return (key, self._users[key].isAdmin, self._users[key].isValid);
    }

    function size(Accounts storage self) internal view returns (uint) {
        return self._size;
    }

    function exists(Accounts storage self, address key) internal view returns (bool) {
        return self._users[key].isValid;
    }
}

struct User {
    bool isValid;
    bool isAdmin;
}