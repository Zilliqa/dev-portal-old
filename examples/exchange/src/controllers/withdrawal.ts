import BN from 'bn.js';
import {getAddressFromPrivateKey} from '@zilliqa-js/crypto';
import {Request, Response} from 'express';
import {config} from '../config';
import {ZilliqaService} from '../services/zilliqa';

// in reality, you should of course, never do this.
const HOT_WALLET_PASSPHRASE = 'stronk_passphrase';

export class WithdrawalController {
  address: string = '';
  zsvc: ZilliqaService;

  // DI the service in.
  constructor(zsvc: ZilliqaService) {
    // add your hot wallet keys
    this.zsvc = zsvc;
  }

  async init() {
    const address = await this.zsvc.addKeystoreFile(
      config.get('keystore'),
      HOT_WALLET_PASSPHRASE,
    );
    this.address = address;
  }

  withdraw(to: string, amount: BN) {
    return this.zsvc.withdraw(this.address, to, amount);
  }
}
