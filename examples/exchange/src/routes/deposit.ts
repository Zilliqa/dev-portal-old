import {Handler, Router} from 'express';
import {DepositController} from '../controllers/deposit';

export const get = (router: Router, ctrl: DepositController) => {
  router.get('/deposits/:address', async (req, res, next) => {
    const {address} = req.params;
    const deposits = await ctrl.getDeposits(address);

    res.status(200).json({deposits});
  });
};
