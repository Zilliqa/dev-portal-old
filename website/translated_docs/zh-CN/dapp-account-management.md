---
id: dapp-account-management
title: 账户管理
---

## 创建账户

要在Zilliqa上发送和接收交易，您需要生成由私钥和公钥组成的密钥对。您可以使用官方JavaScript SDK执行此操作：

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

## 导出账户

创建帐户后，您可能希望以便携式格式导出帐户以便在其他地方使用。我们支持通过[Web3加密存储定义](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition)来实现。

以下为例子：

```typescript
import * fs from 'fs';

myAccount
  .toFile('very_stronk_passphrase') // use a strong passphrase!
  .then((json: string) => {
    fs.writeFileSync('/path/to/safe/directory/my_account.json)', string);
  });
```

现在，您应该能够在指定的路径中找到包含用您的密码加密后的私钥文件。切记要永久保留此文件，特别是您的密码！

## 导入账户

> 注意：以太坊的实现方式与Zilliqa有不同之处。您将无法使用web3解密Zilliqa的keystore文件，反之亦然。

在某些阶段，您可能还需要导入先前导出的keystore文件。为此我们提供了一个方便的方法。

```typescript
import * as fs from 'fs';
import { Account } from '@zilliqa-js/account';

const file = fs.readFileSync('/path/to/safe/place/my_account.json', {encoding: 'utf8'});
const myDecryptedAccount = Account.fromFile(file, 'very_stronk_passphrase');
```

Your encrypted file has now been decrypted using your passphrase, and you may
freely use it to sign and send transactions, deployed smart contracts, and
more.

您的加密文件现在已使用您的密码解密。您可以自由地使用它来签名和发送交易、部署智能合约以及执行更多操作。