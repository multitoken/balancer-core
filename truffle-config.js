const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
    networks: {
        development: {
            host: 'localhost', // Localhost (default: none)
            port: 8545, // Standard Ethereum port (default: none)
            network_id: '*', // Any network (default: none)
            gas: 10000000,
        },
        coverage: {
            host: 'localhost',
            network_id: '*',
            port: 8555,
            gas: 0xfffffffffff,
            gasPrice: 0x01,
        },
        matic: {
            provider: () => new HDWalletProvider([process.env.DEPOYER_PRIVATE_KEY], 'https://rpc-mainnet.maticvigil.com'),
            network_id: 137,
            confirmations: 1,
            timeoutBlocks: 200,
            skipDryRun: true,
            gasPrice: 5000000000, // 5 Gwei
        },
        bsc: {
            provider: () => new HDWalletProvider([process.env.DEPOYER_PRIVATE_KEY], 'https://bsc-dataseed.binance.org'),
            network_id: 56,
            confirmations: 1,
            timeoutBlocks: 200,
            skipDryRun: true,
            gasPrice: 5000000000, // 5 Gwei
            // gas: 6722000,
        },
    },
    // Configure your compilers
    compilers: {
        solc: {
            version: '0.5.12',
            settings: { // See the solidity docs for advice about optimization and evmVersion
                optimizer: {
                    enabled: true,
                    runs: 100,
                },
                evmVersion: 'byzantium',
            },
        },
    },
};
