---
id: dev-txn-polling
title: Polling
language_tabs: # must be one of https://git.io/vQNgJ
  - javascript: node.js
  - go: go
  - java: java
---
If your transaction is successfully verified by the seed node, the transaction will be sent to the appropriate shard. Shard selection depends on a number of factors that are explained in detail in [this post](https://blog.zilliqa.com/provisioning-sharding-for-smart-contracts-a-design-for-zilliqa-cd8d012ee735).

After sending the transaction object, there will be a `transaction id`. We can invoke the `GetTransaction` JSON RPC API with the `transaction id` periodically to check the transaction status. It is recommended to poll the seed node with `GetTransaction` for __3 Tx Epochs__ (around 3-5 minutes). If the transaction is not confirmed after that, we can assume that it has not been included in any block and should be re-broadcated.

Example of polling transaction:
```javascript
const txn = await zilliqa.blockchain.getTransaction("1899b381d644a4892ca5ba5d8d60bbcc7bd121d511d55e438a8ddbdcc53272c4");
console.log(JSON.stringify(txn));
```

```go
provider := NewProvider("https://dev-api.zilliqa.com/")
result, _ := provider.GetTransaction("c7d6550a6558edcddbf4b3c7cf14db9f1025200b89bcbcd6a570c84db58d554f")
resStr,_ := json.Marshal(result)
fmt.Println(string(resStr))
```

```java
HttpProvider client = new HttpProvider("https://api.zilliqa.com/");
Transaction transaction = client.getTransaction("055294ba67b3073d66ef078fb149dfb0490b2d46156479a9f2c9327fb762f4e9").getResult();
System.out.println(new Gson().toJson(transaction))
```