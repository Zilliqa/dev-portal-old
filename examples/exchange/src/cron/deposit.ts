import * as cron from 'node-cron';
import {ZilliqaService} from '../services/zilliqa';

export class DepositCron {
  svc: ZilliqaService;
  task: cron.ScheduledTask;

  constructor(frequency: string, svc: ZilliqaService) {
    this.svc = svc;
    this.task = cron.schedule(frequency, () => {
      console.log('Running deposit cron job');
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

