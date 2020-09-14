---
id: staking-delegator-gzil
title: gZIL Tokens
keywords: 
- staking
- ssn
- smart contract
- zilliqa	
- delegator
- gzil
description: gZIL tokens
---
---

[`gZIL`](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md#governance-tokens-aka-gzil), short for governance ZIL, is a ZRC-2 compliant fungible token contract. The rationale behind issuing gZILs is to capture long-term token holders and give them access to governance tokens that they can later use to make ecosystem-wide decisions. The contract code respository can be found over [here](https://github.com/Zilliqa/staking-contract).

:::note
gZILs will not be rewarded to SSN operators unless they themselves delegate their stake as a delegator. Earning commission does not entitle operators to gZILs.
:::

| Parameters        | Values                            |
| ----------------- | --------------------------------- | 
| Reward rate       | 0.001 gZIL per ZIL reward earned  |
| Reward duration   | 1 year                            | 
| Max supply        | 682,550 gZILs                     | 

After the 1 year duration, no gZIL will be not minted. Hence, we encourage all users to withdraw stake reward before the 1 year duration is up. 

:::note
It is very possible that all the 682,550 gZIL may not get minted as the number of gZILs that get minted depends on the frequency of stake reward withdrawals. 
:::

For integration with gZIL, please refer to [ZRC-2 integration guide](../../../dev/dev-keys-zrc2-wallet-support).