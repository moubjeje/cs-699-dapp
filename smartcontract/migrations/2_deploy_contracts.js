var Mbrk = artifacts.require("MBRK");
var AccountsLibrary = artifacts.require("AccountsLibrary");
var AntHillsLibrary = artifacts.require("AntHillsLibrary");

module.exports = function(deployer) {
    deployer.deploy(AccountsLibrary);
    deployer.deploy(AntHillsLibrary);
    deployer.link(AccountsLibrary, Mbrk);
    deployer.link(AntHillsLibrary, Mbrk);
    deployer.deploy(Mbrk);
};