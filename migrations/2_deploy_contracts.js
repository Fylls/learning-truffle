// import artifact
const SimpleStorage = artifacts.require("SimpleStorage.sol")

// with deployer we will be able to deploy SC using deploy()
module.exports = function (deployer) {
  deployer.deploy(SimpleStorage)
}
