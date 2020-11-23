const { Zilliqa } = require("@zilliqa-js/zilliqa");
const { fromBech32Address } = require("@zilliqa-js/crypto");

const zilliqa = new Zilliqa("https://dev-api.zilliqa.com");

const getInit = async (address) => {
  // getSmartContractInit currently only supports ByStr20 addresses without 0x prefix
  const init = await zilliqa.blockchain.getSmartContractInit(
    fromBech32Address(address)
    .replace("0x","")
   );

   if(init.error || !init.result) {
    console.log(`Error: Address ${address} is not a contract address`);
    throw new Error('Error: Failed to get Init');
  }
   return init.result; 
 }

const getState = async (address) => {
  // getSmartContractState currently only supports ByStr20 addresses without 0x prefix
  const state = await zilliqa.blockchain.getSmartContractState(
   fromBech32Address(address)
   .replace("0x","")
  );

  if(state.error | !state.result) {
    console.log(`Error: Address ${address} is not a contract address`);
    throw new Error('Error: Failed to get state');
  }

  return state.result;
}


const main = async () => {

  const address = "zil1tyu0ezhcyfg26m83mgamjt625qzukfcht8es69"; 

  console.log('Contract Init Parameters');
  const init = await getInit(address);
  console.log(JSON.stringify(init, null, 2));

  console.log('Contract State');
  const state = await getState(address);
  console.log(JSON.stringify(state, null, 4));

  console.log('Filtering items');
  const balances = Array.from(state).filter((item) => item.vname === 'balances');

  if(balances.length === 0) { 
    throw new Error('Balance cannot be found');
  }

  console.log(JSON.stringify(balances[0].value, null, 4));

};

main();
