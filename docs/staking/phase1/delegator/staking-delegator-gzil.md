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
description: $gZIL tokens
---

---

[`$gZIL`](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md#governance-tokens-aka-gzil), short for governance ZIL, is a ZRC-2 compliant fungible token contract. The rationale behind issuing gZIL is to capture long-term token holders and give them access to governance tokens that they can later use to make ecosystem-wide decisions. The contract code repository can be found [here](https://github.com/Zilliqa/staking-contract).

:::note
$gZIL will not be rewarded to SSN operators unless they themselves delegate their stake as a delegator. The commission does not have $gZIL component.
:::

| Parameter       | Value                              |
| --------------- | ---------------------------------- |
| Reward rate     | 0.001 $gZIL per $ZIL reward earned |
| Reward duration | ~1 year                            |
| Max supply      | 722,700 $gZIL                      |

After the 1-year duration, no $gZIL will be minted. Hence, we encourage all users to withdraw their stake reward before the ~1-year duration is up.

:::note
It is very possible that all the 722,700 $gZIL may not get minted as the number of $gZIL that get minted depends on the frequency of stake reward withdrawals.
:::

For integration with $gZIL, please refer to [ZRC-2 integration guide](../../../dev/dev-keys-zrc2-wallet-support).
