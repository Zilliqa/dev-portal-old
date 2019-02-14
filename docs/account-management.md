---
id: account-management
title: Account Management
---

## Generating an Account

In order to send and receive transactions on Zilliqa, you will need to
generate a keypair consisting of a private key and a public key. You can
conveniently do so using the official JavaScript SDK:

```typescript
import {Wallet} from '@zilliqa-js/account';
import {HTTPProvider} from '@zilliqa-js/core';

// create a Wallet instance.
// A Wallet is used to manage Accounts.
const provider = new HTTPProvider('https://community-api.aws.z7a.xyz');
const myWallet = new Wallet(provider);

// Randomly and securely generate a new Account
// `myAddress` is a 20-byte address.
const myAddress = myWallet.create();

// You can also introspect the underlying private and public keys.
// Your private key must be kept safe AT ALL TIMES. Never reveal your private key.
const myAccount = myWallet.accounts[myAddress];

// NEVER do this with a real keypair.
console.log(myAccount.publicKey, myAccount.privateKey);
```

## Exporting an Account

Once you have generated your account, you may wish to export your account in
a portable format in order to use it somewhere else. We support a modified
implementation of the [Web3 Secret Storage Definition](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition).

Following on from our example:

```typescript
import * fs from 'fs';

myAccount
  .toFile('very_stronk_passphrase') // use a strong passphrase!
  .then((json: string) => {
    fs.writeFileSync('/path/to/safe/directory/my_account.json)', string);
  });
```

Now, you should be able to find your file containing your passphrase-encrypted
private key at the path you specified. Remember to always keep this file, and
especially your passphrase, secret!

## Importing a Web3 Secret Storage Account

At this point, you are probably wondering how you can use your encrypted
account file. Don't you worry child.

```typescript
import * as fs from 'fs';
import { Account } from '@zilliqa-js/account';

const file = fs.readFileSync('/path/to/safe/place/my_account.json', {encoding: 'utf8'});
const myDecryptedAccount = Account.fromFile(file, 'very_stronk_passphrase');
```

Your encrypted file has now been decrypted using your passphrase, and you may
freely use it to sign and send transactions, deployed smart contracts, and
more.
