---
id: basics-intro-accounts
title: Accounts
---
The global state of Ethereum is comprised of accounts that interact with one another through a message-passing framework. The most basic interaction is that of sending some value - like matic tokens, ether - the native cryptocurrency of Ethereum blockchain. Each account is identified by a 20 byte identifier which is called an address - this is the public key of the account. There exist two types of accounts:

1. Externally Owned Account - An account controlled by a private key, and if you own the private key associated with the account you have the ability to send tokens and messages from it.
2. Contract Owned Account - An account that has an associated smart contract code with it and its private key is not owned by anyone
These can be differentiated as follows:

## Externally Owned Accounts

1. can send transactions (ether transfer or trigger contract code)
2. is controlled by private keys
3. has no associated code

## Contract Owned Accounts

1. has associated code
2. code execution is triggered by transactions or messages (calls) received from other contracts
3. when executed - perform operations of arbitrary complexity (Turing completeness) - manipulate its own persistent storage, i.e., can have its own permanent state - can call other contracts.