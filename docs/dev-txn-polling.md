---
id: dev-txn-polling
title: Polling
---
If your transaction is successfully verified by the seed node, the transaction will be sent to the appropriate shard. Shard selection depends on a number of factors that are explained in detail in [this post](https://blog.zilliqa.com/provisioning-sharding-for-smart-contracts-a-design-for-zilliqa-cd8d012ee735).

After sending the transaction object, there will be a `transaction id`. We can invoke the `GetTransaction` JSON RPC API with the `transaction id` periodically to check the transaction status. It is recommended to poll the seed node with `GetTransaction` for __3 Tx Epochs__ (around 3-5 minutes). If the transaction is not confirmed after that, we can assume that it has not been included in any block and should be re-broadcated.

Example of polling transaction (ZilliqaJS):
```
const txn = await zilliqa.blockchain.getTransaction("1899b381d644a4892ca5ba5d8d60bbcc7bd121d511d55e438a8ddbdcc53272c4");
console.log(JSON.stringify(txn));
```