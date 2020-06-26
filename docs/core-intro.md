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

- [Consensus Protocol](core-consensus.md)
- Schnorr Algorithm
- [Multisignatures](core-multisignatures.md)

## Network Communication & Topographies

- [Gossip Protocol](core-gossip.md)
- [Tree-based Cluster Broadcasting](core-broadcasting.md)
- [Blacklist](core-blacklist.md)
- [Messaging Limits](core-messaging-limits.md)

## Messaging Layer

- Message Format
- Protobuf and Serialization
- [Message Processing](core-message-processing.md)
- Commands

## Data Layer

- Blockchain Data
- [Transaction Checks](core-data.md#transaction-checks)
- [Local Storage](core-data.md#local-node-storage)
- [Incremental DB](core-incremental-db.md)

## Directory Service

- Operational Details (State Machine)
- [DS MIMO](core-ds-mimo.md)
- [DS Reputation](core-ds-reputation.md)

## Shard Node

- Operational Details (State Machine)

## Lookup

- API Server
- [Websocket Server](core-websocket-server.md)
- [Transaction Dispatch](core-transaction-dispatch.md)
- [Multipliers](core-multipliers.md)

## Mining

- [PoW Algorithm](core-pow.md)
- [Difficulty Adjustment](core-difficulty-adjustment.md)
- [Proof of Reputation](core-por.md)
- [Coinbase Rewards](core-coinbase.md)

## Mitigation Measures

- [Guard Mode](core-guard-mode.md)
- [Rejoin Mechanism](core-rejoin-mechanism.md)
- [Recovery Mechanism](core-recovery-mechanism.md)
- [View Change](core-view-change.md)
- [Diagnostic Data](core-diagnostic-data.md)
- [Status Server](core-status-server.md)