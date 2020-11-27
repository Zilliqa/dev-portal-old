import {TxParams} from '@zilliqa-js/account';
import PouchDB from 'pouchdb';

export class DepositRepository {
  db: PouchDB.Database;

  constructor(db: PouchDB.Database) {
    this.db = db;
  }

  /**
   * create
   *
   * Creates a deposit entry
   *
   * @param {TxParams} tx
   * @returns {Promise}
   */
  async create(tx: TxParams) {
    const res = await this.db.put({ ...tx });
    return res;
  }

  /**
   * list
   *
   * Returns a list of deposits for a given address
   *
   * @param {string} address
   * @returns {Promise}
   */
  list(address: string) {
    return this.db.get(address);
  }

  /**
   * findOne
   *
   * Returns a single deposit given a txHash, or null if none is found
   *
   * @param {string} txHash
   * @returns {Promise}
   */
  findOne(txHash: string) {
    return this.db.find({
      selector: {txHash},
    });
  }
}
