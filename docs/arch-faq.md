---
id: arch-faq
title: FAQ
---

This document contains some frequently asked questions that developers coming
from Ethereum-based blockchains typically have. Please read this document
thoroughly to avoid asking questions answered within this document.

## _How many confirmations must I wait for?_

You do not have to wait for any confirmations. Zilliqa's [consensus
protocol](arch-overview.md#structure-and-consensus) has the benefit of
finality. That is, unlike Proof of Work, it does not rely on the number of
hashes/economic games to produce a canonical state for the blockchain. Once
your transaction has been included in a block, it will not be rolled back.

## _I want to run a node but I do not want to open inbound ports._

The p2p networking layer of a Zilliqa node requires node operators (whether
shard or seed node) to open at least one inbound port for p2p communications.
This is because the underlying TCP connection(s) between peers is **not**
persistent.

As a result, in order for your node to receive messages from the
rest of the network, its peers **must** be able to **initiate** a TCP
connection with your node. Failure to do so will result in your node being
blacklisted by its peers for an entire DS epoch.

## _Can Zilliqa nodes manage my wallet?_

No. Zilliqa nodes will never manage your wallet and will never sign
transactions, unlike certain Bitcoin or Ethereum clients. For security
reasons, signing must always be performed by the user through the SDK or other
means.

## _What is the Tx Block time?_

Usually 2 minutes. Please note that your transaction may not be included in
the next Tx Block. Transactions broadcast will typically be included in Tx
Block `n+(1|2)`. For example, if the next Tx Block is 100, you may only find
your Transaction included in TxBlock 101, or 102.

## _Is there a WS API?_

There is no WebSocket API. Please use long polling to listen for new
transactions. A general technique for doing this is detailed in [this
document](exchange-tracking-deposits.md).

## _What is the wire format?_

The Zilliqa wire format is Protobuf. It is only used for p2p communication and
signature generation/verification. Most developers should never have to deal
with it, as the RPC APIs are entirely JSON-encoded.
