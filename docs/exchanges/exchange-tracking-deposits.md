---
id: exchange-tracking-deposits
title: Polling for Deposits
keywords:
  - track deposits
  - exchanges
  - cron job
  - zilliqa
description: Track Exchange Deposits
---

---

Apart from sending transactions, an exchange also needs a way to listen for
transactions sent to their addresses (deposits). We won't cover how this can
be done for ERC20-like smart contracts on Zilliqa in this tutorial, but the
same strategy can be applied.

:::info
The code in this tutorial is derived from the [example application](https://github.com/Zilliqa/dev-portal/blob/master/examples/exchange/src/cron/deposit.ts).
:::

## Setting Up

To implement a simple and familiar polling mechanism in Node.js, we will use
a few additional dependencies:

```sh
npm i node-cron p-map lodash
```

## Implementing the Handler Function

We will use a simple `class` called `DepositCron` to set up our cron job.
We'll start by implementing a handler method, aptly named `handler`.

```ts
import { flatten, range } from 'lodash';
import pMap from 'p-map';
import * as cron from 'node-cron';
import { ZilliqaService } from '../services/zilliqa';

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
        (blk) => this.svc.getDeposits(this.addresses, blk)
      ).then(flatten);

      this.lastFetchedTxBlock = currentTxBlock;

      // we are only logging to stdout, but in a real application, you would
      // be writing the result to the database.
      console.log(
        `Found ${transactions.length} deposits for ${this.addresses}`
      );
    }
  }
}
```

Let's unpack `handler`. We are taking several steps:

1. Fetch the current `TxBlock`.
2. We compare the value of the current `TxBlock` against the one we have
   recorded using `lastFetchedTxBlock`.
3. If there is a difference, we fetch all transactions that have been
   processed between `lastFetchedTxBlock + 1` and the current `TxBlock`
   - i.e., everyone transaction we have missed.
4. We then call `svc.getDeposits` for every transaction processed in that span
   of blocks. It compares the `toAddr` property of each transaction against
   the `addresses` array we passed to the `constructor`, checking if it
   contains our `toAddr`. If so, then a transaction to an address we are
   interested in has occurred.

## Starting the Cron Job

So far we have no way of starting up or controlling our `CronJob`. We'll do that by
implementing `start`, `stop`, and `nuke` methods.

```ts
import { flatten, range } from 'lodash';
import pMap from 'p-map';
import * as cron from 'node-cron';
import { ZilliqaService } from '../services/zilliqa';

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
        (blk) => this.svc.getDeposits(this.addresses, blk)
      ).then(flatten);

      this.lastFetchedTxBlock = currentTxBlock;

      // we are only logging to stdout, but in a real application, you would
      // be writing the result to the database.
      console.log(
        `Found ${transactions.length} deposits for ${this.addresses}`
      );
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

Now that we have our methods, we can use the cron job like so:

```ts
// app.ts
// initialise services
import * as services from './services';
import * as crons from './cron';

const zilliqaSvc = new services.ZilliqaService(
  'https://stress-test-api.aws.z7a.xyz',
  {
    [config.get('mnemonic')]: 8,
  }
);

// boot up cron jobs
// these can also be destroyed
const depositCron = new crons.DepositCron('* * * * *', zilliqaSvc);
depositCron.start();
```
