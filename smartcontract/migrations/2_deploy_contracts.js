var Mbrk = artifacts.require("MBRK");
var AccountsLibrary = artifacts.require("AccountsLibrary");

module.exports = function(deployer) {
    deployer.deploy(AccountsLibrary);
    deployer.link(AccountsLibrary, Mbrk);
    deployer.deploy(Mbrk);
};