# 发送交易



#### 注意

> Zillings（“ZILs”）的临时Zillings（“临时ZILs”）不能提供、出售或转让给美国人（如1933年美国证券法第S条所定义）。 请确保在交换临时ZIL时，确认ZIL的每个持有人不是美国人（如1933年美国证券法第S条所定义）。



任何交易所的一个关键特征是能够将保管中的资金提取到用户选择的任意地址。由于Zilliqa节点不提供由交易所对交易进行签名的API，因此必须通过您选择的SDK在本地执行此操作。我们使用官方JavaScript SDK zilliqa-js进行示例。

本教程中的代码来自[示例应用程序](https://github.com/Zilliqa/dev-portal/blob/master/examples/exchange/src/services/zilliqa.ts)。

## 构造交易对象

有几种方法可以构造`Transaction`实例。 我们建议使用umbrella Zilliqa对象里的transaction factory，如下所示：

```ts
import { Zilliqa } from '@zilliqa-js/zilliqa';
const api = 'https://community-api.aws.z7a.xyz';
const zilliqa = new Zilliqa(api);
const pubKey = '02bc475d1b5dd9d6ed6347e93da3d4c1ad35f4d987d52ea91de997ecba56845cd2';

const rawTx = zilliqa.transactions.new({
  version: bytes.pack(2, 1),
  amount,
  nonce: 1
  gasLimit: Long.fromNumber(1), // normal (non-contract) transactions cost 1 gas
  gasPrice: new BN(units.toQa(1000, units.Units.Li)), // the minimum gas price is 1,000 li
  toAddr: to, // toAddr is self-explanatory
  pubKey, // this determines which account is used to send the tx
});
```

## 交易签名

另外，您还可以通过以下几种方式对交易进行签名。从原理上来说，签名用的是椭圆曲线`secp256k1`完成的。使用钱包是最简单的方法之一，让我们对上面的例子进行扩展：

```ts
/* truncated */
const privateKey = '1CC85C5F4791232D7D9A6FC35F2FF15EFAAC4A6E0E9F4A565FD2CCCCB73FCA3B'
const address = 'e3ea87d7838397fc4417f5ec449f2d2d7cdb6dd1';
zilliqa.wallet.addByPrivateKey(privateKey);
// signWith uses the specified address to perform the signing of the transaction.
// note that we provided the nonce to use when constructing the transaction.
// if the nonce is not provided, zilliqa-js will automatically try to determine the correct nonce to use.
// however, if there is no network connection, zilliqa-js will not be able to
// do that, and signing will fail.
const signedTx = await this.zil.wallet.signWith(rawTx, address);
```

请注意，在构造transaction时使用了我们提供的nonce。如果未提供nonce，zilliqa-js将自动尝试确定正确的nonce。但是，如果没有网络连接，zilliqa-js将无法做到这一点，导致签名失败。

如果`交易`已成功签名，您将能够访问`txParams`上的`signature`属性。

```ts
console.log(signedTx.txParams.signature) // 128位签名
```

在此阶段，您将能够通过种子节点将新签名的交易广播到网络。

## 发送交易

广播一个签名的交易不是重要的事情，但如果你对Zilliqa的架构没有深刻的理解，那么可能会引起一些微小的变化。

我们演示了使用内置`HTTPProvider`广播交易的低级方法，如下所示：

```ts
/* truncated */
const res = await this.zil.provider.send('CreateTransaction', tx.txParams);
```

这将返回一个`Promise`，如果成功，将包含您的交易哈希：

```ts
console.log(res.result && res.result.TranID) // 32字节交易哈希
```

但请注意，如果处理交易时出错，则返回结果中不会存在`result`。 相反，程序将返回一个`error`键，它是一个JSON-RPC 2.0的对象。

如果您收到`TranID`，则表示您的交易已被种子节点接受，现在正在等待处理。`zilliqa-js`提供了一种自动轮询查找确认的方法：

```ts
// returns a Promise<Transaction>
// in this case, we try polling the node 33 times, increasing the interval
// between attempts by 1000ms each time. this works out roughly to the block
// time on the Zilliqa main net.
const tx = await signedTx.confirm(res.result.TranID, 33, 1000)
```

`confirm`方法返回Promise，其状态表示交易的确认状态。如果交易得到确认：

```
assert(signedTx.isConfirmed() === true);
```

