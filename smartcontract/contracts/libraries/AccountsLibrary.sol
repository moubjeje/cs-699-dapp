// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

library AccountsLibrary {
    using AccountsLibrary for Accounts;

    struct Accounts {
        mapping(address => User) _users;
        uint _size;
    }

    function addUser(Accounts storage self, address key) internal returns (bool) {
        self._users[key].isValid = true;
        self._size = self._size + 1;
        return true;
    }

    function resetUser(Accounts storage self, address key) internal returns (bool) {
        self._users[key].isValid = false;
        self._users[key].isAdmin = false;
        delete self._users[key].accessList;
        self._size = self._size - 1;

        return true;
    }

    function setAdmin(Accounts storage self, address key) internal{
        self._users[key].isAdmin = true;
    }

    function resetAdmin(Accounts storage self, address key) internal{
        self._users[key].isAdmin = false;
    }

    function checkAdmin(Accounts storage self, address key) internal view returns (bool){
        return self._users[key].isAdmin && self._users[key].isValid;
    }

    function getUser(Accounts storage self, address key) internal view returns(User memory){
        return self._users[key];
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
    address[] accessList;
}