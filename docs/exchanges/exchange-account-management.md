---
id: exchange-account-management
title: Account Management
keywords:
  - generating account
  - exporting account
  - importing account
  - zilliqa
description: Exchange Account Management
---

---

## Generating Numerous Accounts

A common task for exchanges is to safely and predictably generate a large
number of addresses. You can do so using one or more [BIP39 mnemonics](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki).

```ts
export class ZilliqaService {
  accounts: string[] = [];
  zil: Zilliqa;

  constructor(api: string, mnemonics: { [mnemonic: string]: number }) {
    const zilliqa = new Zilliqa(api);
    this.zil = zilliqa;

    // you can use one or more mnemonics to manage/generate a large number of accounts
    for (let m in mnemonics) {
      const num = mnemonics[m];
      range(num).forEach((i) => {
        const address = this.zil.wallet.addByMnemonic(m, i);
        this.accounts.push(address);
      });
    }
  }

  /* truncated */
}
```

## Exporting an Account

You may also wish to export a keypair to a portable format to use it somewhere else.
We support a modified implementation of the [Web3 Secret Storage Definition](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition).

```typescript
import { Zilliqa } from '@zilliqa-js/zilliqa';
import * fs from 'fs';

export class ZilliqaService {
  accounts: string[] = [];
  zil: Zilliqa;

  constructor(api: string, mnemonics: {[mnemonic: string]: number}) {
    const zilliqa = new Zilliqa(api);
    this.zil = zilliqa;

    // you can use one or more mnemonics to manage/generate a large number of accounts
    for (let m in mnemonics) {
      const num = mnemonics[m];
      range(num).forEach(i => {
        const address = this.zil.wallet.addByMnemonic(m, i);
        this.accounts.push(address);
      });
    }
  }

  /* truncated */

  export(address: string) {
    // keep this secret.
    const passphrase = 'something';
    const json = this.zil.wallet.export(address, passphrase);
    // at this point, you should safely write this to disk, or send it to
    // a vault somehwere. the point is to keep it safe.
    fs.writeFile('/path/to/safe/place', json);
  }

  /* truncated */
}
```

Now, you should be able to find your file containing your passphrase-encrypted
private key at the path you specified. Remember to always keep this file, and
especially your passphrase, secret!

## Importing an Account

:::caution
Ethereum's implementation differs from Zilliqa's. You will **not** be able to decrypt a Zilliqa keystore file using web3 and vice-versa.
:::

At some stage, you may also need to import a keystore file you had previously
exported. There is a convenient facility for that.

```ts
import pify from 'pify';
import { Zilliqa } from '@zilliqa-js/zilliqa';
import * fs from 'fs';

export class ZilliqaService {
  accounts: string[] = [];
  zil: Zilliqa;

  constructor(api: string, mnemonics: {[mnemonic: string]: number}) {
    const zilliqa = new Zilliqa(api);
    this.zil = zilliqa;

    // you can use one or more mnemonics to manage/generate a large number of accounts
    for (let m in mnemonics) {
      const num = mnemonics[m];
      range(num).forEach(i => {
        const address = this.zil.wallet.addByMnemonic(m, i);
        this.accounts.push(address);
      });
    }
  }

  /* truncated */

  export(address: string) {
    // keep this secret.
    const passphrase = 'something';
    const json = this.zil.wallet.export(address, passphrase);
    // at this point, you should safely write this to disk, or send it to
    // a vault somehwere. the point is to keep it safe.
    fs.writeFile('/path/to/safe/place', json);
  }

  async addKeystoreFile(path: string, passphrase: string) {
    const buf = await pify(fs.readFile)(path);
    const json = buf.toString();
    const address = await this.zil.wallet.addByKeystore(json, passphrase);

    return address;
  }

  /* truncated */
```

These two methods allow you to securely serialise and deserialise your
accounts.
