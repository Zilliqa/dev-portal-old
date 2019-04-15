# 账户管理



#### 注意：

> Zillings（“ZILs”）的临时Zillings（“临时ZILs”）不能提供、出售或转让给美国人（如1933年美国证券法第S条所定义）。 请确保在交换临时ZIL时，确认ZIL的每个持有人不是美国人（如1933年美国证券法第S条所定义）。



本教程中的代码来自[示例应用程序](https://github.com/Zilliqa/dev-portal/blob/master/examples/exchange/src/services/zilliqa.ts)。

## 批量生成账户

交易所的常见任务是安全且可预测地生成大量地址。您可以使用一个或多个[BIP39助记符](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)来完成此操作。

```ts
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
}
```

## 导出账户

您可能还希望将密钥对导出为可移植格式，以便在其他位置使用它。我们支持用[Web3密钥存储定义](https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition)来实现。

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

现在，您应该能够在指定的路径中找到包含用您的密码加密后的私钥文件。切记要永久保留此文件，特别是您的密码！

## 导入账户

> 注意：以太坊的实现方式与Zilliqa有不同之处。您将无法使用web3解密Zilliqa的keystore文件，反之亦然。

在某些阶段，您可能还需要导入先前导出的keystore文件。为此我们提供了一个方便的方法。

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

这两种方法允许您安全地序列化和反序列化您的帐户。