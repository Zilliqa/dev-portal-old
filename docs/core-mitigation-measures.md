---
id: core-mitigation-measures
title: Mitigation Measures
---
## Transaction Backup

## Diagnostic Data

We store in LevelDB a limited amount of some operational data about the network that is intended for use when diagnosing any issues with the mainnet.

Globally, the amount of data stored is controlled by the constant `MAX_ENTRIES_FOR_DIAGNOSTIC_DATA`, which is usually set to either 25 or 50.

This is the current data stored for diagnostic purposes:

|LevelDB location           |Data stored                     |Storage timing     |Tool for data extraction|
|---------------------------|--------------------------------|-------------------|------------------------|
|persistence/diagnosticNodes|DS and shard peers              |Every vacuous epoch|getnetworkhistory       |
|persistence/diagnosticCoinb|Coinbase values and distribution|Every DS block     |getrewardhistory        |

To use the diagnostic tools:

1. Make sure there is a `persistence` subfolder in your current directory.
1. Make sure `persistence/diagnosticNodes` `persistence/diagnosticCoinb` contains the data you want to extract.
1. Run `getnetworkhistory <name of output CSV file>` or `getrewardhistory <name of output CSV file>`.
1. Output CSV file will appear in the current directory. Use Excel or LibreOffice Calc to open it.

## Internal API

This API server runs on port 4301 by default on a node locally (i.e., cannot be accessed from outside).

### Available Methods

- **`AddToBlacklistExclusion`**: Can be used to add an API to the blacklist exclusion list (or whitelist).
- **`RemoveFromBlacklistExclusion`**: Can be used to remove an API from the blacklist exclustion list.
- **`GetNodeState`**: Used to get the state of the node, e.g., POW, COMMIT_DONE etc.
- **`GetEpochFin`**: Tells the epoch number for the lookup for which the microblocks and txns have been received.
- **`GetDSCommittee`**: Returns the list of IPs and PubKeys of the current DS Committee.
- **`IsTxnInMemPool`**: Used to query local mempool of the nodes. Can tell, given a particular txnhash, if it is in mempool and why (e.g., nonce too high or gas price low).