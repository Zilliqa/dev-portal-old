---
id: staking-faq
title: Frequently asked question (FAQ)
---

## How do I track my users’ rewards? 

This is out of the scope at the staking implementation layer. Staked seed node operators will need to provide facilities for:
- Allowing user to deposit stake 
- Allowing user to withdraw stake 
- Distribution of stake rewards


## Why are my accumulated rewards less than the expected amount?

There are several situations where an SSN may be assigned less than the expected rewards after a certain period of operation, such as:

- Downtime of the Zilliqa network (e.g., for maintenance and upgrades), in which case the network does not progress and the number of DS blocks mined for the year falls below the expected number. This reduced DS block count in turn results in fewer reward cycles for the year, and thus less accumulated rewards.
- The staked seed node didn’t perform well and may have failed one or more of the checks performed by the Verifier during the reward cycle.

## Why is my seed node not shown on the seed node monitoring status page?

This is an indication that your seed node is not currently active. It may either exist in the contract as an inactive node or it has yet to be added to the contract.

## Can I make multiple deposits into the stake deposit?

Yes, you may do so at any time, but take note of these items:
- The staked seed node remains inactive until the accumulated stake deposit reaches the minimum stake amount (10,000,000 ZIL)
- Incremental deposits are buffered and excluded from the reward calculation until the next rewarding cycle (i.e,. every 17th DS epoch) has passed

## Can I make multiple withdrawals from the stake deposit?

Yes, you may do so at any time, but take note of these items:
- The staked seed node remains active (and eligible for rewards) until the stake deposit falls below the minimum stake amount (10,000,000 ZIL)
- Incremental withdrawals are immediately deducted from the stake deposit and will affect the amount of rewards the seed node will receive for the current rewarding cycle
- A withdrawal that zeroes out the stake deposit (with rewards not fully withdrawn) also automatically removes the staked seed node from the smart contract

## Can I make multiple withdrawals from the staked rewards?

Yes, you may do so at any time, but take note of these items:
- A withdrawal that zeroes out the rewards (with stake deposit also fully withdrawn) also automatically removes the staked seed node from the smart contract
 

> More FAQs for staking are available on the Zilliqa website at https://www.zilliqa.com/faq

