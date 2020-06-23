---
id: core-incremental-db
title: Incremental DB
---
This document describes the purpose behind incremental-db which levereges AWS S3 service and its implementation details.

### Description

- The goal is to provide an efficient way to miners and seed nodes to get blockchain data in order to join the network.

### Purpose

- Basic idea would have been to upload or sync entire persistence to S3 bucket every TxEpoch. And new nodes fetch the entire persistence from S3 bucket.
- This would have been alright for all databases except for leveldb `state` because aws-cli sync for `state` database will result in uploading all file in the db which will be time consuming and not bandwidth efficient.
- Uploading of `state` leveldb for every TxEpoch is bottle neck and solution is to use `incremental-db`.

**Note:** _Its practically possible that all files in `stateDB` gets updated every TxEpoch if transactions in that epoch changes states of addresses which updates TrieDB across all files in levelDB._

### Building Blocks

Following two scripts are main building blocks:

#### Upload Incremental DB script

This script `uploadIncrDB.py` runs on one of the lookup node. It performs following steps:

- Add Lock file to S3 bucket - `incremental`

- Perform sync between local `persistence` on lookup node and `incremental\peristence` on S3 every TxEpoch. However, syncing criterias differs based on TxEpoch number.
  Following are possibilities:
  
  - Script startup
    - Clean both buckets i.e. `incremental` and `statedelta`
    - Sync entire persistence to S3 bucket - `incremental` (including `state, stateroot, txBlocks, txnBodies, txnBodiesTmp, microblock, etc` ( every thing that exists in persistence folder ) at every 10th vacuous epoch.
    - Clean all statedeltas from S3 bucket - `statedelta`

  - Every 10th DS Epoch (first txEpoch from 10th DS epoch)
    - Sync entire persistence to S3 bucket - `incremental` (including `state, stateroot, txBlocks, txnBodies, txnBodiesTmp, microblock, etc` ( every thing that exists in persistence folder ).
    - Clean all statedeltas from S3 bucket - `statedelta`

  - Any other txEpoch
    - Sync entire persistence to S3 bucket - `incremental` (excluding `state, stateroot, contractCode, contractStateData, contractStateIndex`) every txEpoch.
    - If `current txBlkNum == vacuous epoch + 1`
     (i.e. first txBlock in current DS epoch e.g 100, 200, 300, ... ), we don't need to upload statedelta diff here. Instead complete stateDelta db is uploaded to S3 bucket - `statedelta` ( e.g. `stateDelta_100.tar.gz` ).
    Else upload the statedelta diff to S3 bucket - `statedelta` (e.g. `stateDelta_101.tar.gz, stateDelta_101.tar.gz, .... stateDelta_199.tar.gz`).

- Remove Lock file from S3 - `incremental`.

#### Download Incremental DB script

This script `downloadIncrDB.py` is first ran by every miner node or seed node to get latest block chain data. It perform following steps:

- Check if Lock file existed. Wait until no Lock file is found. Otherwise go to Step 2.

- Clean existing persistence, if any. And download Entire Persistence from S3 bucket - `incremental`.
  If node is `miner`, `microblocks` and `txBodies` are not downloaded.

- Check if Lock file existed. If yes, start again with step 1).

- Clean any `StateDeltasFromS3` folder. Download all statedeltas from S3 bucket - `statedelta` to `StateDeltasFromS3`.

#### Joining node

- Node uses the `downloadIncrDB.py` to download the `peristence` from S3 bucket `incrementalDB` and all the state-deltas from S3 bucket `statedelta` to `StateDeltasFromS3`.
- Node startsup with downloaded `peristence` and starts syncup. After this, node has **base state** `say X`.
- Node then recreates latest state using state-deltas from `StateDeltasFromS3` (i.e.  `stateDelta_101.tar.gz, stateDelta_101.tar.gz, .... stateDelta_199.tar.gz, stateDelta_200.tar.gz, stateDelta_201.tar.gz, stateDelta_201.tar.gz, .... stateDelta_299.tar.gz` ).

  Final State `Y = X + x1 + x2  +  ... +  x99 + x100 + x101 + x102 + ...`