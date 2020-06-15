---
id: dev-txn-receipt
title: Receipt
---
After a transaction is confirmed in the blockchain, a transaction response would be returned along with a `receipt`.

Example of a transaction response with the `receipt` structure:
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
Depending on the type of transaction (e.g. payment, contract call, chain contract call) being processed, the `receipt` may return different data.

## Params
This section lists all the _possible_  `receipt` returned values.

| Name             | Description                                                                |
| ---------------- | ---------------------------------------------------------------------------|
| `cumulative_gas` | The total amount of gas used when it is executed in the particular block   |
| `epoch_num`      | The block number when this transaction is allocated to                     |
| `errors`         | Contains the error code if the transaction has any errors                  |
| `event_logs`     | Contains the parameters of the contract transition being invoked           |
| `exceptions`     | Returns the exception messages if there is an error when invoking contract |  
| `transitions`    | Contains the parameters used to called the specific transition             |
| `success`        | Returns true if the transaction is successfully executed, false otherwise  |

## Events

## Transitions
## Exception

