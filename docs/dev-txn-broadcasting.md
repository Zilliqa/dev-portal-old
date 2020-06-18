---
id: dev-txn-broadcasting
title: Broadcasting
---
After signing the transaction, we may broadcast the transaction to a seed node (e.g. https://dev-api.zilliqa.com) by creating a transaction object. The correct RPC API to use is `CreateTransaction`. 
Refer to https://apidocs.zilliqa.com/#createtransaction for more information.

The seed node performs some basic validation of the JSON payload it receives, and will attempt to verify the signature. Please note that it does not verify the correctness of the `nonce`. It is at all times the developer's responsiblity to correctly increment the nonce used in the transaction.

If `nonce` is incorrect, the transaction can silently fail. This means that the seed/lookup node will blindly forward the transaction to the correct shard, which may then reject the transaction with no error receipt.

__Note:__ The above applies only if we use JSON RPC API to create the transaction object. If SDKs are used to create the transaction object, then `nonce` management is not an issue as SDKs would automatically handle the nonce management.

## Non-Contract Transaction Object
Example of creating a __non-contract__ transaction object (ZilliqaJS):
```
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { getAddressFromPrivateKey } = require('@zilliqa-js/crypto');
const zilliqa = new Zilliqa("https://dev-api.zilliqa.com");

const PRIVATE_KEY = '9afc1a1dab96127e902daaaec1a56c30346f007523c787c3bb62371c0e5a1be7';

async function main() {
    try {
        zilliqa.wallet.addByPrivateKey(PRIVATE_KEY);

        let tx = zilliqa.transactions.new({
            version: 65537,
            toAddr: "0x1234567890123456789012345678901234567890",
            amount: units.toQa("1000", units.Units.Li),
            gasLimit: Long.fromNumber(1),
        });
        tx = await zilliqa.blockchain.createTransaction(tx);
        console.log(tx.id);
    
    } catch (err) {
        console.log(err);
    }

}

main();

```

## Contract Transaction Object
The following is an example of creating a __contract__ transaction object. The difference between __contract__ and __non-contract__ transaction objects is the additional contract transitions such as `setHello` and its relevant params such as the `vname`, `type` and `value` as describe in the deployed contract.
The other significant difference is the `gasLimit` field. For __contract__ transaction objects, the recommended `gasLimit` is between `10000` to `30000`.

Example of creating a __contract__ transaction object (ZilliqaJS):
```
const { BN, Long, bytes, units } = require('@zilliqa-js/util');
const { Zilliqa } = require('@zilliqa-js/zilliqa');
const { toBech32Address, getAddressFromPrivateKey } = require('@zilliqa-js/crypto');

const zilliqa = new Zilliqa("https://dev-api.zilliqa.com");
const chainId = 333; // chainId of the developer testnet
const msgVersion = 1; // current msgVersion
const VERSION = bytes.pack(chainId, msgVersion);

const PRIVATE_KEY = '9afc1a1dab96127e902daaaec1a56c30346f007523c787c3bb62371c0e5a1be7';
const CONTRACT_ADDR = toBech32Address('0x1234567890123456789012345678901234567890'); // convert to bech32 format

async function main() {
    try {
        zilliqa.wallet.addByPrivateKey(PRIVATE_KEY);
        const deployedContract = zilliqa.contracts.at(CONTRACT_ADDR);
        const callTx = await deployedContract.call(
            'setHello',
            [
                {
                    vname: 'msg',
                    type: 'String',
                    value: "hello world!"
                }
            ],
            {
                version: VERSION,
                amount: new BN(0),
                gasPrice: units.toQa("1000", units.Units.Li)
                gasLimit: Long.fromNumber(10000)
            }
        );

        console.log("transaction: %o", callTx.id);
        console.log(JSON.stringify(callTx.receipt, null, 4));
    
    } catch (err) {
        console.log(err);
    }

}

main();
```