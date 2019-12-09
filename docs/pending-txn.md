---
id: pending-txn-api
title: Pending transaction API
--- 

# Pending Txn API

## Introduction

The shard nodes, at the end of every epoch send the lookup nodes infomration about transactions pending in their pool.

Three types of pending txns would be reported

1. Nonce too high : if in a shard’s mempool a txn is pending which has a nonce greater than the current nonce of the account.
2. Gas Limit Exceeded : if the txn in the mempool wasnt able to fit in the current MB due to limit being exceeded, it would show this error
3. Correct but consensus failure : for some reason if MB was not made and the txn still resides in the mempool, this would be reported.
4. Shard nodes send a packet to the lookup nodes, This contains the txn hash and a code which tells why the txn is pending.
5. WHAT THE API DOES NOT DO : It would not tell if a txn is dropped.

Example:

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