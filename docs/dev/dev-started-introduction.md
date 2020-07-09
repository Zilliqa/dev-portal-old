---
id: dev-started-introduction
title: Introduction
---

## Getting started with dApp development

This section aims to give developers an idea on how to get started with development on Zilliqa.

We try to make this guide concise, but yet easy enough for a developer with no experience in blockchain development. As many applications developers are `javascript` developers, we will use `javascript` in code snippet examples. Zilliqa Research currently actively maintains an official SDK in Javascript [`zilliqa-js`](https://github.com/Zilliqa/Zilliqa-JavaScript-Library) which we'll be using in our examples.

### What are dApps?

Decentralised Apps ("dApps") are applications that interact with smart contracts on the blockchain. As Zilliqa blockchain is a decentralised network that is not hosted by a single entity, application that sits on the blockchain is _decentralised_.

An application can have a user-facing components ("client"), which could be a web application or mobile app. These applications can interact with smart contracts on the Zilliqa blockchain.

![Overview](../../assets/dapps-overview.png)

The entry to Zilliqa blockchain lies on the RPC interface. SDKs are not compulsory for you to interact with the blockchain, but they do make your life easier.

Saw the `0x1`, `0x2` on the entities on the blockchain? Those are [addresses](#addresses). 

Addresses are an identifier to an entity on the blockchain. An entity on the blockchain can be either a user or a contract. 

### Addresses

Zilliqa currently supports two address formats.

* `ByStr20`: 20 byte hexadecimal string (e.g. `0x573EC96638C8bB1c386394602E1460634F02aDdA`)
* `bech32`: A [bech32](https://github.com/Zilliqa/ZIP/blob/master/zips/zip-1.md) with a human-readable prefix of `zil` (e.g. `zil12ulvje3ceza3cwrrj3szu9rqvd8s9tw69c978p`)

The reason behind this design is to prevent confusion with Ethereum addresses. For more detailed explanation on the address, refer to [this post](https://blog.zilliqa.com/zilliqa-migrates-to-new-address-format-bf1fa6d7e41d)

```javascript
const { toBech32Address, toChecksumAddress } = require("@zilliqa-js/crypto");

// not checksummed address (will not be accepted by blockchain)
const address = '573EC96638C8BB1C386394602E1460634F02ADDA';

// checksummed ByStr20
const checksummedAddresses = toChecksumAddress(address);
// returns '0x573EC96638C8bB1c386394602E1460634F02aDdA'

const bech32_address = toBech32Address(address);
// returns zil12ulvje3ceza3cwrrj3szu9rqvd8s9tw69c978p
```

We __strongly recommend__ that developers use `bech32` formatted addresses for token transfers. This prevents users from mistaking Zilliqa addresses from Ethereum addresses. All wallets and exchanges that deal with token transfers currently use the `bech32` standard for security purposes.

`ByStr20` checksummed addresses are supported by [RPC](https://api-docs.zilliqa.com), SDKs and `scilla` contracts.

How do you know if an address is a smart contract or an account? One way to go about it is to send a [`GetSmartContractInit`](https://apidocs.zilliqa.com/#getsmartcontractcode) POST request to check.

In Javascript, you can do the following:

```javascript
const isContract = async (address) =>{
  const init = await zilliqa.blockchain.getSmartContractInit(address);
  const result = init.result ? true : false;
  return result;
}
```

Example code: [validate-contract.js](https://github.com/Zilliqa/dev-portal/tree/master/examples/dapp/validate-address.js)
