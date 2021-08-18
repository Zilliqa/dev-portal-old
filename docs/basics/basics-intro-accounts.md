---
id: basics-intro-accounts
title: Accounts
keywords:
  - blockchain
  - accounts
  - contract account
  - user account
description: Zilliqa types of accounts
---

---

The Zilliqa blockchain follows an account-based model similar to Ethereum.
Accounts can hold native assets such as $ZIL or app-layer tokens issued as
Fungible or Non-Fungible assets. These assets can be transferred from one
account to another.

The collective state of all the accounts represents the global state of the
blockchain. Each account is identified by its address which is a 20-byte
string generated using a hash function.

Similar to Ethereum, the Zilliqa network supports two types of accounts:

### 1. Externally-Owned Account (aka User Account)

An account controlled by an end user who owns a public-private signature key pair. The address of an externally-owned account is essentially a truncated hash of the public key.

### 2. Contract Account

An account that has a smart contract code associated withit. A contract account gets created by a user when she deploys a smart contract on the network. The address of a contract account is the hash of the address of the user account that deployed the contract and some other information.
