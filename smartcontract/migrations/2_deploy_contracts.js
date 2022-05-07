var Mbrk = artifacts.require("MBRK");
var AccountsLibrary = artifacts.require("AccountsLibrary");
var RepositoriesLibrary = artifacts.require("RepositoriesLibrary");

module.exports = function(deployer) {
    deployer.deploy(AccountsLibrary);
    deployer.deploy(RepositoriesLibrary);
    deployer.link(AccountsLibrary, Mbrk);
    deployer.link(RepositoriesLibrary, Mbrk);
    deployer.deploy(Mbrk);
};