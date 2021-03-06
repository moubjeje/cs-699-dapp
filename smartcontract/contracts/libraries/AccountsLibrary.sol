// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

library AccountsLibrary {
    using AccountsLibrary for Accounts;

    struct Accounts {
        mapping(address => User) _users;
    }

    function enableUser(Accounts storage self, address key) internal {
        self._users[key].isValid = true;
    }

    function resetUser(Accounts storage self, address key) internal {
        delete self._users[key].isValid;
        delete self._users[key].isAdmin;
        delete self._users[key].accessList;
    }

    function setAdmin(Accounts storage self, address key) internal {
        self._users[key].isAdmin = true;
    }

    function resetAdmin(Accounts storage self, address key) internal {
        self._users[key].isAdmin = false;
    }

    function checkAdmin(Accounts storage self, address key)
        internal
        view
        returns (bool)
    {
        return self._users[key].isAdmin && self._users[key].isValid;
    }

    function addRepo(
        Accounts storage self,
        address repoOwner,
        address key
    ) internal {
        return self._users[key].accessList.push(repoOwner);
    }

    function removeRepo(
        Accounts storage self,
        address repoOwner,
        address key
    ) internal {
        uint256 len = self._users[key].accessList.length;
        uint256 idx = findIndexOfRepo(self, repoOwner, key);

        if (idx >= len) {
            return;
        }

        self._users[key].accessList[idx] = self._users[key].accessList[len - 1];
        self._users[key].accessList.pop();
    }

    function findIndexOfRepo(
        Accounts storage self,
        address repoOwner,
        address key
    ) private view returns (uint256) {
        uint256 len = self._users[key].accessList.length;
        for (uint256 i = 0; i < len; i++) {
            if (self._users[key].accessList[i] == repoOwner) {
                return i;
            }
        }

        return len;
    }

    function getUser(Accounts storage self, address key)
        internal
        view
        returns (User storage)
    {
        return self._users[key];
    }

    function exists(Accounts storage self, address key)
        internal
        view
        returns (bool)
    {
        return self._users[key].isValid;
    }
}

struct User {
    bool isValid;
    bool isAdmin;
    address[] accessList;
}
