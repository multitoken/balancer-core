const Buyer = artifacts.require('Buyer');

const weth = '0xd0A1E359811322d97991E03f863a0C30C2cF029C';

module.exports = async function (deployer, network, accounts) {
    if (network === 'kovan' || network === 'kovan-fork') {
        await deployer.deploy(Buyer, weth);
    }
};

