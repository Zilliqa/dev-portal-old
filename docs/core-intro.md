---
id: core-intro
title: Introduction
---
The documents in this section provide a detailed description on different aspects of the Zilliqa blockchain core protocol.

## Overview

- Network Layout
- Epoch Architecture
- [General Node Operation](core-node-operation.md)

## Consensus Layer

- [Consensus Protocol](core-consensus.md#usage-in-the-protocol)
- Schnorr Algorithm
- [Multisignatures](core-consensus.md#multisignatures)

## Network Communication & Topographies

- [Gossip Protocol](core-network.md#gossip-protocol)
- [Tree-based Cluster Broadcasting](core-network.md#tree-based-cluster-broadcasting)
- [Blacklist](core-network.md#blacklist)
- [Messaging Limits](core-network.md#messaging-limits)

## Messaging Layer

- Message Format
- Protobuf and Serialization
- [Message Dispatch and Processing](core-messaging.md#message-dispatch-and-processing)
- [Message Queues and Thread Pools](core-messaging.md#message-queues-and-thread-pools)
- Commands

## Data Layer

- Blockchain Data
- [Transaction Checks](core-data.md#transaction-checks)
- [Local Storage](core-data.md#local-node-storage)
- [Incremental DB](core-incremental-db.md)

## Directory Service

- Operational Details (State Machine)
- [DS MIMO](core-directory-service.md#ds-committee-multiple-in-multiple-out-ds-mimo-setup)
- [DS Reputation](core-directory-service.md#ds-reputation)

## Shard Node

- Operational Details (State Machine)

## Lookup

- Transaction Dispatch
- [Multiplier](core-multipliers.md)
- [API Server](core-lookup-servers.md#api-server)
- [Status Server](core-lookup-servers.md#status-server)
- [Websocket Server](core-lookup-servers.md#websocket-server)

## Mining

- [PoW Algorithm](core-mining.md#pow-algorithm)
- [Difficulty Adjustment](core-mining.md#difficulty-adjustment)
- [Coinbase / Rewards](core-mining.md#coinbase--rewards)
- [Proof of Reputation](core-mining.md#proof-of-reputation)

## Mitigation Measures

- [Guard Mode](core-guard-mode.md)
- [Rejoin Mechanism](core-rejoin-mechanism.md)
- [Recovery Mechanism](core-recovery-mechanism.md)
- [View Change](core-view-change.md)
- [Diagnostic Data](core-diagnostic-data.md)