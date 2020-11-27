import {DepositRepository} from '../repositories';

export class DepositController {
  repository: DepositRepository;

  constructor(repo: DepositRepository) {
    this.repository = repo;
  }

  /**
   * getDeposits
   *
   * @param {string} address
   * @returns {Deposit}
   */
  async getDeposits(address: string) {
    return this.repository.list(address);
  }
}
