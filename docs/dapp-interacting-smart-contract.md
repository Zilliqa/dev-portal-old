---
id: dapp-interacting-smart-contract
title: Interacting with your Smart Contract
---

## Query Data

Think of blockchain as a global, distributed database. On the blockchain, there are many smart contracts, and each smart contract has it's own little "database".

These "databases" are further divided into _immutable_ and _mutable_ data:

* _Immutable_ data are parameters that you initiate during contract deployment, and you cannot change them once they are deployed. We usually refer to these as initialising parameters, `init`
* _Mutable_ data are data fields that you can manipulate on the contracts. For example, if you are deploying a token contract which keeps a ledger of who owns how many tokens, the balance is a mutable field since users can transfer tokens to one another. We usually call mutable data, `state`.

In the subsequent chapters, we will illustrate how to query the blockchain. You can follow the step-by-step tutorial written in Javascript with the `zilliqa-js` SDK, or jump straight to use the [JSON-RPC requests](#RPC-Methods) directly.

On the devnet, we have deployed a sample fungible-token contract (_ala ERC20_) contract to illustrate how you can query the blockchain. The contract is deployed at [zil1tyu0ezhcyfg26m83mgamjt625qzukfcht8es69](https://viewblock.io/zilliqa/address/zil1tyu0ezhcyfg26m83mgamjt625qzukfcht8es69?network=testnet&tab=code)

### Fetching Immutable Data

To retrieve the immutable data from the contract, we can do the following in Javascript:

```javascript
const getInit = async (address) => {
  // getSmartContractInit currently only supports ByStr20 addresses without 0x prefix
  const init = await zilliqa.blockchain.getSmartContractInit(
    fromBech32Address(address)
    .replace("0x","")
   );

   if(init.error || !init.result) {
    console.log(`Error: Address ${address} is not a contract address`);
    throw new Error('Error: Failed to get Init');
  }
   return init.result;
 }
```

Immutable data cannot be changed once it is deployed:

```json
[
  {
    "type": "Uint32",
    "value": "0",
    "vname": "_scilla_version"
  },
  {
    "type": "ByStr20",
    "value": "0xe26d0b90d695188599558d1c3af41f34bcec6220",
    "vname": "owner"
  },
  {
    "type": "Uint128",
    "value": "1000000",
    "vname": "total_tokens"
  },
  {
    "type": "Uint32",
    "value": "12",
    "vname": "decimals"
  },
  {
    "type": "String",
    "value": "AliceCoin",
    "vname": "name"
  },
  {
    "type": "String",
    "value": "ALI",
    "vname": "symbol"
  },
  {
    "type": "BNum",
    "value": "387125",
    "vname": "_creation_block"
  },
  {
    "type": "ByStr20",
    "value": "0x5938fc8af82250ad6cf1da3bb92f4aa005cb2717",
    "vname": "_this_address"
  }
]
```

All the data fields objects on scilla has three parameters: `vname`, `type` and `value`. `vname` is the name of the variable. Variables with leading underscores are system-variables that are added by the blockchain.

All smart contracts will have three system-defined immutable variables:

* `_scilla_version`: The __major__ version of smart contract that the miners will interpret the smart contract on
* `_this_address`: The `ByStr20` address that the smart contract is located on the blockchain
* `_creation_block`: The TX-Block that the contract is deployed on the blockchain. Blockchain does not have timestamp, so `_creation_block` represents the time of deployment.

### Fetching Mutable Data

You can fetch the mutable data through the `blockchain` package without `zilliqa-js`. The `getSmartContractState` currently takes in a `ByStr20` address (without 0x prefix) and sends it to the RPC server.

```javascript
  const address = "zil1tyu0ezhcyfg26m83mgamjt625qzukfcht8es69";

  // getSmartContractState currently only supports ByStr20 addresses without 0x prefix
 const state = await zilliqa.blockchain.getSmartContractState(
    fromBech32Address(address).replace(
      "0x",
      ""
    )
  );
```

The response should be:

```json
[
  {
    "type": "Map (ByStr20) (Uint128)",
    "value": [
      {
        "key": "0x381f4008505e940ad7681ec3468a719060caf796",
        "val": "8000"
      },
      {
        "key": "0xd90f2e538ce0df89c8273cad3b63ec44a3c4ed82",
        "val": "5000"
      },
      {
        "key": "0xe26d0b90d695188599558d1c3af41f34bcec6220",
        "val": "967500"
      },
      {
        "key": "0xb028055ea3bc78d759d10663da40d171dec992aa",
        "val": "9500"
      },
      {
        "key": "0xf6dad9e193fa2959a849b81caf9cb6ecde466771",
        "val": "10000"
      }
    ],
    "vname": "balances"
  },
  {
    "type": "Map (ByStr20) (Map (ByStr20) (Uint128))",
    "value": [],
    "vname": "allowed"
  },
  {
    "type": "Uint128",
    "value": "0",
    "vname": "_balance"
  }
]
```

The response above shows all the data state that is currently maintained by the smart contract.

If you are only interested in one field, you can do:

```javascript
  const balances = Array.from(state)
                   .filter((item) => item.vname === 'balances');
```

And there, you will have your balance objects:

```json
[
    {
        "key": "0x381f4008505e940ad7681ec3468a719060caf796",
        "val": "8000"
    },
    {
        "key": "0xd90f2e538ce0df89c8273cad3b63ec44a3c4ed82",
        "val": "5000"
    },
    {
        "key": "0xe26d0b90d695188599558d1c3af41f34bcec6220",
        "val": "967500"
    },
    {
        "key": "0xb028055ea3bc78d759d10663da40d171dec992aa",
        "val": "9500"
    },
    {
        "key": "0xf6dad9e193fa2959a849b81caf9cb6ecde466771",
        "val": "10000"
    }
]
```

You can download the full script [here](https://github.com/Zilliqa/dev-portal/tree/master/examples/dapp/query-data.js).

### RPC-Methods

You can use the following JSON-RPC methods to interact with the smart contracts directly without using an SDK:

* [GetSmartContractInit](https://apidocs.zilliqa.com/#getsmartcontractinit)
* [GetSmartContractState](https://apidocs.zilliqa.com/#getsmartcontractstate)

Note: The raw RPC transaction currently receives addresses as ByStr20 strings without the `0x` prefix.
