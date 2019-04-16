# 存款投票



#### 注意

> Zillings（“ZILs”）的临时Zillings（“临时ZILs”）不能提供、出售或转让给美国人（如1933年美国证券法第S条所定义）。 请确保在交换临时ZIL时，确认ZIL的每个持有人不是美国人（如1933年美国证券法第S条所定义）。



除了发送交易外，交易所还需要一种方法来监听发送到它们存款地址的交易。在本教程中，我们不会介绍在Zilliqa上类似ERC20的智能合约实现过程，但我们会采用相同的策略。

本教程中的代码来自[示例程序](https://github.com/Zilliqa/dev-portal/blob/master/examples/exchange/src/cron/deposit.ts)。

## 设置

要在Node.js中实现一个简单而熟悉的轮询机制，我们将需要额外的依赖项：

```sh
npm i node-cron p-map lodash
```

## 实现处理程序功能

我们将使用一个名为`DepositCron`的简单`class`来设置我们的cron作业。 我们将首先实现一个名为`handler`的处理程序方法。

```ts
import {flatten, range} from 'lodash';
import pMap from 'p-map';
import * as cron from 'node-cron';
import {ZilliqaService} from '../services/zilliqa';

export class DepositCron {
  addresses: string[] = [];
  frequency: string = '* * * * *';
  svc: ZilliqaService;
  task: cron.ScheduledTask;
  // you should persist the last fetched block to a database, and initialise
  // this cron job with that block number, to avoid fetch all blocks from 0 to
  // present.
  lastFetchedTxBlock: number = 0;

  constructor(frequency: string, svc: ZilliqaService, addresses: string[]) {
    this.frequency = frequency;
    this.svc = svc;
    this.addresses = addresses;
  }

  async handler() {
    const currentTxBlock = await this.svc.getTxBlock();
    console.log('Current tx block: ', currentTxBlock);
    if (currentTxBlock > this.lastFetchedTxBlock) {
      // get transactions from lastFetchedTxBlock + 1 to current, and set
      // lastFetchedTxBlock to current
      const transactions = await pMap(
        range(this.lastFetchedTxBlock + 1, currentTxBlock),
        blk => this.svc.getDeposits(this.addresses, blk),
      ).then(flatten);

      this.lastFetchedTxBlock = currentTxBlock;

      // we are only logging to stdout, but in a real application, you would
      // be writing the result to the database.
      console.log(`Found ${transactions.length} deposits for ${this.addresses}`);
    }
  }
}
```

接下来解压缩`handler`。我们采取了几个步骤：

1. 获取当前的`TxBlock`。

2. 我们将当前`TxBlock`的值与我们使用`lastFetchedTxBlock`记录的值进行比较。

3. 如果存在差异，我们将获取两者之间已处理的所有交易

   ```
   lastFetchedTxBlock + 1
   ```

   和当前

   ```
   TxBlock
   ```

   - 即每个漏掉的交易。

4. 然后，我们为在该区块范围内处理的每个交易调用`svc.getDeposits`。它将每个交易的`toAddr`属性与传递给`constructor`的`addresses`数组进行比较，检查它是否包含我们的`toAddr`。 如果包含`toAddr`，那就代表着我们所监听的地址发生了交易。

## 开始Cron工作

到目前为止，我们无法启动或控制我们的`CronJob`。 我们将通过实现`start`，`stop`和`nuke`方法来实现。

```ts
import {flatten, range} from 'lodash';
import pMap from 'p-map';
import * as cron from 'node-cron';
import {ZilliqaService} from '../services/zilliqa';

export class DepositCron {
  addresses: string[] = [];
  frequency: string = '* * * * *';
  svc: ZilliqaService;
  task: cron.ScheduledTask;
  // you should persist the last fetched block to a database, and initialise
  // this cron job with that block number, to avoid fetch all blocks from 0 to
  // present.
  lastFetchedTxBlock: number = 0;

  constructor(frequency: string, svc: ZilliqaService, addresses: string[]) {
    this.frequency = frequency;
    this.svc = svc;
    this.addresses = addresses;
    this.task = cron.schedule(this.frequency, this.handler.bind(this));
  }

  async handler() {
    const currentTxBlock = await this.svc.getTxBlock();
    console.log('Current tx block: ', currentTxBlock);
    if (currentTxBlock > this.lastFetchedTxBlock) {
      // get transactions from lastFetchedTxBlock + 1 to current, and set
      // lastFetchedTxBlock to current
      const transactions = await pMap(
        range(this.lastFetchedTxBlock + 1, currentTxBlock),
        blk => this.svc.getDeposits(this.addresses, blk),
      ).then(flatten);

      this.lastFetchedTxBlock = currentTxBlock;

      // we are only logging to stdout, but in a real application, you would
      // be writing the result to the database.
      console.log(`Found ${transactions.length} deposits for ${this.addresses}`);
    }
  }

  async start() {
    this.task.start();
  }

  async stop() {
    this.task.stop();
  }

  async nuke() {
    this.task.destroy();
  }
}
```

现在我们有了方法，我们可以像这样使用`Cronjob`：

```ts
// app.ts
// initialise services
import * as services from './services';
import * as crons from './cron';

const zilliqaSvc = new services.ZilliqaService(
  'https://stress-test-api.aws.z7a.xyz',
  {
    [config.get('mnemonic')]: 8,
  },
);

// boot up cron jobs
// these can also be destroyed
const depositCron = new crons.DepositCron('* * * * *', zilliqaSvc);
depositCron.start();
```

