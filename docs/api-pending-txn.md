---
id: pending-transaction-api
title: Pending transaction API
--- 

This page describes the Lookup API used to query the pending transactions in the system.

At the end of every Tx epoch, lookup nodes receive information from the shards about pending (i.e., unconfirmed) transactions in their transaction pool. This information is accessible through the API at the lookup nodes, and is refreshed once the latest Tx block is available.

## Usage

Three types of pending transactions would be reported

1. Nonce too high : if in a shard’s mempool a transaction is pending which has a nonce greater than the current nonce of the account.
2. Could not fit in as microblock gas limit reached : if the transaction in the mempool wasn't able to fit in the current microblock due to current gas limit being exceeded.
3. Transaction valid but consensus not reached : Due to consensus failure at shard or DS level, this transaction is pending.
4. Not Present : The transaction hash being quried is not pending.

## Limitation

The API would only tell if a transaction is pending or not. It cannot tell if it is dropped.

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