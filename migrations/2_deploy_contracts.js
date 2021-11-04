const { deployProxy } = require('@openzeppelin/truffle-upgrades');
var EthRadio = artifacts.require("../contracts/EthRadio.sol");

module.exports = async function(deployer) {
  const instance = await deployProxy(EthRadio, [], { deployer });
  console.log('Deployed', instance.address);
};
