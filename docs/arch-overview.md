---
id: arch-overview
title: Overview
---

This document provides a high level overview of the design and architecture of
the Zilliqa blockchain. As its architecture represents a significant departure
from first generation Bitcoin and Ethereum derivatives, it is not helpful to
use these as analogies.

# Structure and Consensus

The Zilliqa network is composed of one DS Committee (a special type of shard),
and `n` normal shards. Each shard has a number of nodes, with one node being a
`leader` and `k` number of `backups`.

Broadly, each shard runs an algorithm called practical Byzantine fault
tolerance (pBFT) to achieve consensus on the state of the blockchain at any
point. A rough outline is as follows:

1. Pre-prepare: the `leader` announces the state of the blockchain it has to all
   `backup` nodes in the shard as a **pre-prepare** message.
2. Prepare: each node receives and validates the state received from the
   `leader` in the pre-prepare phase, and multicasts its decision as
   a **prepare** message to the rest of the nodes in the shard.
3. Commit: upon receiving a valid **prepare** message from a super majority
   (2/3) of nodes, it multicasts a **commit** message to all other nodes. Once
   a **commit** message is recieved from a super majority, the node records
   the new state.

In the next section, we cover the different types of blocks, and how the final
state of the blockchain is finally reconciled by the DS Committee.

# Block Types

Because of its sharded architecture, Zilliqa produces a number of different
types of blocks:

1. DS Block: metadata on the composition of the DS committee, and the state of
   the network in general. The time between DS blocks is referred to as a DS
   epoch. DS blocks are "mined" every 100 Transaction Blocks (Tx Block).
2. Transaction Block: analogous to a block in Ethereum/Blockchain. These
   blocks are simply aggregations of transactions processed by every shard
   during a given window of time. The time between Tx Blocks is referred to as
   a Tx Epoch.
3. Micro Block: these are shard-level Transaction Blocks. They consist of all
   transactions processed by the shard for a given Tx Epoch. They are
   aggregated by the DS Committee, and form a Tx Block.

For most developers, the most relevant block type is the `Tx Block`. In
general, you may use these to track transactions you are interested in, and to
detect whther your transactions have been successfully confirmed.

# Cryptographic Primitives

Like all other blockchains, Zilliqa relies on a number of well-established
cryptographic primitives as its underlying building block. 

### SHA256

Unlike Ethereum, Zilliqa uses SHA256 to generate **all** hashes (address,
block hash, etc). Please note that this means Zilliqa and Ethereum addresses
are _not compatible_.

### Schnorr

Zilliqa uses secp256k1, a widely implemented and well-understood elliptic
curve for signing with the Schnorr algorithm. The Schnorr
scheme is _entirely_ differenty and incompatible with ECDSA, which is used by
Ethereum.

### Address generation

Deriving a Zilliqa address takes the following steps:

1. Generate a secp256k1 private/public key pair
2. Take the 20 right-most bytes from `sha256(public_key)` (i.e., 20 least
   significant bytes.)

Note that this results in a 20-byte address that looks **exactly** like an
Ethereum address. In order to work around the confusion, we have implemented [checksum](https://github.com/Zilliqa/Zilliqa-JavaScript-Library/blob/dev/packages/zilliqa-js-crypto/src/util.ts#L106)
similar to the one in
[EIP55](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md). However,
we instead take the 6th bit to decide whether or not to use uppercase.

We also support `bech32` address format to prevent confusion from Ethereum's address format. For more info, refer to [this blog post](https://blog.zilliqa.com/zilliqa-migrates-to-new-address-format-bf1fa6d7e41d) or this [page](./dapp-getting-started#addresses).
