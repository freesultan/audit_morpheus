import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import {
  AavePoolDataProviderMock,
  AavePoolMock,
  ArbitrumBridgeGatewayRouterMock, // Mock contracts
  ChainLinkAggregatorV3Mock,
  ChainLinkDataConsumer,
  DepositPool,
  Distributor,
  ERC20Token,
  IDepositPool,
  IL1SenderV2,
  IL2TokenReceiverV2, // Interfaces
  IRewardPool,
  L1SenderV2,
  L2MessageReceiver,
  L2TokenReceiverV2,
  LayerZeroEndpointV2Mock,
  MOR,
  MOROFT,
  NonfungiblePositionManagerMock,
  RewardPool,
  StETHMock,
  UniswapSwapRouterMock,
  WStETHMock,
} from '@/generated-types/ethers';
import { PRECISION, ZERO_ADDR } from '@/scripts/utils/constants';
import { wei } from '@/scripts/utils/utils';
import { getCurrentBlockTime, setNextTime, setTime } from '@/test/helpers/block-helper';
import { Reverter } from '@/test/helpers/reverter';

/**
 * Morpheus Capital Protocol - POC Test Suite
 *
 * This file provides a comprehensive testing environment for the capital-protocol contracts.
 * All contracts are deployed and initialized with common configurations.
 *
 * Contracts in scope:
 * - ChainLinkDataConsumer: Price feed aggregator
 * - DepositPool: User deposit and reward management
 * - Distributor: Reward distribution across pools
 * - L1SenderV2: L1 to L2 messaging
 * - L2TokenReceiverV2: L2 token receiver and swapper
 * - RewardPool: Reward pool configuration
 */

