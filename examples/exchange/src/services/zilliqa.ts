import pMap from 'p-map';
import {flatten, range} from 'lodash';
import {isValidChecksumAddress} from '@Zilliqa-js/crypto';
import {BN, Long, units, bytes} from '@Zilliqa-js/util';
import {Zilliqa} from '@zilliqa-js/zilliqa';

export class ZilliqaService {
  accounts: string[] = [];
  zil: Zilliqa;

  constructor(api: string, mnemonics: {[mnemonic: string]: number}) {
    const zilliqa = new Zilliqa(api);
    this.zil = zilliqa;

    // use mnemonics to manage/generate a large number of accounts
    // you can use this strategy for adding pre-existing accounts that you
    // want to use.
    for (let m in mnemonics) {
      const num = mnemonics[m];
      range(num).forEach(i => {
        const address = this.zil.wallet.addByMnemonic(m, i);
        this.accounts.push(address);
      });
    }
  }

  addAccount(privateKey: string) {
    // this returns the address of the newly-added account.
    return this.zil.wallet.addByPrivateKey(privateKey);
  }

  createAccount(mnemonic: string, index: number) {
    // this returns the address of the freshly-created account.
    return this.zil.wallet.addByMnemonic(mnemonic, index);
  }

  async getTxBlock() {
    const res = await this.zil.blockchain.getLatestTxBlock();

    return parseInt(res.result!.header.BlockNum, 10);
  }

  async getDeposits(addresses: string[], block: number) {
    const res = await this.zil.blockchain.getTransactionsForTxBlock(block);

    if (res.error) {
      // in this case, there are no transactions in the block; we can return
      // an empty array.
      if (res.error.code === -1) {
        return [];
      }

      // you may not wish to throw, depending on the response.
      throw res.error;
    }

    // if there is no error, result will definitely exist.
    const transactions = await pMap(flatten(res.result), tx =>
      this.zil.blockchain.getTransaction(tx),
    );

    // filter out everything that isn't in the list of deposit addresses we
    // are interested in.
    return transactions.filter(
      tx => addresses.indexOf(tx.txParams.toAddr.toLowerCase()) !== -1,
    );
  }

  async withdraw(from: string, to: string, amount: BN) {
    try {
      // always check whether the to minimally passes the checksum.
      // this prevents users from trying to withdraw native ZILs to an
      // ethereum address, and subsequently being unable to recover them!
      if (!isValidChecksumAddress(to)) {
        throw new Error(`${to} is not a valid Zilliqa checksum address!`);
      }

      if (!this.zil.wallet.accounts[from]) {
        throw new Error(`We do not control the ${from} address!`);
      }

      const fromPubKey = this.zil.wallet.accounts[from].publicKey;

      const tx = await this.zil.blockchain.createTransaction(
        this.zil.transactions.new({
          version: bytes.pack(2, 1),
          amount,
          gasLimit: Long.fromNumber(1), // normal (non-contract) transactions cost 1 gas
          gasPrice: new BN(units.toQa(1000, units.Units.Li)), // the minimum gas price is 1,000 li
          toAddr: to, // toAddr is self-explanatory
          pubKey: fromPubKey, // this determines which account is used to send the tx
        }),
      );

      if (tx.isRejected()) {
        // you may not wish to throw.
        // this should generally be caught in the catch block
        throw new Error('Transaction was rejected');
      }

      return tx;
    } catch (err) {
      console.log(err);
      // handle the error
      // can be:
      // - timeout
      // - insufficient balance
      // - wrong nonce
      // - did not pass checksum validation
      // - js error
    }
  }
}
