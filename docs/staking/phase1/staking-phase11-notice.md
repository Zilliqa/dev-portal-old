---
id: staking-phase11-notice
title: Phase 1.1 Migration Notice
keywords:
  - staking
  - general information
  - ssn
  - seed node
  - zilliqa
  - migration
description: Staking phase 1.1 migration notice
---

:::important

**Staking Phase 1 Migration**

We will be performing a contract migration from staking phase 1 to phase 1.1. The migration will happen on Tuesday 11th May 2021. Phase 1 contract will be frozen permanently at around 04:45 UTC.
The migration may take up to 7 days to complete. We will aim to re-open staking as soon as the migration is completed.
:::

## Staking Phase 1.1

As proposed in [ZIP-19](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-19.md), staking phase 1.1 consists of the following changes:

- Transfer of stake from one account to another account
- Proper deletion of empty maps to prevent contract states bloating
- Removal of user-defined ADT in `AssignStakeRewards` transition
- Staking parameters change

The migration to phase 1.1 will involve the following:

1. Freezing of phase 1.0 contracts
2. Deployment of new proxy and ssnlist contracts
3. Migration of states and funds from phase 1 to phase 1.1

## Important Notes

- No staking activities can be performed during the migration
- The contract addresses will be changed after the migration
- No action is needed for **delegators**
- For **wallets, explorers and node operators**, you will need to switch to the new contract addresses after the migration. All transition names and parameters in the contracts remain the same
- Stake rewards will be retroactively distributed in full to all delegators and node operators for the period of migration
- We will also update the Zillion staking portal to point to the phase 1.1 contracts after migration

## Information on Contracts

For wallets and explorers, we will aim to let you know of the phase 1.1 Mainnet staking contract addresses as soon as we can. In the meantime, we have migrated the testnet staking contract from phase 1 to phase 1.1. Please refer to [this page](staking-general-information) for the phase 1.1 testnet contracts.

## Changes to Staking Parameters (Mainnet)

With the Mainnet upgrade to Zilliqa `v8.0.0`, the block time will be reduced. As such, we will be making the following staking parameter changes:

| Parameter         | Phase 1.0           | Phase 1.1 (mainnet v8.0.0 - v8.0.3) | Phase 1.1 (mainnet v8.0.4)     |
| ----------------- | ------------------- | ----------------------------------- | ------------------------------ |
| 1 cycle duration  | ~27 hours           | ~23.83 hours                        | ~23.91 hours                   |
| Blocks per cycle  | 1,800               | 2,200                               | 2,200                          |
| Rewards per cycle | 1,980,000 $ZIL      | 1,548,800 $ZIL                      | 1,795,200 $ZIL                 |
| Unbonding period  | 24,000 final blocks | 30,800 final blocks (~2 weeks)      | 30,800 final blocks (~2 weeks) |

For wallets and explorers, you may need to adjust your UI to reflect the changes in the parameters.

## Migration Duration

|                 | Date/Time                       |
| --------------- | ------------------------------- |
| Migration start | Tuesday 11th May 2021 04:45 UTC |
| Migration end   | Tuesday 18th May 2021 05:00 UTC |

:::note
In the event of migration ending earlier than scheduled, we will resume the staking activities at the earliest possible time.
:::

## New Feature - Swapping of Wallet for Delegator

A new feature will be added to allow transferring of the entire stake deposit, rewards and pending withdrawals across all SSNs to a new address. Such a transfer will not require the user to go through an unbonding period and instead the transfer of stake and other relevant states will be immediately executed upon confirmation of the transfer. No penalty will be incurred for this transfer and there will be no restriction on the number of transfers.

The new transitions are as follows:

| Name                   | Parameters                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RequestDelegatorSwap` | `new_deleg_addr: ByStr20, initiator: ByStr20` | Creates a request to another delegator to indicate transferring all existing stakes, rewards, etc., to this new delegator.<br/><br/>`initiator` is the address of the delegator who wants to transfer his/her stakes.<br/><br/>`new_deleg_addr` is the address of the recipient that would be receiving all the staked amount, rewards, pending withdrawals, etc., of the `initiator` (original owner). The `initiator` is allowed to change the recipient by sending the request with another `new_deleg_addr`. The `initiator` can also revoke the request via `RevokeDelegatorSwap`.<br/><br/>On the recipient end, the `new_deleg_addr` can either `ConfirmDelegatorSwap` to accept the swap or `RejectDelegatorSwap` to reject the swap.<br/><br/>To avoid either party from gaining or losing rewards after the swap, both parties must not have buffered deposits or unwithdrawn rewards at the time of request and confirming. Also, the `initiator` is not allowed to make a request to `new_deleg_addr` if there is an existing request made by `new_deleg_addr` to the `initiator`, i.e., if there exists a `A -> B` request, then `B` cannot make a request to `A` unless `B` accepts or rejects the existing request first. However, `B` can make other swap requests to other delegators.<br/><br/>**Change is irreversible once the recipient accepts the swap request, so please be cautious of the `new_deleg_addr`.** |
| `RevokeDelegatorSwap`  | `initiator: ByStr20`                          | Revokes a swap request. This is used only by the `initiator` who has made an existing swap request and wishes to cancel it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `ConfirmDelegatorSwap` | `requestor: ByStr20, initiator: ByStr20`      | Accepts a swap request from a requestor.<br/><br/>`initiator` is the new delegator that would be inheriting all the staked amount, withdrawals, rewards, etc., from `requestor`.<br/><br/>`requestor` is the delegator who has initiated a swap request via `RequestDelegatorSwap`.<br/><br/>To avoid either party from gaining or losing rewards after the swap, both parties must not have buffered deposits or unwithdrawn rewards at the time of confirming.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `RejectDelegatorSwap`  | `requestor: ByStr20, initiator: ByStr20`      | Rejects a swap request from a requestor.<br/><br/>Once rejected, the requestor must create the swap request again if he/she wishes to revert the rejection.<br/><br/>`initiator` is the new delegator that would be inheriting all the staked amount, withdrawals, rewards, etc., from `requestor`.<br/><br/>`requestor` is the delegator who has initiated a swap request via `RequestDelegatorSwap`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

For more information, please refer to [Transfer of stake deposit between accounts](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-19.md#design-changes-for-phase-11)

## References

- [Phase 1.1 staking contracts](https://github.com/Zilliqa/staking-contract)
- [ZIP-19 - Seed Node Staking Mechanism: Phase 1.1](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-19.md)
- [Zilliqa Mainnet V8 Upgrade Notice](../../dev/dev-upgrade-v8)