describe('Morpheus Capital Protocol - POC Test Suite', function () {
  // Signers
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let charlie: SignerWithAddress;
  let treasury: SignerWithAddress;
  let referrer1: SignerWithAddress;
  let referrer2: SignerWithAddress;

  // Core Capital Protocol Contracts
  let chainLinkDataConsumer: ChainLinkDataConsumer;
  let depositPool: DepositPool;
  let distributor: Distributor;
  let l1Sender: L1SenderV2;
  let l2TokenReceiver: L2TokenReceiverV2;
  let rewardPool: RewardPool;

  // Mock Contracts and Dependencies
  let aavePool: AavePoolMock;
  let aavePoolDataProvider: AavePoolDataProviderMock;
  let stETH: StETHMock;
  let wstETH: WStETHMock;
  let depositToken: ERC20Token;
  let rewardToken: ERC20Token;
  let mor: MOR;
  let morOft: MOROFT;
  let swapRouter: UniswapSwapRouterMock;
  let nonfungiblePositionManager: NonfungiblePositionManagerMock;
  let arbitrumBridge: ArbitrumBridgeGatewayRouterMock;
  let lzEndpointL1: LayerZeroEndpointV2Mock;
  let lzEndpointL2: LayerZeroEndpointV2Mock;
  let l2MessageReceiver: L2MessageReceiver;

  // Price Feed Mocks
  let ethUsdFeed: ChainLinkAggregatorV3Mock;
  let btcUsdFeed: ChainLinkAggregatorV3Mock;
  let wbtcBtcFeed: ChainLinkAggregatorV3Mock;

  // Test Constants
  const oneDay = 86400;
  const oneHour = 3600;
  const publicRewardPoolId = 0;
  const privateRewardPoolId = 1;
  const l1ChainId = 101;
  const l2ChainId = 110;

  // Reverter for test isolation
  const reverter = new Reverter();

  // Enums
  enum Strategy {
    NONE, // Direct deposit, no yield
    NO_YIELD, // No yield strategy (private pools)
    AAVE, // Aave yield strategy
  }

  // Helper Functions
  async function deployERC20Token(): Promise<ERC20Token> {
    const factory = await ethers.getContractFactory('ERC20Token');
    return await factory.deploy();
  }

  async function deployMocks() {
    // Deploy price feed mocks
    const aggregatorFactory = await ethers.getContractFactory('ChainLinkAggregatorV3Mock');
    ethUsdFeed = await aggregatorFactory.deploy(18);
    btcUsdFeed = await aggregatorFactory.deploy(8);
    wbtcBtcFeed = await aggregatorFactory.deploy(8);

    // Set initial prices
    await ethUsdFeed.setAnswerResult(wei(2000, 18)); // $2000/ETH
    await btcUsdFeed.setAnswerResult(wei(40000, 8)); // $40000/BTC
    await wbtcBtcFeed.setAnswerResult(wei(1, 8)); // 1:1 WBTC/BTC

    // Deploy Aave mocks
    const aaveDataProviderFactory = await ethers.getContractFactory('AavePoolDataProviderMock');
    aavePoolDataProvider = await aaveDataProviderFactory.deploy();

    const aavePoolFactory = await ethers.getContractFactory('AavePoolMock');
    aavePool = await aavePoolFactory.deploy(aavePoolDataProvider);

    // Deploy token mocks
    const stETHFactory = await ethers.getContractFactory('StETHMock');
    stETH = await stETHFactory.deploy();

    const wstETHFactory = await ethers.getContractFactory('WStETHMock');
    wstETH = await wstETHFactory.deploy(stETH);

    depositToken = await deployERC20Token();
    rewardToken = await deployERC20Token();

    const morFactory = await ethers.getContractFactory('MOR');
    mor = await morFactory.deploy(wei(1000000)); // 1M initial supply

    // Deploy swap router mocks
    const swapRouterFactory = await ethers.getContractFactory('UniswapSwapRouterMock');
    swapRouter = await swapRouterFactory.deploy();

    const nftManagerFactory = await ethers.getContractFactory('NonfungiblePositionManagerMock');
    nonfungiblePositionManager = await nftManagerFactory.deploy();

    // Deploy bridge mocks
    const bridgeFactory = await ethers.getContractFactory('ArbitrumBridgeGatewayRouterMock');
    arbitrumBridge = await bridgeFactory.deploy();

    // Deploy LayerZero mocks
    const lzFactory = await ethers.getContractFactory('LayerZeroEndpointV2Mock');
    lzEndpointL1 = await lzFactory.deploy(l1ChainId, owner.address);
    lzEndpointL2 = await lzFactory.deploy(l2ChainId, owner.address);

    // Deploy L2MessageReceiver mock (if needed for L1Sender tests)
    const l2MessageReceiverFactory = await ethers.getContractFactory('L2MessageReceiver');
    const l2MessageReceiverImpl = await l2MessageReceiverFactory.deploy();

    const proxyFactory = await ethers.getContractFactory('ERC1967Proxy');
    const l2MessageReceiverProxy = await proxyFactory.deploy(l2MessageReceiverImpl, '0x');
    l2MessageReceiver = l2MessageReceiverFactory.attach(l2MessageReceiverProxy) as L2MessageReceiver;
    await l2MessageReceiver.L2MessageReceiver__init();
  }

  async function deployCapitalProtocol() {
    // 1. Deploy ChainLinkDataConsumer
    const chainLinkFactory = await ethers.getContractFactory('ChainLinkDataConsumer');
    const chainLinkImpl = await chainLinkFactory.deploy();

    const proxyFactory = await ethers.getContractFactory('ERC1967Proxy');
    const chainLinkProxy = await proxyFactory.deploy(await chainLinkImpl.getAddress(), '0x');
    chainLinkDataConsumer = chainLinkFactory.attach(await chainLinkProxy.getAddress()) as ChainLinkDataConsumer;
    await chainLinkDataConsumer.ChainLinkDataConsumer_init();

    // Setup price feeds
    await chainLinkDataConsumer.updateDataFeeds(
      ['ETH/USD', 'wBTC/BTC,BTC/USD'],
      [[await ethUsdFeed.getAddress()], [await wbtcBtcFeed.getAddress(), await btcUsdFeed.getAddress()]],
    );

    // 2. Deploy RewardPool (with library linking)
    const linearDistributionLib = await (
      await ethers.getContractFactory('LinearDistributionIntervalDecrease')
    ).deploy();

    const rewardPoolFactory = await ethers.getContractFactory('RewardPool', {
      libraries: {
        LinearDistributionIntervalDecrease: await linearDistributionLib.getAddress(),
      },
    });

    const rewardPoolImpl = await rewardPoolFactory.deploy();
    const rewardPoolProxy = await proxyFactory.deploy(await rewardPoolImpl.getAddress(), '0x');
    rewardPool = rewardPoolFactory.attach(await rewardPoolProxy.getAddress()) as RewardPool;

    const pools: IRewardPool.RewardPoolStruct[] = [
      {
        payoutStart: oneDay * 10,
        decreaseInterval: oneDay,
        initialReward: wei(100),
        rewardDecrease: wei(1),
        isPublic: true,
      },
      {
        payoutStart: oneDay * 20,
        decreaseInterval: oneDay * 2,
        initialReward: wei(200),
        rewardDecrease: wei(1),
        isPublic: false,
      },
    ];

    await rewardPool.RewardPool_init(pools);

    // 3. Deploy L1SenderV2
    const l1SenderFactory = await ethers.getContractFactory('L1SenderV2');
    const l1SenderImpl = await l1SenderFactory.deploy();
    const l1SenderProxy = await proxyFactory.deploy(await l1SenderImpl.getAddress(), '0x');
    l1Sender = l1SenderFactory.attach(await l1SenderProxy.getAddress()) as L1SenderV2;
    await l1Sender.L1SenderV2__init();

    // Configure L1Sender
    await l1Sender.setStETh(await stETH.getAddress());
    await l1Sender.setArbitrumBridgeConfig({
      wstETH: await wstETH.getAddress(),
      gateway: await arbitrumBridge.getAddress(),
      receiver: treasury.address,
    });
    await l1Sender.setUniswapSwapRouter(await swapRouter.getAddress());

    // 4. Deploy Distributor
    const distributorFactory = await ethers.getContractFactory('Distributor');
    const distributorImpl = await distributorFactory.deploy();
    const distributorProxy = await proxyFactory.deploy(await distributorImpl.getAddress(), '0x');
    distributor = distributorFactory.attach(await distributorProxy.getAddress()) as Distributor;

    await distributor.Distributor_init(
      await chainLinkDataConsumer.getAddress(),
      await aavePool.getAddress(),
      await aavePoolDataProvider.getAddress(),
      await rewardPool.getAddress(),
      await l1Sender.getAddress(),
    );

    // 5. Deploy DepositPool
    const lib1 = await (await ethers.getContractFactory('ReferrerLib')).deploy();
    const lib2 = await (await ethers.getContractFactory('LockMultiplierMath')).deploy();

    const depositPoolFactory = await ethers.getContractFactory('DepositPool', {
      libraries: {
        ReferrerLib: await lib1.getAddress(),
        LockMultiplierMath: await lib2.getAddress(),
      },
    });

    const depositPoolImpl = await depositPoolFactory.deploy();
    const depositPoolProxy = await proxyFactory.deploy(await depositPoolImpl.getAddress(), '0x');
    depositPool = depositPoolFactory.attach(await depositPoolProxy.getAddress()) as DepositPool;

    await depositPool.DepositPool_init(await depositToken.getAddress(), await distributor.getAddress());

    // 6. Deploy L2TokenReceiverV2
    const l2ReceiverFactory = await ethers.getContractFactory('L2TokenReceiverV2');
    const l2ReceiverImpl = await l2ReceiverFactory.deploy();
    const l2ReceiverProxy = await proxyFactory.deploy(await l2ReceiverImpl.getAddress(), '0x');
    l2TokenReceiver = l2ReceiverFactory.attach(await l2ReceiverProxy.getAddress()) as L2TokenReceiverV2;

    await l2TokenReceiver.L2TokenReceiver__init(
      await swapRouter.getAddress(),
      await nonfungiblePositionManager.getAddress(),
      {
        tokenIn: await stETH.getAddress(),
        tokenOut: await mor.getAddress(),
        fee: 500,
        sqrtPriceLimitX96: 0,
      },
    );

    // 7. Setup connections
    await l1Sender.setDistributor(await distributor.getAddress());

    // Add deposit pool to distributor
    await distributor.addDepositPool(
      publicRewardPoolId,
      await depositPool.getAddress(),
      await depositToken.getAddress(),
      'ETH/USD',
      Strategy.NONE,
    );

    // Complete migration
    await depositPool.migrate(publicRewardPoolId);
  }

  async function mintTokensToUsers() {
    const amount = wei(1000);

    // Mint deposit tokens
    await depositToken.mint(alice.address, amount);
    await depositToken.mint(bob.address, amount);
    await depositToken.mint(charlie.address, amount);

    // Mint stETH
    await stETH.mint(alice.address, amount);
    await stETH.mint(bob.address, amount);
    await stETH.mint(charlie.address, amount);

    // Setup approvals
    await depositToken.connect(alice).approve(await depositPool.getAddress(), ethers.MaxUint256);
    await depositToken.connect(bob).approve(await depositPool.getAddress(), ethers.MaxUint256);
    await depositToken.connect(charlie).approve(await depositPool.getAddress(), ethers.MaxUint256);
    await stETH.connect(alice).approve(await l1Sender.getAddress(), ethers.MaxUint256);
    await stETH.connect(bob).approve(await l1Sender.getAddress(), ethers.MaxUint256);
  }

  // Test Setup
  before(async function () {
    // Get signers
    [owner, alice, bob, charlie, treasury, referrer1, referrer2] = await ethers.getSigners();

    // Deploy all contracts
    await deployMocks();
    await deployCapitalProtocol();
    await mintTokensToUsers();

    // Take snapshot for reverting
    await reverter.snapshot();
  });

  afterEach(async function () {
    await reverter.revert();
  });

  // Example POC Templates
  describe('POC Templates', function () {
    it.only('POC-1: DepositPool - Example vulnerability test', async function () {
      // Setup reward pool timestamp (required before any staking)
      await distributor.setRewardPoolLastCalculatedTimestamp(publicRewardPoolId, 1);
      await distributor.setMinRewardsDistributePeriod(0);
      console.log(
        '>>>>>>> distributer balance:',
        ethers.formatEther(await depositToken.balanceOf(await distributor.getAddress())),
      );
      console.log(
        '>>>>>>> lsSender balance:',
        ethers.formatEther(await depositToken.balanceOf(await l1Sender.getAddress())),
      );
      ///await depositToken.mint(await distributor.getAddress(), wei(70));
      console.log(
        '>>>>>>> distributer balance(day 0):',
        ethers.formatEther(await depositToken.balanceOf(await distributor.getAddress())),
      );
      console.log(
        '>>>>>>> lsSender balance:',
        ethers.formatEther(await depositToken.balanceOf(await l1Sender.getAddress())),
      );

      // Set time to start reward distribution
      await setNextTime(oneDay * 11);

      // let userData = await depositPool.usersData(alice.address, publicRewardPoolId);

      // Alice stakes tokens
      await depositPool.connect(alice).stake(publicRewardPoolId, wei(100), 0, ZERO_ADDR);
      console.log(
        '>>>>>>> distributer balance(day 11 after alice staked 100):',
        ethers.formatEther(await depositToken.balanceOf(await distributor.getAddress())),
      );
      console.log(
        '>>>>>>> lsSender balance:',
        ethers.formatEther(await depositToken.balanceOf(await l1Sender.getAddress())),
      );

      // Fast forward time
      await setNextTime(oneDay * 12);
      console.log(
        '>>>>>>> distributer balance(day 12 ):',
        ethers.formatEther(await depositToken.balanceOf(await distributor.getAddress())),
      );
      console.log(
        '>>>>>>> lsSender balance:',
        ethers.formatEther(await depositToken.balanceOf(await l1Sender.getAddress())),
      );

      await depositPool.connect(bob).stake(publicRewardPoolId, wei(50), 0, ZERO_ADDR);
      console.log(
        '>>>>>>> distributer balance(day 12 after bob stakced 50):',
        ethers.formatEther(await depositToken.balanceOf(await distributor.getAddress())),
      );
      console.log(
        '>>>>>>> lsSender balance:',
        ethers.formatEther(await depositToken.balanceOf(await l1Sender.getAddress())),
      );

      await setNextTime(oneDay * 13);
      console.log(
        '>>>>>>> distributer balance (day 13):',
        ethers.formatEther(await depositToken.balanceOf(await distributor.getAddress())),
      );
      console.log(
        '>>>>>>> lsSender balance:',
        ethers.formatEther(await depositToken.balanceOf(await l1Sender.getAddress())),
      );
      await setNextTime(oneDay * 50);

      const aliceRewards = await depositPool.getLatestUserReward(publicRewardPoolId, alice.address);
      const bobRewards = await depositPool.getLatestUserReward(publicRewardPoolId, bob.address);
      console.log('>> Alice pendingRewards:', ethers.formatEther(aliceRewards));
      console.log('>> Bob pendingRewards  :', ethers.formatEther(bobRewards));

      // TODO: Insert vulnerability proof here
      // Example: Demonstrate reward calculation issue, reentrancy, etc.

      // await l1Sender.setLayerZeroConfig({
      //   gateway: await lzEndpointL1.getAddress(),
      //   receiver: await l2MessageReceiver.getAddress(),
      //   receiverChainId: l2ChainId,
      //   zroPaymentAddress: ZERO_ADDR,
      //   adapterParams: '0x',
      // });

      // try {
      //   await depositPool.connect(alice).claim(publicRewardPoolId, alice.address);
      //   console.log("✅ Alice claimed successfully!");

      // } catch (error) {
      //   console.log("⚠️ LayerZero mock error (expected), but reward calculation worked!");

      //   // Check that Alice's pending rewards were calculated correctly
      //   const aliceRewards = await depositPool.getLatestUserReward(publicRewardPoolId, alice.address);
      //   console.log("Alice calculated rewards:", ethers.formatEther(aliceRewards), "tokens");
      // }
    });
  });

  // Helper function to simulate complex scenarios
  async function setupComplexScenario() {
    // Add multiple deposit pools
    const pool2 = await deployERC20Token(); // USDC-like token

    // For libraries, we need to deploy them first
    const lib1 = await (await ethers.getContractFactory('ReferrerLib')).deploy();
    const lib2 = await (await ethers.getContractFactory('LockMultiplierMath')).deploy();

    const depositPool2Factory = await ethers.getContractFactory('DepositPool', {
      libraries: {
        ReferrerLib: await lib1.getAddress(),
        LockMultiplierMath: await lib2.getAddress(),
      },
    });

    const depositPool2Impl = await depositPool2Factory.deploy();
    const proxyFactory = await ethers.getContractFactory('ERC1967Proxy');
    const depositPool2Proxy = await proxyFactory.deploy(depositPool2Impl, '0x');
    const depositPool2 = depositPool2Factory.attach(depositPool2Proxy) as DepositPool;

    await depositPool2.DepositPool_init(pool2, distributor);

    // Add to distributor with Aave strategy
    const aToken = await deployERC20Token();
    await aavePoolDataProvider.setATokenAddress(await pool2.getAddress(), await aToken.getAddress());

    await distributor.addDepositPool(
      publicRewardPoolId,
      await depositPool2.getAddress(),
      await pool2.getAddress(),
      'ETH/USD',
      Strategy.AAVE,
    );

    return { pool2, depositPool2, aToken };
  }

  // Utility functions for common operations
  const utils = {
    // Time manipulation
    advanceTime: async (seconds: number) => await setNextTime((await getCurrentBlockTime()) + seconds),
    advanceDays: async (days: number) => await setNextTime((await getCurrentBlockTime()) + days * oneDay),

    // Token operations
    mintAndApprove: async (token: any, user: SignerWithAddress, spender: string, amount: bigint) => {
      await token.mint(user.address, amount);
      await token.connect(user).approve(spender, amount);
    },

    // Price feed manipulation
    setPrice: async (feed: ChainLinkAggregatorV3Mock, price: bigint) => {
      await feed.setAnswerResult(price);
      await feed.setUpdated(await getCurrentBlockTime());
    },

    // Logging helpers
    logBalances: async (token: any, addresses: string[], labels: string[]) => {
      for (let i = 0; i < addresses.length; i++) {
        const balance = await token.balanceOf(addresses[i]);
        console.log(`${labels[i]} balance:`, ethers.formatEther(balance), 'tokens');
      }
    },
  };
});
