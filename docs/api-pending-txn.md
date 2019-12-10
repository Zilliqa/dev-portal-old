---
id: api-pending-txn
title: Pending transaction API
---

This page describes the Lookup API used to query the pending transactions in the system.

At the end of every Tx epoch, lookup nodes receive information from the shards about pending (i.e., unconfirmed) transactions in their transaction pool. This information is accessible through the API at the lookup nodes, and is refreshed once the latest Tx block is available.

## Usage

These are the types of responses that are reported by the API.

1. `Nonce too high`: the transaction is pending because its nonce is larger than expected.
2. `Could not fit in as microblock gas limit reached`: the transaction is pending because it would cause the microblock to exceed the current gas limit.
3. `Transaction valid but consensus not reached`: the transaction is pending due to consensus failure within the network.
4. `Txn not pending`: the transaction being queried is not pending (i.e., it does not exist in the transaction pool).

## Limitation

This API relies on the contents of the transaction pool and can therefore only indicate whether a transaction is pending or not (for the reasons listed above). As such, it cannot be used to determine if a transaction was processed and intentionally dropped or rejected by the network.

## Example:

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

## Example using Zilliqa-JavaScript-Library

Our [Zilliqa-JavaScript-Library](https://github.com/Zilliqa/Zilliqa-JavaScript-Library) provides a way to query pending transaction

```js
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const {
  toBech32Address,
  getAddressFromPrivateKey,
} = require('@zilliqa-js/crypto');

const zilliqa = new Zilliqa('https://dev-api.zilliqa.com');

// These are set by the core protocol, and may vary per-chain.
// You can manually pack the bytes according to chain id and msg version.
// For more information: https://apidocs.zilliqa.com/?shell#getnetworkid

const chainId = 333; // chainId of the developer testnet
const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);

// Populate the wallet with an account
const privateKey =
  '3375F915F3F9AE35E6B301B7670F53AD1A5BE15D8221EC7FD5E503F21D3450C8';

zilliqa.wallet.addByPrivateKey(privateKey);

const address = getAddressFromPrivateKey(privateKey);
console.log(`My account address is: ${address}`);
console.log(`My account bech32 address is: ${toBech32Address(address)}`);

async function testBlockchain() {
  try {
    // Get Balance
    const balance = await zilliqa.blockchain.getBalance(address);
    // Get Minimum Gas Price from blockchain
    const minGasPrice = await zilliqa.blockchain.getMinimumGasPrice();

    // Account balance (See note 1)
    console.log(`Your account balance is:`);
    console.log(balance.result);
    console.log(`Current Minimum Gas Price: ${minGasPrice.result}`);
    const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions
    console.log(`My Gas Price ${myGasPrice.toString()}`);
    const isGasSufficient = myGasPrice.gte(new BN(minGasPrice.result)); // Checks if your gas price is less than the minimum gas price
    console.log(`Is the gas price sufficient? ${isGasSufficient}`);

    // Send a transaction to the network
    console.log('Sending a payment transaction to the network...');
    const tx = await zilliqa.blockchain.createTransactionWithoutConfirm(
      // Notice here we have a default function parameter named toDs which means the priority of the transaction.
      // If the value of toDs is false, then the transaction will be sent to a normal shard, otherwise, the transaction.
      // will be sent to ds shard. More info on design of sharding for smart contract can be found in.
      // https://blog.zilliqa.com/provisioning-sharding-for-smart-contracts-a-design-for-zilliqa-cd8d012ee735.
      // For payment transaction, it should always be false.
      zilliqa.transactions.new(
        {
          version: VERSION,
          toAddr: '0xA54E49719267E8312510D7b78598ceF16ff127CE',
          amount: new BN(units.toQa('1', units.Units.Zil)), // Sending an amount in Zil (1) and converting the amount to Qa
          gasPrice: myGasPrice, // Minimum gasPrice veries. Check the `GetMinimumGasPrice` on the blockchain
          gasLimit: Long.fromNumber(1),
        },
        false,
      ),
    );

    // check the pending status
    const pendingStatus = await zilliqa.blockchain.getPendingTxn(tx.id);
    console.log(`Pending status is: `);
    console.log(pendingStatus.result);

    // process confirm
    console.log(`The transaction id is:`, tx.id);
    const confirmedTxn = await tx.confirm(tx.id);

    console.log(`The transaction status is:`);
    console.log(confirmedTxn.receipt);

    // check the pending status after confirming
    const pendingStatusAfterConfirming = await zilliqa.blockchain.getPendingTxn(
      tx.id,
    );
    console.log(`Pending status is: `);
    console.log(pendingStatusAfterConfirming.result);
  } catch (err) {
    console.log(err);
  }
}

testBlockchain();
```
