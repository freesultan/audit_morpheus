## deposit
```solidity 
///////////////reward pool 
struct RewardPool {
        uint128 payoutStart; day 10 
        uint128 decreaseInterval; 1 day
        uint256 initialReward;
        uint256 rewardDecrease;
        bool isPublic;
    }
rewardPoolIndex = 0 
////////////// distributer

Token Balance = 150 

rewardPoolLastCalculatedTimestamp[0] = day 12 ;
 struct DepositPool {
        address token;
        string chainLinkPath;
        uint256 tokenPrice;
        uint256 deposited; 150
        uint256 lastUnderlyingBalance; 150
        Strategy strategy; 
        address aToken;
        bool isExist; True
    }

ourdepositPool = DepositPool(token_, chainLinkPath_, 0, 0, 0, strategy_, aToken_, true)

depositPoolAddresses[0] = ourdepositPoolAddr
depositPools[0][ourdepositPoolAddr] = ourdepositPool

/////////// depositPool
isMigrationOver= true

//alice stake 100 tokens
usersData.deposited = 100

usersData.virtualDeposited = 100

usersData.rate = currentPoolRate (0) // current reward pool rate

usersData.lastStake = timestamp, claimLockStart = claimLockEnd = timestamp

usersData[alice][0] = userData
usersData[bob][0] = userDataBob



totalDepositedInPublicPools = 150 

```