---
id: exchange-sending-transactions
title: Sending Transactions
keywords:
  - constructing transaction object
  - signing transaction
  - sending transaction
  - zilliqa
description: Sending Zilliqa Transactions For Exchanges
---

---

A critical feature of any exchange is the ability to withdraw the funds held
in custody to an arbitrary address of the user's choosing. Because Zilliqa
nodes do not provide an API for signing transactions on your behalf, you will
have to do so locally using an SDK of your choosing. We provide examples using
zilliqa-js, the official JavaScript SDK.

## Constructing the Transaction Object

There are several ways to construct a `Transaction` instance. We recommend
using the transaction factory that is on the umbrella Zilliqa object, like
so:

```js
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { getPubKeyFromPrivateKey } = require('@zilliqa-js/crypto');
const { BN, Long, bytes, units } = require('@zilliqa-js/util');

const api = 'https://dev-api.zilliqa.com';
const chainId = 333; // Testnet
const msgVersion = 1;
const zilliqa = new Zilliqa(api);

const toAddress = 'BENCH32_ADDRESS';
const fromPrivateKey = 'SENDER_PRIVATE_KEY';
const fromPublicKey = getPubKeyFromPrivateKey(fromPrivateKey);
const fromAddress = getAddressFromPrivateKey(fromPrivateKey);
const amountToSendInZil = 0.17;
const gasPriceInZil = 0.002;
const nextNonce =
  (await zilliqa.blockchain.getBalance(fromAddress)).result.nonce + 1;

const rawTx = zilliqa.transactions.new({
  version: bytes.pack(chainId, msgVersion),
  amount: new BN(units.toQa(amountToSendInZil * 1000000, units.Units.Li)),
  nonce: nextNonce,
  gasLimit: Long.fromNumber(50), // normal (non-contract) transactions cost 50 gas after network upgrade in mid april 2021
  gasPrice: new BN(units.toQa(gasPriceInZil * 1000000, units.Units.Li)), // the minimum gas price is 1,000 li
  toAddr: toAddress,
  pubKey: fromPublicKey, // this determines which account is used to send the tx
});
```

## Signing the Transaction

Again, there are a few ways you can sign your transaction. Under the hood,
signing is done with the elliptic curve `secp256k1`. The easiest way to do
this is by using a wallet. Extending our example above:

```js
zilliqa.wallet.addByPrivateKey(fromPrivateKey);
// signWith uses the specified address to perform the signing of the transaction.
// note that we provided the nonce to use when constructing the transaction.
// if the nonce is not provided, zilliqa-js will automatically try to determine the correct nonce to use.
// however, if there is no network connection, zilliqa-js will not be able to
// do that, and signing will fail.
const signedTx = await zilliqa.wallet.signWith(rawTx, fromAddress);
```

Note that we provided the nonce to use when constructing the transaction. If the nonce is not provided, zilliqa-js will automatically try to determine the correct nonce to use.
However, if there is no network connection, zilliqa-js will not be able to do that, and signing will fail.

If the `Transaction` is successfully signed, you will be able to access the
`signature` property on `txParams`.

```ts
console.log(signedTx.txParams.signature); // 128-bit signature
```

At this stage, you'll be able to broadcast your newly-signed transaction to
the network through a seed node.

## Sending the Transaction

Broadcasting a signed transaction is trivial, but involves some subtleties
that can trip you up if you do not have a deep understanding of Zilliqa's
architecture.

We demonstrate a lower-level way to broadcast a transaction using the built-in
`HTTPProvider`, as follows:

```js
const res = await zilliqa.provider.send('CreateTransaction', signedTx.txParams);
```

This returns a `Promise` that, if successful, will contain your transaction
hash:

```js
console.log(res.result && res.result.TranID); // 32-byte transaction hash
```

However, note that `result` will not exist on the response if there is an
error in processing the transaction. Instead, the response will contain an
`error` key, which is an object that complies with JSON-RPC 2.0.

If you receive a `TranID`, that means your transaction was accepted by the
seed node, and is now pending. `zilliqa-js` provides a way to automatically
poll the lookup for confirmation:

```ts
// returns a Promise<Transaction>
// in this case, we try polling the node 33 times, increasing the interval
// between attempts by 1000ms each time. this works out roughly to the block
// time on the Zilliqa main net.
const tx = await signedTx.confirm(res.result.TranID, 33, 1000);
```

The `confirm` method returns a Promise the status of which signifies the
confirmation status of the transaction. If the transaction was confirmed:

```ts
assert(signedTx.isConfirmed() === true);
```
