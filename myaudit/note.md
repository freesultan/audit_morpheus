## Areas to focus
- funds being locked or lost by stakers DepositPool & Distributer
- the reward calculation for new deposit pools should be based on the documentation and requirements
- pay close attention to integrations with ChainLink and Aave.
- we must ensure a highly reliable migration to the new version, without any loss of rewards for stakers (assuming the contract owner will perform the migration properly)

## Invariants
- the shares of all DepositPools must be recalculated when the amount of staked tokens in any deposit pool changes.