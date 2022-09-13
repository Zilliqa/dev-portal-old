---
id: core-incremental-db
title: Incremental DB
keywords:
  - core
  - incremental
  - database
description: Core protocol design - incremental DB.
---

---

The incremental DB feature leverages on AWS Simple Storage Service (S3) to provide an efficient way for miners and seed nodes to get blockchain data in order to join the network.

## Background

Prior to this feature, the basic design involved uploading or syncing entire persistence to an AWS S3 bucket at each and every Tx epoch. New nodes would then fetch the entire persistence from that bucket.

This would have been alright for all existing LevelDB databases, with the exception of the `state` database. This is because running `aws-cli sync` on `state` results in uploading all files in the database, which is time-consuming and not bandwidth efficient.

Uploading of `state` LevelDB for every Tx epoch is thus a bottleneck, and so incremental DB was introduced as the solution.

:::note
It is practically possible that all files in `stateDB` get updated at every Tx epoch, if transactions in that particular epoch changed the states of addresses that somehow update TrieDB across all the files in `state` LevelDB.
:::

## Implementation

Two scripts make up the building blocks for incremental DB.

### Upload Incremental DB Script

The script `uploadIncrDB.py` runs on a lookup node managed by Zilliqa Research. It performs the following steps:

1. Add `Lock` file to S3 bucket **incremental**
1. Perform sync between local `persistence` folder (i.e., within this lookup node) and `incremental\persistence` on AWS S3 every Tx epoch. More specifically, syncing is done according to different criteria based on the Tx epoch number. These are the possibilities:

- At script startup
  1. Clear both buckets, i.e., **incremental** and **statedelta**
  1. Sync entire `persistence` (i.e., everything that exists in the folder, including `state`, `stateroot`, `txBlocks`, `txnBodies`, `txnBodiesTmp`, `microblock`, etc) to bucket **incremental**
  1. Clear all state deltas from bucket **statedelta**
- At every `(INCRDB_DSNUMS_WITH_STATEDELTAS * NUM_FINAL_BLOCK_PER_POW) == 0` DS epoch (where INCRDB_DSNUMS_WITH_STATEDELTAS and NUM_FINAL_BLOCK_PER_POW are the constants from `constants.xml` file)
  1. Sync entire `persistence` to bucket **incremental**
  1. Clear all state deltas from bucket **statedelta**
- At all other Tx epochs
  1. Sync entire `persistence` (excluding `state`, `stateroot`, `contractCode`, `contractStateData`, `contractStateIndex`) to bucket **incremental**
  1. For the first Tx block within the DS epoch (e.g., 100, 200, 300, ...), we don't need to upload state delta differences. Instead, the complete `stateDelta` LevelDB (composed as a tarball, e.g., `stateDelta_100.tar.gz`) is uploaded to S3 bucket **statedelta**
  1. For other Tx blocks, we upload the state delta differences (composed as tarballs, e.g., `stateDelta_101.tar.gz`, `stateDelta_102.tar.gz`, .... `stateDelta_199.tar.gz`) to S3 bucket **statedelta**

1. Remove `Lock` file from S3 bucket **incremental**

### Download Incremental DB Script

The script `downloadIncrDB.py` is executed upon startup by every miner or seed node to get the latest block chain data. It performs the following steps:

1. Check if `Lock` file exists. Wait until no `Lock` file is found
1. Clear existing local `persistence` folder, then download entire persistence data (except `microblocks` and `txBodies` for miner nodes) from S3 bucket **incremental**
1. Check if `Lock` file has appeared after executing the previous step. If yes, return to the first step
1. Clear existing local `StateDeltasFromS3` folder, then download all state deltas from S3 bucket **statedelta** to `StateDeltasFromS3` folder

## Incremental DB Usage by a Joining Node

1. Node uses the `downloadIncrDB.py` script to populate its `persistence` folder from S3 bucket **incrementalDB**
1. Node uses the same script to populate its `StateDeltasFromS3` folder with all the state deltas from S3 bucket **statedelta**
1. Node loads the contents of `persistence` and initiates syncup. At this point, node has a base state of, say, `X`
1. Node then recreates the latest state using the state deltas in `StateDeltasFromS3` (e.g. `stateDelta_101.tar.gz`, `stateDelta_101.tar.gz`, ...., `stateDelta_199.tar.gz`, `stateDelta_200.tar.gz`, `stateDelta_201.tar.gz`, ....)
1. Using these files, the final state `Y` is computed as `Y = X + x1 + x2 + ... + x99 + x100 + x101 + x102 + ...`

More information on new node joining can be found in the [Rejoin Mechanism](core-rejoin-mechanism.md) page.
