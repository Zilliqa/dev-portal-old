---
id: arch-tx-lifecycle
title: Transaction Lifecycle
---

This document provides a detailed explanation of the lifecycle of a transaction
in the Zilliqa network.

# 0. Signing

Before sending a transaction, one must first sign it with a valid private key.
This can be done with one of the numerous SDKs provided by the Zilliqa team
and community.

Signing is done against the Protobuf-serialised version of the transaction's
contents. This is the reason why all SDKs depend on Protobuf to function. This
step is **transparent** to you as a developer.

# 1. Client -> Seed

Once you have successfully signed your transaction, you may broadcast the
transaction. This is done by using a seed node (e.g. `https://api.zilliqa.com`).
The correct RPC API to use is `CreateTransaction`. Bindings are available in
all SDKs.

The seed node performs some basic validation of the JSON payload it receives,
and will attempt to verify the signature. Please note that it does **not**
verify the correctness of your
[`nonce`](https://medium.com/kinblog/making-sense-of-ethereum-nonce-sense-3858d5588c64).
It is at all times the developer's responsiblity to correctly increment the
`nonce` used in the transaction.

If you use an incorrect `nonce`, your transaction can silently fail. This
means that the seed/lookup node will blindly forward your transaction to the
correct shard, which may then reject the transaction with **no error
receipt**.

# 2. Seed -> Shard

If your transaction is successfully verified by the seed node, the transaction
will be sent to the appropriate shard. Shard selection depends on a number of
factors that are explained in detail in [this
post](https://blog.zilliqa.com/provisioning-sharding-for-smart-contracts-a-design-for-zilliqa-cd8d012ee735).

Once the transaction reaches the shard, one of several things may happen:

1. Transaction is valid. It is included in the Micro Block.
2. Transaction is invalid due to repeated nonce and/or insufficient balance and is _not_ processed
3. Transaction is a smart contract call that results in an error. The
   transaction will be included with a error `receipt`.
4. Nonce has a gap. E.g.: current nonce is 1, but transaction nonce is 3. The
   transaction will remain in the shard's mempool until the following DS
   block.

## Case 1 and 3

After some time, the shard `leader` will multicast the proposed block with
your transaction included. You will be charged gas.

## Case 2

Your transaction will be silently dropped. It is therefore recommended to poll
the seed node with `GetTransaction` for **3** Tx Epochs. If the transaction is
not confirmed, you can assume that it has not been included in any block and
should be re-broadcated.

## Case 4

The appropriate course of action in this case is to resend the missing nonce.
E.g., if nonce 1 and 3 have been sent, a transaction with nonce 2 should be
sent in order for the transaction with nonce 3 to be processed. Note that the
mempool only persists until the **end of the DS epoch**.

# 3. Shard -> DS Committee

After the above process, each shard will produce a **Micro Block**. Micro
Blocks are aggregated by the DS Committee into a Transaction Block, after the
DS Committee agrees on the Transaction Block through the [pBFT consensus
mechanism](arch-overview.md#structure-and-consensus).

# 4. DS Committee -> Shard -> Lookup/Seed

After the DS Committee reaches consensus on the Transaction Block from the
step above, it multicasts the result to all shard nodes and lookup nodes. At
this stage, the seed node will have a result for your transaction _if
a receipt was generated_. It will be available via the RPC API
[`GetTransaction`](https://apidocs.zilliqa.com/#gettransaction).
