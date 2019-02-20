import BN from 'bn.js';
import {Request, Response} from 'express';
import {ZilliqaService} from '../services/zilliqa';

class WithdrawalController {
  zsvc: ZilliqaService;

  // DI the service in.
  constructor(zsvc: ZilliqaService) {
    this.zsvc = zsvc;
  }

  withdraw(from: string, to: string, amount: BN) {
    return this.zsvc.withdraw(from, to, amount);
  }
}
