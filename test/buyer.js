const truffleAssert = require('truffle-assertions');

const BFactory = artifacts.require('BFactory');
const BPool = artifacts.require('BPool');
const Buyer = artifacts.require('Buyer');
const PancakeRouterMock = artifacts.require('PancakeRouterMock');
const TToken = artifacts.require('TToken');
const WETH9 = artifacts.require('WETH9');
const verbose = process.env.VERBOSE;

contract('Buyer', async (accounts) => {
    const admin = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const { toWei } = web3.utils;
    const { fromWei } = web3.utils;
    const MAX = web3.utils.toTwosComplement(-1);

    let WETH;
    let MKR;
    let DAI;
    let XXX; // addresses
    let ATKN;

    let weth;
    let mkr;
    let dai;
    let xxx; // TTokens
    let atkn;

    let factory; // BPool factory
    let pool; // first pool w/ defaults
    let POOL; //   pool address
    let buyer;
    let pancakeRouterMock;

    before(async () => {
        factory = await BFactory.deployed();

        POOL = await factory.newBPool.call();
        await factory.newBPool();
        pool = await BPool.at(POOL);

        weth = await WETH9.new('Wrapped Ether', 'WETH', 18);
        mkr = await TToken.new('Maker', 'MKR', 18);
        dai = await TToken.new('Dai Stablecoin', 'DAI', 18);
        xxx = await TToken.new('XXX', 'XXX', 18);
        atkn = await TToken.new('Additional Token', 'ATKN', 18);

        WETH = weth.address;
        MKR = mkr.address;
        DAI = dai.address;
        XXX = xxx.address;
        ATKN = atkn.address;

        /*
            Tests assume token prices
            WETH - $200
            MKR  - $500
            DAI  - $1
            XXX  - $0
        */

        // Admin balances
        await weth.deposit({ value: toWei('10') });
        await mkr.mint(admin, toWei('1000'));
        await dai.mint(admin, toWei('1000'));
        await xxx.mint(admin, toWei('1000'));
        await atkn.mint(admin, toWei('1000'));

        // User1 balances
        await weth.deposit({ value: toWei('0.2'), from: user1 });
        await mkr.mint(user1, toWei('4'), { from: admin });
        await dai.mint(user1, toWei('40000'), { from: admin });
        await xxx.mint(user1, toWei('10'), { from: admin });
        await atkn.mint(user1, toWei('20'), { from: admin });

        // User2 balances
        await weth.deposit({ value: toWei('0.2'), from: user2 });
        await mkr.mint(user2, toWei('1.015333'), { from: admin });
        await dai.mint(user2, toWei('0'), { from: admin });
        await xxx.mint(user2, toWei('51'), { from: admin });
        await atkn.mint(user2, toWei('20'), { from: admin });

        await weth.approve(POOL, MAX);
        await mkr.approve(POOL, MAX);
        await dai.approve(POOL, MAX);
        await xxx.approve(POOL, MAX);
        await atkn.approve(POOL, MAX);
        await pool.bind(WETH, toWei('2'), toWei('2.5'));
        await pool.bind(MKR, toWei('100'), toWei('2.5'));
        await pool.bind(DAI, toWei('100'), toWei('2.5'));
        await pool.bind(XXX, toWei('100'), toWei('2.5'));
        await pool.bind(ATKN, toWei('100'), toWei('2.5'));
        await pool.publish();

        pancakeRouterMock = await PancakeRouterMock.new(WETH);
        await weth.deposit({ value: toWei('10') });
        await weth.transfer(pancakeRouterMock.address, toWei('10'));
        await mkr.mint(pancakeRouterMock.address, toWei('1000'));
        await dai.mint(pancakeRouterMock.address, toWei('1000'));
        await xxx.mint(pancakeRouterMock.address, toWei('1000'));
        await atkn.mint(pancakeRouterMock.address, toWei('1000'));

        buyer = await Buyer.new(WETH, pancakeRouterMock.address);
    });

    describe('', () => {
        it('', async () => {
            const latestBlockAt = await web3.eth.getBlock('latest').timestamp;

            await buyer.joinPool(POOL, 1, latestBlockAt * 2, { value: toWei('2') });
        });
    });
});
