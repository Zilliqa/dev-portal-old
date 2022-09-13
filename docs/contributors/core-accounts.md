---
id: core-accounts
title: Account Management
keywords:
  - core
  - account
description: Core protocol design - account management.
---

---

## Overview

The Zilliqa blockchain supports two types of accounts:
- **Non-contract** - for balance transfers
- **Contract** - for both balance transfers and smart contract execution

![image01](/img/contributors/core/account-management/image01.png)

While non-contract accounts simply need to record base data like **balance** and **nonce**, contract accounts also have to store smart contract **code**, as well as **immutable and mutable states**.

The diagram here shows that account data is organized according to those common to all accounts (`AccountBase`) and those that only contract accounts would have (`Account`).

:::note
We can distinguish a contract from non-contract account by checking if `m_codeHash` is NULL. We can also choose to serialize only the base fields or both the base and the contract-related fields.
:::

## Contract Account States

A transaction that requests a contract **deployment** triggers the generation of a new contract account and the setting up of that account's immutable and mutable states. Then, transactions that invoke **transition calls** on that contract account trigger the updating of the mutable states.

Immutable states are more commonly referred to as the **init data**, and examples of this include `_scilla_version`, `_library`, and `_extlibs`.

Init data is supplied to the node within the transaction body (please refer to the [CreateTransaction](apis/api-transaction-create-tx.mdx) API documentation), although the node will also eventually add more fields into init data (such as `_creation_block` and `_this_address`) during transaction processing. 

Mutable states, on the other hand, are the variables that are manipulated by the Scilla interpreter as it executes a transition on the contract. The Zilliqa node provides the Scilla interpreter access to these states through the Scilla IPC server.

## Account Data Storage

Storage of accounts in the Zilliqa blockchain can be quite complex to understand due to the fact that account data is spread out across several leveldb databases:

| leveldb Name       | Managed By       | Key                                       | Value       |
| ------------------ | ---------------- | ----------------------------------------- | ----------- |
| state              | AccountStoreTrie | Address                                   | AccountBase |
| contractCode       | ContractStorage  | Address                                   | Code        |
| contractInitState2 | ContractStorage  | Address                                   | Tx data field + _creation_block + _this_address |
| contractStateData2 | ContractStorage  | Address.vname<br/>Address._depth.vname<br/>Address._type.vname<br/>Address.vname.index1.index2... | State value |
| contractTrie       | ContractStorage  | Hash of contractStateData2 key            | State value |
| stateRoot          | BlockStorage     | LATEST_EPOCH_STATES_UPDATED<br/>STATEROOT | Epoch number<br/>Trie root value |
| stateDelta         | BlockStorage     | Tx block number                           | List of Account |

## State Tries

The **state** and **contractTrie** databases are implementations of Ethereum's Merkle Patricia Trie data structure. 

A trie is a key-value data structure with a root hash and hashes along each key-value pair. The root hash is updated every time the structure is updated (e.g., by adding another key-value pair).

