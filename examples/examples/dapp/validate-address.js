const { Zilliqa } = require("@zilliqa-js/zilliqa");

const zilliqa = new Zilliqa("https://dev-api.zilliqa.com");

const isContract = async contractAddress => {
  const address = contractAddress.replace("0x", ""); // RPC server does not accept 0x prefix
  const init = await zilliqa.blockchain.getSmartContractInit(address);
  const result = init.result ? true : false;
  return result;
};

const main = async () => {
  const addresses = [];
  addresses.push("573EC96638C8bB1c386394602E1460634F02aDdA"); // invalid contract address
  addresses.push("5865337a32F48a04F5B52507442f47FC558d9C2b"); // valid contract address

  /**
   * 0x5865337a32F48a04F5B52507442f47FC558d9C2b is a valid contract address
   * https://viewblock.io/zilliqa/address/zil1tpjnx73j7j9qfad4y5r5gt68l32cm8ptgus5n5?network=testnet
   */

  for (let addr of addresses) {
    const result = await isContract(addr);
    console.log(`Is ${addr} a contract? ${result}`);
  }
};

main();

/**
 * Expected return:
 * Is 573EC96638C8bB1c386394602E1460634F02aDdA a contract? false
 * Is 5865337a32F48a04F5B52507442f47FC558d9C2b a contract? true
 */
