---
id: dev-txn-confirmation
title: Confirmation
---
Now the transaction object is in one of the shard. Each shard will produce a __Micro Block__. Micro Blocks are aggregated by the DS Committee into a Transaction Block, after the DS Committee agrees on the Transaction Block through the pBFT consensus mechanism.

After the DS Committee reaches consensus on the Transaction Block, it multicases the result to all shard nodes and lookup nodes. At this stage, the seed node will have a result for our transaction object. The result can be retrieved using the same `GetTransaction` JSON RPC API.

Example of getting transaction (ZilliqaJS):
```
const txn = await zilliqa.blockchain.getTransaction("cd8727674bc05e0ede405597a218164e1c13c7103b9d0ba43586785f3d8cede5");
console.log(txn.result);
```

Example of a contract call transaction response:
```
{
  "id": "1",
  "jsonrpc": "2.0",
  "result": {
    "ID": "52605cee6955b3d14f5478927a90977b305325aff4ae0a2f9dbde758e7b92ad4",
    "amount": "50000000000000",
    "data": "{\"_tag\":\"sendFunds\",\"params\":[{\"vname\":\"accountValues\",\"type\":\"List (AccountValue)\",\"value\":[{\"constructor\":\"AccountValue\",\"argtypes\":[],\"arguments\":[\"0xc0e28525e9d329156e16603b9c1b6e4a9c7ed813\",\"50000000000000\"]}]}]}",
    "gasLimit": "25000",
    "gasPrice": "1000000000",
    "nonce": "3816",
    "receipt": {
      "accepted": true,
      "cumulative_gas": "878",
      "epoch_num": "589742",
      "success": true,
      "transitions": [
        {
          "addr": "0x9a65df55b2668a0f9f5f749267cb351a37e1f3d9",
          "depth": 0,
          "msg": {
            "_amount": "50000000000000",
            "_recipient": "0xc0e28525e9d329156e16603b9c1b6e4a9c7ed813",
            "_tag": "onFundsReceived",
            "params": []
          }
        }
      ]
    },
    "senderPubKey": "0x03DE40DF885B0E334D53FF5E5554589AAF46F2339FEBEE93213F2CCE52D1F488F4",
    "signature": "0xB19AB66C4410EE4833A9C5DEE600471DB4D711F6B61D2312988E6E70CC655409F18BB42BB6940B6263C8EA5CE08CAEC06111BDF19BE00D7E15F25515CAA45DAA",
    "toAddr": "9a65df55b2668a0f9f5f749267cb351a37e1f3d9",
    "version": "65537"
  }
}
```
A transaction is confirmed if under the `receipt` section, `"success": true` is shown.