# Morpheus audit details
- Total Prize Pool: $20,000 in USDC
  - HM awards: up to $16,800 in USDC
    - If no valid Highs or Mediums are found, the HM pool is $0
  - QA awards: $700 in USDC
  - Judge awards: $2,000 in USDC
  - Scout awards: $500 in USDC
- [Read our guidelines for more details](https://docs.code4rena.com/competitions)
- Starts August 15, 2025 20:00 UTC 
- Ends August 22, 2025 20:00 UTC 

**❗ Important notes for wardens** 
1. Since this audit includes live/deployed code, **all submissions will be treated as sensitive:**
  - Wardens are encouraged to submit High-risk submissions affecting live code promptly, to ensure timely disclosure of such vulnerabilities to the sponsor and guarantee payout in the case where [a sponsor patches a live critical during the audit](https://docs.code4rena.com/awarding/incentive-model-and-awards#the-live-criticals-exception). 
  - Submissions will be hidden from *all* wardens (SR and non-SR alike) by default, to ensure that no sensitive issues are erroneously shared. 
  - If the submissions include findings affecting live code, there will be no post-judging QA phase. This ensures that awards can be distributed in a timely fashion, without compromising the security of the project. (Senior members of C4 staff will review the judges’ decisions per usual.)
  - By default, submissions will not be made public until the report is published.
  - **Exception:** if the sponsor indicates that no submissions affect live code, then we’ll make submissions visible to all authenticated wardens, and open PJQA to SR wardens per the usual C4 process.
2. A coded, runnable PoC is required for all High/Medium submissions to this audit. 
  - This repo includes a basic template to run the test suite.
  - PoCs must use the test suite provided in this repo.
  - Your submission will be marked as Insufficient if the POC is not runnable and working with the provided test suite.
  - Exception: PoC is optional (though recommended) for wardens with signal ≥ 0.68.
3. Judging phase risk adjustments (upgrades/downgrades):
  - High- or Medium-risk submissions downgraded by the judge to Low-risk (QA) will be ineligible for awards.
  - Upgrading a Low-risk finding from a QA report to a Medium- or High-risk finding is not supported.
  - As such, wardens are encouraged to select the appropriate risk level carefully during the submission phase.

## Automated Findings / Publicly Known Issues

The 4naly3er report can be found [here](https://github.com/code-423n4/2025-08-morpheus/blob/main/4naly3er-report.md).

_Note for C4 wardens: Anything included in this `Automated Findings / Publicly Known Issues` section is considered a publicly known issue and is ineligible for awards._

gitbook.mor.org/smart-contracts/documentation/distribution-protocol/v7-protocol/risks

✅ SCOUTS: Please format the response above 👆 so its not a wall of text and its readable.

# Overview

[ ⭐️ SPONSORS: add info here ]

## Links

- **Previous audits:**  gitbook.mor.org/security-audits
  - ✅ SCOUTS: If there are multiple report links, please format them in a list.
- **Documentation:** gitbook.mor.org
- **Website:** https://mor.org
- **X/Twitter:** https://x.com/morpheusais

---

# Scope

[ ✅ SCOUTS: add scoping and technical details here ]

### Files in scope
- ✅ This should be completed using the `metrics.md` file
- ✅ Last row of the table should be Total: SLOC
- ✅ SCOUTS: Have the sponsor review and and confirm in text the details in the section titled "Scoping Q amp; A"

*For sponsors that don't use the scoping tool: list all files in scope in the table below (along with hyperlinks) -- and feel free to add notes to emphasize areas of focus.*

| Contract | SLOC | Purpose | Libraries used |  
| ----------- | ----------- | ----------- | ----------- |
| [contracts/folder/sample.sol](https://github.com/code-423n4/repo-name/blob/contracts/folder/sample.sol) | 123 | This contract does XYZ | [`@openzeppelin/*`](https://openzeppelin.com/contracts/) |

### Files out of scope
✅ SCOUTS: List files/directories out of scope

# Additional context

## Areas of concern (where to focus for bugs)
Main focus on the DepositPool and Distributor contracts:
- we must maintain compatibility with the previous version and avoid introducing vulnerabilities that could lead to funds being locked or lost by stakers.
- we must ensure a highly reliable migration to the new version, without any loss of rewards for stakers (assuming the contract owner will perform the migration properly).
- the reward calculation for new deposit pools should be based on the documentation and requirements.
 - pay close attention to integrations with ChainLink and Aave.

✅ SCOUTS: Please format the response above 👆 so its not a wall of text and its readable.

## Main invariants

- the new version should use updated reward calculation mechanisms by supporting additional staking tokens.
- the new version must not lock user funds unless this behavior is explicitly defined by the protocol.
- the share of the DepositPool in calculations is taken at the current price of the token in relation to the USD, we do not take into account exchange rate fluctuations between claim, stake or withdraw.
- the data feeds for Chainlink are selected by the contract owner and are considered reliable.
- the shares of all DepositPools must be recalculated when the amount of staked tokens in any deposit pool changes.

✅ SCOUTS: Please format the response above 👆 so its not a wall of text and its readable.

## All trusted roles in the protocol

The Morpheus multisig - protocol owner.

✅ SCOUTS: Please format the response above 👆 using the template below👇

| Role                                | Description                       |
| --------------------------------------- | ---------------------------- |
| Owner                          | Has superpowers                |
| Administrator                             | Can change fees                       |

✅ SCOUTS: Please format the response above 👆 so its not a wall of text and its readable.

## Running tests

git clone https://github.com/MorpheusAIs/SmartContracts.git
git checkout -b feature/capital-builders-v2
npm run compile
npm run test

✅ SCOUTS: Please format the response above 👆 using the template below👇

```bash
git clone https://github.com/code-423n4/2023-08-arbitrum
git submodule update --init --recursive
cd governance
foundryup
make install
make build
make sc-election-test
```
To run code coverage
```bash
make coverage
```

✅ SCOUTS: Add a screenshot of your terminal showing the test coverage

## Miscellaneous
Employees of Morpheus and employees' family members are ineligible to participate in this audit.

Code4rena's rules cannot be overridden by the contents of this README. In case of doubt, please check with C4 staff.

# Scope

*See [scope.txt](https://github.com/code-423n4/2025-08-morpheus/blob/main/scope.txt)*

### Files in scope


| File   | Logic Contracts | Interfaces | nSLOC | Purpose | Libraries used |
| ------ | --------------- | ---------- | ----- | -----   | ------------ |
| /contracts/capital-protocol/ChainLinkDataConsumer.sol | 1| **** | 30 | |@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol<br>@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol<br>@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol<br>@solarity/solidity-lib/libs/decimals/DecimalsConverter.sol|
| /contracts/capital-protocol/DepositPool.sol | 1| **** | 41 | |@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol<br>@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol<br>@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol<br>@solarity/solidity-lib/utils/Globals.sol|
| /contracts/capital-protocol/Distributor.sol | 1| **** | 92 | |@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol<br>@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol<br>@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol<br>@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol<br>@openzeppelin/contracts/utils/math/Math.sol<br>@aave/core-v3/contracts/interfaces/IPool.sol<br>@aave/core-v3/contracts/interfaces/IPoolDataProvider.sol<br>@solarity/solidity-lib/libs/decimals/DecimalsConverter.sol|
| /contracts/capital-protocol/L1SenderV2.sol | 1| **** | 104 | |@openzeppelin/contracts/token/ERC20/IERC20.sol<br>@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol<br>@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol<br>@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol<br>@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol<br>@layerzerolabs/lz-evm-sdk-v1-0.7/contracts/interfaces/ILayerZeroEndpoint.sol<br>@arbitrum/token-bridge-contracts/contracts/tokenbridge/libraries/gateway/IGatewayRouter.sol|
| /contracts/capital-protocol/L2TokenReceiverV2.sol | 1| **** | 110 | |@openzeppelin/contracts/token/ERC721/IERC721.sol<br>@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol<br>@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol<br>@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol<br>@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol|
| /contracts/capital-protocol/RewardPool.sol | 1| **** | 13 | |@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol<br>@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol|
| **Totals** | **6** | **** | **390** | | |

### Files out of scope

*See [out_of_scope.txt](https://github.com/code-423n4/2025-08-morpheus/blob/main/out_of_scope.txt)*

| File         |
| ------------ |
| ./contracts/@layerzerolabs/lz-evm-messagelib-v2/contracts/uln/libs/DVNOptions.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppCore.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppReceiver.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/interfaces/IOAppComposer.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/interfaces/IOAppCore.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/interfaces/IOAppMsgInspector.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/interfaces/IOAppOptionsType3.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/interfaces/IOAppReceiver.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OAppOptionsType3.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTCore.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oft/interfaces/IOFT.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oft/libs/OFTComposeMsgCodec.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/oft/libs/OFTMsgCodec.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/precrime/OAppPreCrimeSimulator.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/precrime/interfaces/IOAppPreCrimeSimulator.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/precrime/interfaces/IPreCrime.sol |
| ./contracts/@layerzerolabs/lz-evm-oapp-v2/contracts/precrime/libs/Packet.sol |
| ./contracts/MOROFT.sol |
| ./contracts/builder-protocol/BuilderSubnets.sol |
| ./contracts/builder-protocol/BuildersTreasury.sol |
| ./contracts/builder-protocol/BuildersV2.sol |
| ./contracts/builder-protocol/BuildersV3.sol |
| ./contracts/builder-protocol/FeeConfig.sol |
| ./contracts/builder-protocol/old/Builders.sol |
| ./contracts/capital-protocol/DistributionV6.sol |
| ./contracts/capital-protocol/old/Distribution.sol |
| ./contracts/capital-protocol/old/DistributionV2.sol |
| ./contracts/capital-protocol/old/DistributionV3.sol |
| ./contracts/capital-protocol/old/DistributionV4.sol |
| ./contracts/capital-protocol/old/DistributionV5.sol |
| ./contracts/capital-protocol/old/L1Sender.sol |
| ./contracts/capital-protocol/old/L2MessageReceiver.sol |
| ./contracts/capital-protocol/old/L2TokenReceiver.sol |
| ./contracts/extensions/DistributionExt.sol |
| ./contracts/interfaces/IMOROFT.sol |
| ./contracts/interfaces/aave/IRewardsController.sol |
| ./contracts/interfaces/builder-protocol/IBuilderSubnets.sol |
| ./contracts/interfaces/builder-protocol/IBuildersTreasury.sol |
| ./contracts/interfaces/builder-protocol/IBuildersV3.sol |
| ./contracts/interfaces/builder-protocol/IFeeConfig.sol |
| ./contracts/interfaces/builder-protocol/old/IBuilders.sol |
| ./contracts/interfaces/capital-protocol/IChainLinkDataConsumer.sol |
| ./contracts/interfaces/capital-protocol/IDepositPool.sol |
| ./contracts/interfaces/capital-protocol/IDistributionV6.sol |
| ./contracts/interfaces/capital-protocol/IDistributor.sol |
| ./contracts/interfaces/capital-protocol/IL1SenderV2.sol |
| ./contracts/interfaces/capital-protocol/IL2TokenReceiverV2.sol |
| ./contracts/interfaces/capital-protocol/IReferrer.sol |
| ./contracts/interfaces/capital-protocol/IRewardPool.sol |
| ./contracts/interfaces/capital-protocol/old/IDistribution.sol |
| ./contracts/interfaces/capital-protocol/old/IDistributionV2.sol |
| ./contracts/interfaces/capital-protocol/old/IDistributionV3.sol |
| ./contracts/interfaces/capital-protocol/old/IDistributionV4.sol |
| ./contracts/interfaces/capital-protocol/old/IDistributionV5.sol |
| ./contracts/interfaces/capital-protocol/old/IL1Sender.sol |
| ./contracts/interfaces/capital-protocol/old/IL2MessageReceiver.sol |
| ./contracts/interfaces/capital-protocol/old/IL2TokenReceiver.sol |
| ./contracts/interfaces/extensions/IDistributionExt.sol |
| ./contracts/interfaces/old/IMOR.sol |
| ./contracts/interfaces/tokens/IStETH.sol |
| ./contracts/interfaces/tokens/IWStETH.sol |
| ./contracts/interfaces/uniswap-v3/INonfungiblePositionManager.sol |
| ./contracts/libs/LinearDistributionIntervalDecrease.sol |
| ./contracts/libs/LockMultiplierMath.sol |
| ./contracts/libs/LogExpMath.sol |
| ./contracts/libs/ReferrerLib.sol |
| ./contracts/mock/BuildersV2Mock.sol |
| ./contracts/mock/DistributionV2Mock.sol |
| ./contracts/mock/FeeConfigV2.sol |
| ./contracts/mock/InterfaceMock.sol |
| ./contracts/mock/L2MessageReceiverV2.sol |
| ./contracts/mock/LayerZeroEndpointV2Mock.sol |
| ./contracts/mock/LogExpMathMock.sol |
| ./contracts/mock/NonfungiblePositionManagerMock.sol |
| ./contracts/mock/OptionsGenerator.sol |
| ./contracts/mock/capital-protocol/DepositPoolMock.sol |
| ./contracts/mock/capital-protocol/DistributorMock.sol |
| ./contracts/mock/capital-protocol/L1SenderMock.sol |
| ./contracts/mock/capital-protocol/RewardPoolMock.sol |
| ./contracts/mock/capital-protocol/aave/AavePoolDataProviderMock.sol |
| ./contracts/mock/capital-protocol/aave/AavePoolMock.sol |
| ./contracts/mock/capital-protocol/arbitrum-bridge/ArbitrumBridgeGatewayRouterMock.sol |
| ./contracts/mock/capital-protocol/chainlink/ChainLinkAggregatorV3Mock.sol |
| ./contracts/mock/capital-protocol/chainlink/ChainLinkDataConsumerMock.sol |
| ./contracts/mock/capital-protocol/uniswap/UniswapSwapRouterMock.sol |
| ./contracts/mock/tokens/ERC20Mock.sol |
| ./contracts/mock/tokens/ERC20Token.sol |
| ./contracts/mock/tokens/StETHMock.sol |
| ./contracts/mock/tokens/WStETHMock.sol |
| ./contracts/old/MOR.sol |
| Totals: 94 |

