import {flatten, range} from 'lodash';
import pMap from 'p-map';
import * as cron from 'node-cron';
import {ZilliqaService} from '../services/zilliqa';

// this is a demo address. use your own!
// in production, it's likely to be the address of your hot wallet(s)
const demoAddress = '8f4f6a13cbb1724800079d9f699b3a02c91246ba';

export class DepositCron {
  svc: ZilliqaService;
  task: cron.ScheduledTask;
  // you should persist the last fetched block to a database, and initialise
  // this cron job with that block number, to avoid fetch all blocks from 0 to
  // present.
  lastFetchedTxBlock: number = 0;

  constructor(frequency: string, svc: ZilliqaService) {
    this.svc = svc;

    this.task = cron.schedule(frequency, async () => {
      const currentTxBlock = await this.svc.getTxBlock();
      console.log('Current tx block: ', currentTxBlock);
      if (currentTxBlock > this.lastFetchedTxBlock) {
        // get transactions from lastFetchedTxBlock + 1 to current, and set
        // lastFetchedTxBlock to current
        const transactions = await pMap(
          range(this.lastFetchedTxBlock + 1, currentTxBlock),
          blk => svc.getDeposits([demoAddress], blk),
        ).then(flatten);

        this.lastFetchedTxBlock = currentTxBlock;

        // we are only logging to stdout, but in a real application, you would
        // be writing the result to the database.
        console.log(`Found ${transactions.length} deposits for ${demoAddress}`);
      }
    });
  }

  start() {
    this.task.start();
  }

  stop() {
    this.task.start();
  }

  nuke() {
    this.task.destroy();
  }
}
