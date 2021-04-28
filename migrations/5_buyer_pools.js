const Buyer = artifacts.require('Buyer');

const weth = '0xd0A1E359811322d97991E03f863a0C30C2cF029C';
const pool = '0xe21b4edec5d47d4c6571d85226f15343dc121908';
const pairs = [
    [weth, '0x74A2afFdbb8Caf17f5CA650Bc9303a559Ac24B24'],
    [weth, '0xFd74354313b7a8cFc59F779F6Ba5b0053E75A16B'],
    [weth, '0xeC2E1EF466D53d16e70DEE0b0BcBC7020F8E58c5'],
    [weth, '0xc9e5545A6CC902598573B81569cF634962681099'],
    [weth, '0xc33BdB953B982f7C3010F908FeF32d0b251d6b29'],
    [weth, '0xC175c8994a738616255E1a8BA6278d9341199994'],
    [weth, '0xA98E1C95890F03723662cbf0809EEb17d7d5B346'],
    [weth, '0x8c4c3c9b503700431B25840F26Cef3896774E913'],
    [weth, '0x8b8CFA2f2411839c7c29089913a9734637a26383'],
    [weth, '0x7f0AF1A00AA20DD127019DdB79957c6270068B64'],
    [weth, '0x7dad0d1c1a012b8aB5F7C2fB93469440726FE7e5'],
    [weth, '0x6A86dF5759F86e4d69A474c90f4089Be2dA87950'],
    [weth, '0x643f466Dde4F53Fe3948606fF64155CC02dEcCE0'],
    [weth, '0x6412578d9eB222964bB5fcf2eeB0f7AeE09fe629'],
    [weth, '0x5F035eF52A6cABC917b39A626dd4b0d4831EfB5B'],
    [weth, '0x5bBA5F0046836c43164B75c5148a3a4253479355'],
    [weth, '0x53f3efcF31bF3227d8ad65ADe5197Cc8852e99DA'],
    [weth, '0x266A9AAc60B0211D7269dd8b0e792D645d2923e6'],
    [weth, '0x22bf885bf1c9cc6a12d66929A8C22CC95AcfB5CD'],
    [weth, '0x019137bD6A9A9B2a6D0BfA302e48cD6B2DB5086d'],
    [weth, '0x010dB7B4054D29a628A64493E49364b70A7A2a66'],
];

module.exports = async function (deployer, network, accounts) {
    if (network === 'kovan' || network === 'kovan-fork') {
        const buyer = await Buyer.deployed();

        for (let i = 0; i < pairs.length; i++) {
            console.log('Setting pool', i);
            const token1 = pairs[i][0];
            const token2 = pairs[i][1];
            await buyer.setPool(token1, token2, pool);
        }
    }
};

