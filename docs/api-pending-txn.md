---
id: pending-transaction-api
title: Pending transaction API
--- 

This page describes the Lookup API used to query the pending transactions in the system.

At the end of every Tx epoch, lookup nodes receive information from the shards about pending (i.e., unconfirmed) transactions in their transaction pool. This information is accessible through the API at the lookup nodes, and is refreshed once the latest Tx block is available.

## Usage

These are the types of responses that are reported by the API.

1. `Nonce too high`: the transaction is pending because its nonce is larger than expected.
2. Could not fit in as microblock gas limit reached : if the transaction in the mempool wasn't able to fit in the current microblock due to current gas limit being exceeded.
3. `Transaction valid but consensus not reached`: the transaction is pending due to consensus failure within the network.
4. `Txn not pending`: the transaction being queried is not pending (i.e., it does not exist in the transaction pool).

## Limitation

This API relies on the contents of the transaction pool and can therefore only indicate whether a transaction is pending or not (for the reasons listed above). As such, it cannot be used to determine if a transaction was processed and intentionally dropped or rejected by the network.

## Example:

```shell
curl -d '{
    "id": "1",
    "jsonrpc": "2.0",
    "method": "GetPendingTxn",
    "params": ["b9e545ab3ed0b61a4d326425569605255e0990da7dda18b4658fdb17b390844e"]
}' -H "Content-Type: application/json" -X POST "https://api.zilliqa.com/"
```

```json
{
    "id": "1",
    "jsonrpc": "2.0",
    "result": {
        "code": 0,
        "confirmed": false,
        "info": "Txn not pending"
    }
}
```
