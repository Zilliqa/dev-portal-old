---
id: dev-tools-zilliqajs
title: zilliqa-js
keywords:
  - zilliqajs
  - zilliqa-js
  - js
  - installation
  - apis
  - examples
  - zrc2 wallet
  - hello world
  - zilliqa
description: Zilliqa Websockets
---

---

## Introduction

[zilliqa-js](https://github.com/Zilliqa/zilliqa-js) is a Javascript library that allows you to interact with the Zilliqa network nodes - create wallets, deploy contracts, and invoke transitions to interact with smart contracts.

## Source Code

The Github repository can be found at [https://github.com/Zilliqa/zilliqa-js](https://github.com/Zilliqa/zilliqa-js)

## Releases

All releases of zilliqa-js can be found at [https://www.npmjs.com/package/@zilliqa-js/zilliqa](https://www.npmjs.com/package/@zilliqa-js/zilliqa)

Release note can be found at [https://github.com/Zilliqa/zilliqa-js/releases](https://github.com/Zilliqa/zilliqa-js/releases)

## Installation

It is recommended that developers install the JavaScript client by making use
of the umbrella package `@zilliqa-js/zilliqa`. This takes care of bootstrapping the various modules, which are then accessible as members of the
`Zilliqa` class.

```shell
yarn add @zilliqa-js/zilliqa
# you may also need to install the tslib package.
yarn add tslib
# bn.js should be added with the above package. if it is not, install it manually.
yarn add bn.js
```

## Methods and APIs

The following table provides a description of each module of zilliqa-js and what you may want to use it for. Visit the relevant link of each module to find the detailed description about the methods and apis supported by that module.

| package                                                                                                                   | description                                                                                                                                                               | dependencies                                                                            |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`@zilliqa-js/core`](https://github.com/Zilliqa/zilliqa-js/tree/dev/packages/zilliqa-js-core)             | Core abstractions and base classes, such as `HTTPProvider` and network logic for interfacing with the Zilliqa JSON-RPC.                                                   | none                                                                                    |
| [`@zilliqa-js/account`](https://github.com/Zilliqa/zilliqa-js/tree/dev/packages/zilliqa-js-account)       | `Wallet`, `Account` and `Transaction` abstractions live in this package.                                                                                                  | `@zilliqa-js/core`, `@zilliqa-js/crypto`, `@zilliqa-js/util`, `@zilliqa-js/proto`       |
| [`@zilliqa-js/blockchain`](https://github.com/Zilliqa/zilliqa-js/tree/dev/packages/zilliqa-js-blockchain) | Main interface to the Zilliqa `JSON-RPC`.                                                                                                                                 | none                                                                                    |
| [`@zilliqa-js/contract`](https://github.com/Zilliqa/zilliqa-js/tree/dev/packages/zilliqa-js-contract)     | Exposes a `Contracts` module that takes care of smart contract deployment and interaction.                                                                                | `@zilliqa-js/account`, `@zilliqa-js/blockchain`, `@zilliqa-js/core`, `@zilliqa-js/util` |
| [`@zilliqa-js/crypto`](https://github.com/Zilliqa/zilliqa-js/tree/dev/packages/zilliqa-js-crypto)         | Exposes several loosely-coupled cryptographic convenience functions for working with the Zilliqa blockchain and its cryptographic primitives, such as Schnorr signatures. | `@zilliqa-js/util`                                                                      |
| [`@zilliqa-js/proto`](https://github.com/Zilliqa/zilliqa-js/tree/dev/packages/zilliqa-js-proto)           | Protobuf source files and corresponding generated JS modules.                                                                                                             | none                                                                                    |
| [`@zilliqa-js/util`](https://github.com/Zilliqa/zilliqa-js/tree/dev/packages/zilliqa-js-util)             | Miscellaneous functions that take care of serialisation/deserialisation and validation.                                                                                   | none                                                                                    |
| [`@zilliqa-js/viewblock`](https://github.com/Ashlar/zilliqa-js-viewblock)                                                 | Library interfacing with ViewBlock's APIs                                                                                                                                 | `@zilliqa-js/crypto`                                                                    |

## Demo - ZRC-2 Wallet

For this demo, we'll be looking at the zilliqa-js related code of a simple ZRC-2 wallet, [ZRC-2](https://github.com/Zilliqa/ZRC/blob/master/zrcs/zrc-2.md) is a standard for fungible tokens on Zilliqa.
The full code can be found at [ZRC-2 Wallet Repository](https://github.com/arnavvohra/dev-portal-examples/tree/master/zrc-2-wallet). This repository is written in React but the zilliqa-js methods & APIs can be used with any javascript framework.

#### Generating Private Key and Address from Encrypted Wallet and a Passphrase

```javascript
import {
  decryptPrivateKey,
  getAddressFromPrivateKey,
} from '@zilliqa-js/crypto';
let keystore = JSON.parse(this.state.encryptedWallet);
const pk = await decryptPrivateKey(this.state.passphrase, keystore);
const address = getAddressFromPrivateKey(pk);
```

#### Getting User's $ZIL Balance

```javascript
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
let balanceState = await zilliqa.blockchain.getBalance(userAddress);
if (balanceState) {
  let balance = balanceState.result.balance;
  balance = units.fromQa(new BN(balance), units.Units.Zil); // user's $zil balance
}
```

#### Getting User's Token Balance

```javascript
let userAddress = localStorage.getItem('userAddress'); //userAddress is retrieved from localStorage in this example
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

let smartContractState = await zilliqa.blockchain.getSmartContractState(
  tokenContractAddress
);
if (smartContractState) {
  let balances_map = smartContractState.result.balances_map;
  userAddress = userAddress.toLowerCase();
  let userTokenBalance = balances_map[userAddress]; //user's token balance
}
```

#### Sending Tokens to Another Address by Calling 'Transfer' Transition of the ZRC-2 Contract

```javascript
sendTransaction = async () => {
  const { Zilliqa } = require('@zilliqa-js/zilliqa');
  const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
  const { BN, Long, bytes, units } = require('@zilliqa-js/util');
  const { toBech32Address, fromBech32Address } = require('@zilliqa-js/crypto');

  //You can set the value of the following variables according to your liking
  let contractAddress = localStorage.getItem('token_contract_address');
  let recipientAddress = this.state.sendingAddress;
  let sendingAmount = this.state.sendingAmount;
  let privkey = localStorage.getItem('private_key');

  zilliqa.wallet.addByPrivateKey(privkey);

  const CHAIN_ID = 333;
  const MSG_VERSION = 1;
  const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);

  const myGasPrice = units.toQa('2000', units.Units.Li); // Gas Price that will be used by all transactions
  contractAddress = contractAddress.substring(2);
  recipientAddress = fromBech32Address(recipientAddress); //converting to ByStr20 format
  const ftAddr = toBech32Address(contractAddress);
  try {
    const contract = zilliqa.contracts.at(ftAddr);
    const callTx = await contract.call(
      'Transfer',
      [
        {
          vname: 'to',
          type: 'ByStr20',
          value: recipientAddress,
        },
        {
          vname: 'amount',
          type: 'Uint128',
          value: sendingAmount,
        },
      ],
      {
        // amount, gasPrice and gasLimit must be explicitly provided
        version: VERSION,
        amount: new BN(0),
        gasPrice: myGasPrice,
        gasLimit: Long.fromNumber(10000),
      }
    );
  } catch (err) {
    console.log(err);
  }
};
```
