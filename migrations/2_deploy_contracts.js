var TokenABC = artifacts.require("./TokenABC.sol");
var TokenXYZ = artifacts.require("./TokenXYZ.sol");
var TokenSwap = artifacts.require("./TokenSwap.sol");

module.exports = async function (deployer) {
  await deployer.deploy(TokenABC, 1000000, 1000);
  await deployer.deploy(TokenXYZ, 1000000, 1000);
  return deployer.deploy(TokenSwap, TokenABC.address, TokenXYZ.address);
};