Please see this [Medium article](https://medium.com/@chiqing/merkle-patricia-trie-explained-ae3ac6a7e123) for how the trie structure evolves (specifically, where the root node is) as you add transactions one-by-one.

The trie provides the ability to prove that a specific key-value pair exists within the structure without the requesting party needing to know the rest of the structure. All the requesting party needs is the hash of the key-value pair at the particular time that the structure is being evaluated. For example, the **contractTrie** database supports requests from the [GetStateProof](apis/api-contract-get-state-proof.mdx) API, which requests for proof of a particular state for an account at a specific Tx block.

The **contractTrie** database was implemented in order to support bridging between the Zilliqa and Ethereum blockchains. While the contract state trie is useful for the blockchain bridging aspect, it is _not_ vital to the normal operation of the Zilliqa protocol, i.e., it has no impact on the normal transaction processing, consensus execution, and account state updating. Therefore, it does not need to be discussed further at present.

The **state** database, on the other hand, is used to store the `AccountBase` portion of the account data.

## State Trie Library

Zilliqa uses Ethereum's `GenericTrieDB` library for the trie structure. The `GenericTrieDB` class contains a `TraceableDB` member, which manages the loading from or saving to disk (i.e., to the levelDB database) of the trie structure.

![image02](/img/contributors/core/account-management/image02.png)

The basic usage will involve:
1. Calling `init()` to reset the root to NULL
1. Calling `insert()` to add nodes to the trie
1. Calling `at()` to access any of the added nodes
1. Calling `db()` to access the underlying `TraceableDB` member, and then either
   1. Calling `commit()` to save the changes to disk
   1. Calling `rollback()` to discard changes

This basic usage applies to the **state** database. In this context, a node basically refers to the `Address` (key) and the `AccountBase` (value) pair.

For the **contractTrie** database, the usage is slightly more complex due to the fact that separate tries are maintained for a maximum of `NUM_DS_EPOCHS_STATE_HISTORY` DS epochs. As mentioned in the previous section, we won't be going deeper into **contractTrie** for now.

## AccountStore Class Hierarchy

The diagram below highlights the Zilliqa architecture around account and account state storage.

![image03](/img/contributors/core/account-management/image03.png)

There are essentially _three_ account store objects in a Zilliqa node:
- `AccountStore` holds the accounts that have been committed to disk (i.e., the blockchain).
- `AccountStoreTemp` holds the account data that resides in transient memory and that has yet to be validated by the nodes during consensus.
- `AccountStoreAtomic` also holds account data in transient memory, but only for the current transaction being executed. More precisely, it is used for **contract call** transactions, where multiple accounts may be updated (e.g., a chain call). After the transaction is completely processed, the contents are moved to the `AccountStoreTemp` object.

The rest of the account store hierarchy is composed of abstract classes:
- `AccountStoreBase` contains the map of accounts in transient memory. It also provides an `UpdateAccount()` function for use on non-contract (i.e., payment) transactions.
- `AccountStoreSC` contains most of the smart contract-related functionality, including an `UpdateAccount()` function for use on contract (deployment and call) transactions.
- `AccountStoreTrie` contains trie management functions and the `GenericTrieDB` instance for the base account data and its storage in the **state** leveldb database.

Apart from the **state** leveldb database, the other account-related databases listed in the previous section are managed by the `ContractStorage` and `BlockStorage` classes.

Finally, the diagram also shows that aside from the account store classes, the `ScillaIPCServer` also interacts with `ContractStorage` whenever the Scilla Interpreter requests for state access during the execution of a contract.

## State Deltas

State deltas are the differences between what's stored in disk (i.e., the blockchain) and what's changed after transaction execution for a particular account (whether non-contract or otherwise).

Transaction processing by a node does not immediately result in committing any such differences to disk. As with any distributed ledger system, all nodes in the network must first reach consensus before they update their storage in a uniform manner. Until the consensus is completed (i.e., the proposed Tx Block is accepted by all nodes), state deltas must first be managed by a node separately within its transient memory.

It should also be noted that _multiple_ transactions could be called on the _same_ contract (for example, several users withdrawing rewards from the Staking contract), and thus the complete set of state deltas cannot be known immediately after one transaction, but rather only after all transactions for the current Tx epoch have been processed.

Another consideration unique to Zilliqa's architecture is that shards manage their own set of transactions that are different from those of other shards. This means nodes belonging to different shards will be holding different state deltas in their transient memory during the consensus period. Therefore, in order for all nodes to arrive at the same final states, these state deltas will eventually have to be shared across shards.

As can be inferred from the previous section, state deltas are generated by getting the differences for an account between `AccountStore` and `AccountStoreTemp`.

## Account and State Management During Tx Epoch

![image04](/img/contributors/core/account-management/image04.png)

## Account and State Management During Node Launch

![image05](/img/contributors/core/account-management/image05.png)
