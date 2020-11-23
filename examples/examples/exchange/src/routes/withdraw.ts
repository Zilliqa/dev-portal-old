import {toChecksumAddress} from '@zilliqa-js/crypto';
import BN from 'bn.js';
import {Handler, Router} from 'express';
import {WithdrawalController} from '../controllers';

const DEMO_WITHDRAWAL_ADDRESS = '444ad01a947cbae36602d920bd81b48050051dbe';

export const create = (router: Router, ctrl: WithdrawalController) => {
  router.post('/withdraw', async (req, res, next) => {
    const {amount} = req.body;
    // you would probably populate your request context with the user making
    // such an address. for convenience, we use a mock address as the
    // withdraw-to destination.
    const result = await ctrl.withdraw(
      toChecksumAddress(DEMO_WITHDRAWAL_ADDRESS),
      new BN(amount),
    );

    console.log('Created withdrawal with transaction hash: ', result.TranID);
    res.status(200).json({ txHash: result.TranID });
  });
};
