---
id: basics-intro-accounts
title: Accounts
---

The Zilliqa blockchain follows an account-based model similar to Ethereum.
Accounts can hold native assets such as $ZIL or app-layer tokens issued as
Fungible and Non-Fungible assets. And assets can be transferred from one
account to another.

The collective state of all the accounts represents the global state of the
blockchain. Each account is identified by its address which is a 20-byte
string generated using a hash function.

The network supports two types of accounts:

1. Externally-Owned Account (aka User Account) - An account controlled by an
   end user who owns a public-private cryptographic key pair. The address of an
externally-owned account is essentially a truncated hash of the public key.

2. Contract Account - An account that has a smart contract code associated with
   it. A contract account gets created by a user when she deploys a smart
   contract on the network. The address of a contract account is the hash of
   the public key of the user account and some other information.  


## Externally-Owned (aka User) Accounts

1. can send transactions (ether transfer or trigger contract code)
2. is controlled by private keys
3. has no associated code

## Contract Owned Accounts

1. has associated code
2. code execution is triggered by transactions or messages (calls) received from other contracts
3. when executed - perform operations of arbitrary complexity (Turing completeness) - manipulate its own persistent storage, i.e., can have its own permanent state - can call other contracts.
