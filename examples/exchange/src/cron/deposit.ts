import {flatten, range} from 'lodash';
import pMap from 'p-map';
import * as cron from 'node-cron';
import {ZilliqaService} from '../services/zilliqa';

// this is a demo address. use your own!
// in production, it's likely to be the address of your hot wallet(s)
const demoAddress = '8f4f6a13cbb1724800079d9f699b3a02c91246ba';

export class DepositCron {
  addresses: string[];
  frequency: string;
  svc: ZilliqaService;
  task!: cron.ScheduledTask;
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
