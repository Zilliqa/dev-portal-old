import BN from 'bn.js';
import {getAddressFromPrivateKey} from '@zilliqa-js/crypto';
import {Request, Response} from 'express';
import {ZilliqaService} from '../services/zilliqa';

const HOT_WALLET_PKEY = '1CC85C5F4791232D7D9A6FC35F2FF15EFAAC4A6E0E9F4A565FD2CCCCB73FCA3B';

export class WithdrawalController {
  zsvc: ZilliqaService;

  // DI the service in.
  constructor(zsvc: ZilliqaService) {
    // add your hot wallet keys
    zsvc.addAccount(HOT_WALLET_PKEY);
    this.zsvc = zsvc;
  }

  withdraw(to: string, amount: BN) {
    const from = getAddressFromPrivateKey(HOT_WALLET_PKEY);

    return this.zsvc.withdraw(from, to, amount);
  }
}
