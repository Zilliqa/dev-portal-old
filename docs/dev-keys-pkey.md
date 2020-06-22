---
id: dev-keys-pkey
title: Keystore File & Private Key
---

Dapp developers can allow their users to interact with their dapp by entering their keystore file or private key as well. Although, the recommended strategy for user key management is using a browser add-on like Zilpay.

The following code snippet illustrates how to get the user private key from the encrypted keystore file.

```javascript
import { decryptPrivateKey } from '@zilliqa-js/crypto';
async function privKeyFromKeystore() {
let keystore = JSON.parse(encryptedWallet); //encryptedWallet is the encrypted keystore file
let privKey = await decryptPrivateKey(passphrase, keystore); //passphrase variable has the passphrase of the encrypted wallet
}
```

After we get the private key from the keystore file using ```zilliqa-js/crypto``` module, the subsequent steps for doing anything are same.

In the code snippet below, we call the setHello() transition of the Hello World Contract. We assume that in the case of keystore login, the private key was obtained using the above code snippet.

```javascript
  async updateWelcomeMsg(){
    //Only the below two lines are different when compared with zilpay login.
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