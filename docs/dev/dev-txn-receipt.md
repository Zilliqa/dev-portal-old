---
id: dev-txn-receipt
title: Receipt
keywords:
  - receipt
  - transitions
  - events
  - params
  - transaction
  - zilliqa
description: Zilliqa Transaction Receipt
---

---

After a transaction is confirmed in the blockchain, a transaction response would be returned along with a `receipt`.

Example of a transaction response with the `receipt` structure:

```
{
  "id": "1",
  "jsonrpc": "2.0",
  "result": {
      // others

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

This section lists all the _possible_ `receipt` returned values.

| Name             | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| `cumulative_gas` | The total amount of gas used when it is executed in the particular block   |
| `epoch_num`      | The block number when this transaction is allocated to                     |
| `errors`         | Contains the error code if the transaction has any errors                  |
| `event_logs`     | Contains the parameters of the contract transition being invoked           |
| `exceptions`     | Returns the exception messages if there is an error when invoking contract |
| `transitions`    | Contains the parameters used to call the specific transition               |
| `success`        | Returns true if the transaction is successfully executed, false otherwise  |

## Events

`event_logs` are events created as a result of invoking the contract calls.

For instance, in the following sample contract code, calling `setHello` transition would trigger a "`setHello`" event name.

```
(* HelloWorld Sample *)

transition setHello (msg : String)
  is_owner = builtin eq owner _sender;
  match is_owner with
  | False =>
    e = {_eventname : "setHello()"; code : not_owner_code};
    event e
  | True =>
    welcome_msg := msg;
    e = {_eventname : "setHello()"; code : set_hello_code}; (* trigger event here *)
    event e
  end
end
```

If we execute this transition, the returned `receipt` is as follows:

```
{
    "id": "1",
    "jsonrpc": "2.0",
    "result": {
        // others
        "receipt": {
            "accepted": false,
            "cumulative_gas": "668",
            "epoch_num": "1474081",
            "event_logs": [
                {
                    "_eventname": "setHello()",
                    "address": "0xde8d3637aec06d6c7da49aeb9c7409ac44a98138",
                    "params": [
                        {
                            "type": "Int32",
                            "value": "2",
                            "vname": "code"
                        }
                    ]
                }
            ],
            "success": true
        },
    }
}
```

Observed that the `setHello` event is returned as the `setHello` transition is successfully executed by the blockchain.

## Transitions

A `transitions` object is returned if the contract is invoking other procedures or another contract transition. A `transition` object provides details of the "transition chain" such as the address of the initiator, the tag (transition name), the recipient, the params .etc.

Example of a `transition` object:

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
    ...
  }
}
```

In the above example, from the `data` object we can observe the `sendFunds` transition is invoked here, presumably to send `50000000000000` to `0xc0e28525e9d329156e16603b9c1b6e4a9c7ed813`. Notice that in the `transitions` object, the `onFundsReceived` procedure is subsequently invoked internally, and we can observe the recipient and amount is indeed the transmitted amount.

## Exception

A `exceptions` object is returned if the contract specifically raise an error when it encounters issues invoking the transition, for example, invoking a transfer transition without sufficient balance .etc. A `exceptions` object contains the `line` number of the contract that raised the error and the corresponding exception `message`.

Example of an `exceptions` object:

```
"receipt": {
    ... // others
    ...
    "exceptions": [
        {
            "line": 87,
            "message": "Exception thrown: (Message [(_exception : (String \"Error\")) ; (code : (Int32 -2))])"
        },
        {
            "line": 100,
            "message": "Raised from IsAdmin"
        },
        {
            "line": 137,
            "message": "Raised from ConfigureUsers"
        }
    ]
}
```
