---
id: basics-zil-sharding
title: Sharding Mechanism
---
In this section, we present the core idea of sharding that makes Zilliqa scale. Sharding in Zilliqa takes many forms: *network sharding*, *transaction sharding*, and *computational sharding*. The most important among these is network sharding as the other sharding mechanisms are built atop the network sharding layer.

## Network Sharding

Network sharding (which will be referred to simply as *sharding* in this context) is a mechanism that allows the Zilliqa network to be divided into smaller groups of nodes each referred to as a *shard*. Simply put, imagine a network of 1,000 nodes, then, one may divide the network into 10 shards each composed of 100 nodes.

Network sharding is the secret sauce that makes Zilliqa truly scalable. Imagine our example network of 1,000 nodes. Zilliqa would automatically divide the network into 10 shards each with 100 nodes. Now, these shards can process transactions in parallel. If each shard is capable of processing 10 transactions per second, then all shards together can process 100 transactions per second. The ability to process transactions in parallel due to the sharded architecture ensures that the throughput in Zilliqa linearly increases with the size of the network.

The idea of sharding is certainly not new, and it can be traced back to the field of databases, where it is employed to improve performance, scalability and I/O bandwidth. The idea of sharding in the context of blockchains however was first put forth in an [academic paper](https://dl.acm.org/doi/10.1145/2976749.2978389) co-authored by Zilliqa team members in 2015.

## Transaction Sharding

As discussed above, network sharding opens up avenues for parallel transaction processing — each shard should now be able to independently process transactions and hence yield high throughput. Whenever a transaction reaches the network, it gets assigned to a specific shard. The assignment is determined by the first few bits of the sending address of the transaction. This is called *transaction sharding*.

For example, to assign transactions in a network with two shards S1 and S2, we first check the sender’s address. If the sender’s address ends with 0, then the transaction should be assigned to S1, else it should be assigned to S2.

This assignment strategy, however, only works with payment transactions. To properly handle both payment and smart contract transactions, a different solution is employed by categorizing transactions so that we can have a separate assignment strategy for each category.

Transactions received by the network can be classified into the following categories depending on the type of accounts involved. Below, we call an account a *user account* (or a non-contract account) if it is controlled by a user and does not hold contract code. As an extension, an account that holds contract code will be referred to as a *contract account*.

![Txn sharding](../assets/txnsharding.png)

### Type I

Type I (U1 -> U2): A user account sending some money to another user account, i.e., regular payment transactions that do not involve smart contracts. An example transaction would be a user Alice sending some ZILs to another user Bob.

### Type II

Type II (U -> C): A user calling a smart contract that does not call any other smart contract, neither does the contract transfer funds to another user. I.e., transactions that involve only a user account and a smart contract. An example transaction would be a user Alice donating 5 ZIL to a crowdfunding contract.

### Type III

Type III (U1 -> C1 -> … -> Cn [-> U2]): Any other transaction. This category includes transactions originating from a user that can invoke a chain of contracts and potentially terminate with a user account. An example transaction will be Alice calling a travel agent contract (C1) that calls an airline contract (C2) that in turn calls an insurance contract (C3).

### Assignment Strategy

At any given time, each shard will only handle transactions of Type I and II, while the DS committee will handle transactions of Type III only after transactions of Categories I and II have been validated by the rest of the shards. The DS committee may also handle certain transactions of Type I or II. Do note that the DS committee will not handle transactions in parallel (to the shards); otherwise, it will become possible to double spend.

The exact assignment strategy is as follows:

1. For a network with k = 2^n shards, each shard will only process transactions of Type I and II in which both the sender’s and the recipient’s address have the same last n bits.

2. Any other transaction (including of Type III)) will be processed by the DS committee after the other shards have finished processing transactions meant for them.