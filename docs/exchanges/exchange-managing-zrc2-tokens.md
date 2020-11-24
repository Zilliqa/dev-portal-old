---
id: exchange-managing-zrc2-tokens
title: Managing Fungible Tokens (ZRC-2) tokens
keywords: 
- zrc2
- polling
- exchanges
- zilliqa
description: Managing Fungible Tokens (ZRC-2) tokens
---

---


## Introduction of ZRC-2

[ZRC-2](https://github.com/Zilliqa/ZRC/blob/master/zrcs/zrc-2.md) is the formal standard for Fungible Token in Zilliqa. It is an open standard for creating currencies on the Zilliqa blockchain.

With ZRC-2 standard, it allows for functionaility like 
- mint/burn tokens 
- transfer of tokens from one account to another
- Query account token balance
- Query total token balances
- approving third party to spent a certain amount of token 
- etc. 

## Example of ZRC-2 

- [XSGD](https://www.zilliqa.com/xsgd) - the first Singapore dollar-pegged stablecoin built by Xfers
- [gZIL](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-11.md#governance-tokens-aka-gzil) - Governance ZIL token earned through Zilliqa Seed Node Staking Program

## Checking whether a contract is ZRC-2 compliant 

Before you start any integration with ZRC-2, it is important to check the smart contract to ensure it conform to the ZRC-2 stndard. Non-conformance to the standards may lead to 
composability issue with other contracts or DApp/exchange integration.

You can check the [ZRC-2 specification](../dev/dev-keys-zrc2-wallet-support#zrc-2-specification) section over the Developers section of our developer portal.

## Contract Operations

You can check [Integrating with ZRC-2 Fungible Tokens Contract](../dev/dev-keys-zrc2-wallet-support#integrating-with-zrc-2-fungible-tokens-contract) on how to get token balance and transferring of tokens. 

## Tracking incoming ZRC-2 deposit

To track whether is there any new **incoming deposit** of a specific ZRC-2 token,
1. Poll the blockchain block by block using API [`GetTxnBodiesForTxBlock`](../apis/api-transaction-get-txbodies-for-txblock) API and process each transactions,
2. For each transaction in the TxBlock, perform the following:
- Check whether `toAddr` matches the corresponding ZRC-2 token contract address.  
eg. contract address [a845c1034cd077bd8d32be0447239c7e4be6cb21](https://viewblock.io/zilliqa/address/0xa845c1034cd077bd8d32be0447239c7e4be6cb21) for gZIL ZRC-2 token
- Check that the **success** field is set to `true`. If it is `failse`, it means that this transaction was not accepted by the network.
- Under `data`, look for `Transfer` or `TransferFrom` tag. Check the `value` to see whether it matches the base16 address format of your deposit address.
- If it matches, `value` represents the amount of tokens that are being transferred to from the sender to your deposit address.

:::note
When handling `value`, please note the number of decimal placing used by the smart contract.
:::


3. **[Optional checks]** You can also check `event_logs` and ensure the following
- `_eventname` matches `TransferSuccess` and `address` matches your deposit address
- under `params` map,
  - vname `sender` refers to the sender of the transactions
  - vname `recipient` refers your deposit address
  - vname `amount` is the amount of token transferred

Sample transaction receipt of a ZRC-2 token
```bash
{
  "id": "1",
  "jsonrpc": "2.0",
  "result": {
    "ID": "765efeb58c4e4fd314a861155173de85baed90df4fcd9b2a24c8693e611d1970", <-- Transaction hash
    "amount": "0", <-- This is in term of $ZIL and not ZRC-2 token
    "data": "{\"_tag\":\"Transfer\",\"params\":[{\"vname\":\"to\",\"type\":\"ByStr20\",\"value\":\"0xa795895a4cebe56068439858b6b1f4fe09af4c8c\"},{\"vname\":\"amount\",\"type\":\"Uint128\",\"value\":\"475772968079442\"}]}",
    "gasLimit": "3125",
    "gasPrice": "2000000000",
    "nonce": "71",
    "receipt": {
      "accepted": false,
      "cumulative_gas": "492",
      "epoch_num": "895498",
      "event_logs": [
        {
          "_eventname": "TransferSuccess",
          "address": "0xa845c1034cd077bd8d32be0447239c7e4be6cb21", <-- Contract address of ZRC-2 token
          "params": [
            {
              "type": "ByStr20",
              "value": "0x49355e4ec63634266e0b6c8fa3cbc02a76a6dd75",
              "vname": "sender"
            },
            {
              "type": "ByStr20",
              "value": "0xa795895a4cebe56068439858b6b1f4fe09af4c8c",
              "vname": "recipient"
            },
            {
              "type": "Uint128",
              "value": "475772968079442",
              "vname": "amount"
            }
          ]
        }
      ],
      "success": true, <-- Transaction is successful and confirmed on the blockchain
      "transitions": [
        {
          "addr": "0xa845c1034cd077bd8d32be0447239c7e4be6cb21",
          "depth": 0,
          "msg": {
            "_amount": "0",
            "_recipient": "0xa795895a4cebe56068439858b6b1f4fe09af4c8c",
            "_tag": "RecipientAcceptTransfer",
            "params": [
              {
                "type": "ByStr20",
                "value": "0x49355e4ec63634266e0b6c8fa3cbc02a76a6dd75",
                "vname": "sender"
              },
              {
                "type": "ByStr20",
                "value": "0xa795895a4cebe56068439858b6b1f4fe09af4c8c",
                "vname": "recipient"
              },
              {
                "type": "Uint128",
                "value": "475772968079442",
                "vname": "amount"
              }
            ]
          }
        },
        {
          "addr": "0xa845c1034cd077bd8d32be0447239c7e4be6cb21",
          "depth": 0,
          "msg": {
            "_amount": "0",
            "_recipient": "0x49355e4ec63634266e0b6c8fa3cbc02a76a6dd75",
            "_tag": "TransferSuccessCallBack",
            "params": [
              {
                "type": "ByStr20",
                "value": "0x49355e4ec63634266e0b6c8fa3cbc02a76a6dd75",
                "vname": "sender"
              },
              {
                "type": "ByStr20",
                "value": "0xa795895a4cebe56068439858b6b1f4fe09af4c8c",
                "vname": "recipient"
              },
              {
                "type": "Uint128",
                "value": "475772968079442",
                "vname": "amount"
              }
            ]
          }
        }
      ]
    },
    "senderPubKey": "0x03A4738532329F5867A448B32B16DF65AEC51C09CCAE8C972D78E49E9EFC84EF89",
    "signature": "0x73E84B5FB5AE7D46F941E5BC393253EA19EAE8CD2C5FD07A64D553970EFF8FBDB79384730C10310055E79CA560DC9B79A77ED64E5ADC69260EE32185D3AAF20B",
    "toAddr": "a845c1034cd077bd8d32be0447239c7e4be6cb21",  <-- Contract address of ZRC-2 token
    "version": "65537"
  }
}
```

## Other References
- [Sample codes for various ZRC-2 operations](https://github.com/Zilliqa/ZRC/tree/master/example/zrc2)
