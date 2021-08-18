---
id: dev-keys-pkey
title: Private Key & Keystore File
keywords:
  - key management
  - private key
  - keystore
  - import
  - dapp interaction
  - zilliqa
description: Zilliqa Private Key & Keystore File
---

---

Other than ZilPay, dApp developers can allow their users to interact with their dApp using other wallet choices such as a private key or keystore file.
However, we do recommend to use browser add-on such as ZilPay for key management.

## Import via Private Key

The following code snippet illustrates on how To import your account from a private key

```javascript
zilliqa.wallet.addByPrivateKey(privkey); //Private key was stored in the privKey variable
```

## Import via Keystore File

The following code snippet illustrates how to import your account from an encrypted JSON keystore file and retrieve the private from the encrypted

```javascript
import { decryptPrivateKey } from '@zilliqa-js/crypto';
async function privKeyFromKeystore() {
  let keystore = JSON.parse(encryptedWallet); //encryptedWallet is the encrypted keystore file
  let privKey = await decryptPrivateKey(passphrase, keystore); //passphrase variable has the passphrase of the encrypted wallet
}
```

## Interacting with dApp

After importing the account using `zilliqa-js/crypto` module, the subsequent steps for doing anything are similar to the previous example.
In the code snippet below, we call the `setHello()` transition of the `Hello World` Contract using a private key.

:::info
If you wish to use keystore instead of a private key, you can replace the `zilliqa.wallet.addByPrivateKey(privkey)` with the code snippet above.
:::

```javascript
  async updateWelcomeMsg(){
    //Only the below two lines are different when compared with ZilPay login.
    let zilliqa = new Zilliqa('https://dev-api.zilliqa.com');
    zilliqa.wallet.addByPrivateKey(privkey); //Private key was stored in the privKey variable

    let setHelloValue = this.state.setHelloValue; //new value of the welcome msg
    let contractAddress = localStorage.getItem("contract_address");
    const CHAIN_ID = 333;
    const MSG_VERSION = 1;
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION);
    const myGasPrice = units.toQa('1000', units.Units.Li); // Gas Price that will be used by all transactions
    contractAddress = contractAddress.substring(2);
    const ftAddr = toBech32Address(contractAddress);
    try {
        const contract = zilliqa.contracts.at(ftAddr);
        const callTx = await contract.call(
            'setHello',
            [
                {
                    vname: 'msg',
                    type: 'String',
                    value: setHelloValue
                }
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
  }
```
