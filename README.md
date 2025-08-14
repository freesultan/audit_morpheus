# ✨ So you want to run an audit

This `README.md` contains a set of checklists for our audit collaboration. This is your audit repo, which is used for scoping your audit and for providing information to wardens

Some of the checklists in this doc are for our scouts and some of them are for **you as the audit sponsor (⭐️)**.

---

# Repo setup

## ⭐️ Sponsor: Add code to this repo

- [ ] Create a PR to this repo with the below changes:
- [ ] Confirm that this repo is a self-contained repository with working commands that will build (at least) all in-scope contracts, and commands that will run tests producing gas reports for the relevant contracts.
- [ ] Please have final versions of contracts and documentation added/updated in this repo **no less than 48 business hours prior to audit start time.**
- [ ] Be prepared for a 🚨code freeze🚨 for the duration of the audit — important because it establishes a level playing field. We want to ensure everyone's looking at the same code, no matter when they look during the audit. (Note: this includes your own repo, since a PR can leak alpha to our wardens!)

## ⭐️ Sponsor: Repo checklist

- [ ] Modify the [Overview](#overview) section of this `README.md` file. Describe how your code is supposed to work with links to any relevant documentation and any other criteria/details that the auditors should keep in mind when reviewing. (Here are two well-constructed examples: [Ajna Protocol](https://github.com/code-423n4/2023-05-ajna) and [Maia DAO Ecosystem](https://github.com/code-423n4/2023-05-maia))
- [ ] Optional: pre-record a high-level overview of your protocol (not just specific smart contract functions). This saves wardens a lot of time wading through documentation.
- [ ] Review and confirm the details created by the Scout (technical reviewer) who was assigned to your contest. *Note: any files not listed as "in scope" will be considered out of scope for the purposes of judging, even if the file will be part of the deployed contracts.*  

---

# Morpheus audit details
- Total Prize Pool: $20000 in USDC
  - HM awards: up to XXX XXX USDC (Notion: HM (main) pool)
    - If no valid Highs or Mediums are found, the HM pool is $0 
  - QA awards: $700 in USDC
  - Judge awards: $2000 in USDC
  - Scout awards: $500 in USDC
  - (this line can be removed if there is no mitigation) Mitigation Review: XXX XXX USDC
- [Read our guidelines for more details](https://docs.code4rena.com/competitions)
- Starts XXX XXX XX 20:00 UTC (ex. `Starts March 22, 2023 20:00 UTC`)
- Ends XXX XXX XX 20:00 UTC (ex. `Ends March 30, 2023 20:00 UTC`)

**❗ Important notes for wardens** 
## 🐺 C4 staff: delete the PoC requirement section if not applicable - i.e. for non-Solidity/EVM audits.
1. A coded, runnable PoC is required for all High/Medium submissions to this audit. 
  - This repo includes a basic template to run the test suite.
  - PoCs must use the test suite provided in this repo.
  - Your submission will be marked as Insufficient if the POC is not runnable and working with the provided test suite.
  - Exception: PoC is optional (though recommended) for wardens with signal ≥ 0.68.
1. Judging phase risk adjustments (upgrades/downgrades):
  - High- or Medium-risk submissions downgraded by the judge to Low-risk (QA) will be ineligible for awards.
  - Upgrading a Low-risk finding from a QA report to a Medium- or High-risk finding is not supported.
  - As such, wardens are encouraged to select the appropriate risk level carefully during the submission phase.

## Automated Findings / Publicly Known Issues

The 4naly3er report can be found [here](https://github.com/code-423n4/2025-08-morpheus/blob/main/4naly3er-report.md).

_Note for C4 wardens: Anything included in this `Automated Findings / Publicly Known Issues` section is considered a publicly known issue and is ineligible for awards._
## 🐺 C4: Begin Gist paste here (and delete this line)





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

