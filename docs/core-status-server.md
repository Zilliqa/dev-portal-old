---
id: core-status-server
title: Status Server
---
This API server runs on port 4301 by default on a node locally (i.e., cannot be accessed from outside).

### Available Methods

- **`AddToBlacklistExclusion`**: Can be used to add an API to the blacklist exclusion list (or whitelist).
- **`RemoveFromBlacklistExclusion`**: Can be used to remove an API from the blacklist exclustion list.
- **`GetNodeState`**: Used to get the state of the node, e.g., POW, COMMIT_DONE etc.
- **`GetEpochFin`**: Tells the epoch number for the lookup for which the microblocks and txns have been received.
- **`GetDSCommittee`**: Returns the list of IPs and PubKeys of the current DS Committee.
- **`IsTxnInMemPool`**: Used to query local mempool of the nodes. Can tell, given a particular txnhash, if it is in mempool and why (e.g., nonce too high or gas price low).