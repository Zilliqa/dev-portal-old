---
id: basics-intro-txns
title: Transactions
keywords:
  - transactions
  - types
  - zilliqa
description: Transaction types
---

---

To interact with an account (externally-owned or contract), one has to
issue transactions. Each transaction is a data package signed by an
externally-owned account.

## Usage of Transactions

1. The simplest usage of a transaction is to transfer native assets (such as
   $ZIL) from one externally-owned account to another externally-owned account
   or a contract account.

2. A transaction is issued when an externally-owned account deploys a contract
   on the network.

3. A transaction may also be issued to call a function in the smart contract
   associated to a contract account which may in turn trigger calls to other
   contracts creating a call graph. Note that calls from one contract account to another
   happens via inter-contract message calls and are not using transactions per se.
