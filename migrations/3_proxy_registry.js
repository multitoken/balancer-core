const DSProxyFactory = artifacts.require('DSProxyFactory');
const ProxyRegistry = artifacts.require('ProxyRegistry');

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(DSProxyFactory);
    await deployer.deploy(ProxyRegistry, DSProxyFactory.address);
};
