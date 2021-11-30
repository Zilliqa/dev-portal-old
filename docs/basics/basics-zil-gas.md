---
id: basics-zil-gas
title: Gas Accounting
keywords:
  - gas accounting
  - gas pricing
  - contract gas
  - zilliqa
  - minimum gas
description: Zilliqa Gas
---

---

## Gas Pricer

Zilliqa's consensus algorithm (i.e., PBFT) requires nodes to vote on each
block and hence each transaction therein. Every transaction that goes to the
network has a gas price -- which is the price (in $ZIL) per gas unit that the
sender is willing to pay to the miners to process the transaction.

In order to ensure that miners do not impose a gas price of their own which
could make it impossible to agree on transactions, the Zilliqa protocol
maintains a _global minimum gas price_ that all miners will accept.

The network runs an algorithm to compute the acceptable global minimum gas
price that the entire network will agree upon. The algorithm takes into
account: a) the previous gas prices for the last few epochs b) the minimum
gas price that each miner is willing to accept for the current epoch and, c)
network congestion.

Essentially, the algorithm decides on the gas price depending on the
network congestion in the last few epochs. The rationale being that if the
network congestion is high, then the miners get to have a say on the gas
price, while if the network is not congested, then the gas price should not
depend too much on the proposed gas prices.

The current global minimum gas price is 0.002 ZIL.

## Payment Transactions

Each payment transaction consumes 50 gas unit and therefore, the gas to be paid
for a payment transaction is 0.1 ZIL.

## Smart Contract Transactions

As smart contract transactions involve more compute and storage, the gas
required to process a smart contract transaction depends on the complexity of
the contract being called, the parameters being passed etc. Scilla comes with
an in-built gas accounting module that keeps track of gas consumed as the
Scilla interpreter executes a contract.

Each usage of a Scilla literal, executing an expression and statement in Scilla
have a deterministic associated cost. More details can be found the [gas
accounting documentation](https://github.com/Zilliqa/scilla-docs/blob/master/docs/texsources/gas-costs/gas-doc.pdf)
