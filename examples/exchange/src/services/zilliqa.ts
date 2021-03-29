import * as fs from 'fs';
import pify from 'pify';
import pMap from 'p-map';
import {flatten, range} from 'lodash';
import {util} from '@zilliqa-js/account';
import {isValidChecksumAddress, sign} from '@zilliqa-js/crypto';
import {BN, Long, units, bytes} from '@zilliqa-js/util';
import {Zilliqa} from '@zilliqa-js/zilliqa';

export class ZilliqaService {
  accounts: string[] = [];
  zil: Zilliqa;

  constructor(api: string, mnemonics: {[mnemonic: string]: number}) {
    const zilliqa = new Zilliqa(api);
    this.zil = zilliqa;

    // you can use one or more mnemonics to manage/generate a large number of accounts
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

  async addKeystoreFile(path: string, passphrase: string) {
    const buf = await pify(fs.readFile)(path);
    const json = buf.toString();
    const address = await this.zil.wallet.addByKeystore(json, passphrase);

    return address;
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

      // can also be sent using this.zil.blockchain.createTransaction
      // use the manual way here to demonstrate lower-level functions
      const tx = await this.zil.wallet.signWith(
        this.zil.transactions.new({
          version: bytes.pack(2, 1),
          amount,
          gasLimit: Long.fromNumber(50), // normal (non-contract) transactions cost 50 gas
          gasPrice: new BN(units.toQa(2000, units.Units.Li)), // the minimum gas price is 2,000 li
          toAddr: to, // toAddr is self-explanatory
          pubKey: fromPubKey, // this determines which account is used to send the tx
        }),
        from,
      );

      const res = await this.zil.provider.send(
        'CreateTransaction',
        tx.txParams,
      );

      if (res.error) {
        throw res.error;
      }

      tx.confirm(res.result.TranID, 33, 1000).then(tx => {
        // at this point, the tx has been confirmed
        // we don't wait for the confirmation before resonding to the request,
        // but we can use the final result to update the database, etc.
        console.log(`Transaction successfully confirmed.`);

        if (tx.isRejected()) {
          // you may not wish to throw. instead, you may wish to log this
          // failed confirmation to some database, or retry.
          throw new Error('Transaction was rejected');
        }
      });

      return res.result;
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
