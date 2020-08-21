module.exports = {
  BasicsSideBar: {
    "Blockchain Basics": ["basics/basics-intro-blockchain","basics/basics-intro-consensus","basics/basics-intro-accounts","basics/basics-intro-txns",
    "basics/basics-intro-gas"],

    "Zilliqa Architecture": ["basics/basics-zil-nodes","basics/basics-zil-sharding","basics/basics-zil-consensus","basics/basics-zil-schnorr-signatures",
    "basics/basics-zil-reward","basics/basics-zil-contract","basics/basics-zil-gas"],

    "Zilliqa Ecosystem": ["basics/overview"]
  },
  DevelopersSidebar: {
    "Getting Started": ["dev/dev-started-introduction","dev/dev-started-helloworld","dev/dev-started-env"],

    "User Key Management": ["dev/dev-keys-introduction","dev/dev-keys-zilpay","dev/dev-keys-pkey"],

    "Toolings for Web3": [{"SDKs":["dev/dev-tools-zilliqajs","dev/dev-tools-gozilliqa","dev/dev-tools-java", "dev/dev-tools-sdks"]},
    "dev/dev-tools-websockets", "dev/dev-tools-cli","dev/dev-tools-ide","dev/dev-tools-explorer","dev/dev-tools-faucet"],

    "Transaction Lifecycle": ["dev/dev-txn-signing","dev/dev-txn-broadcasting","dev/dev-txn-polling","dev/dev-txn-confirmation",
    "dev/dev-txn-receipt"],
  },
  MinersSidebar: {
    "Miners":["miners/mining-getting-started","miners/mining-zilclient","miners/mining-zilminer","miners/mining-proxy",
    "miners/mining-additional-info"]
  },
  ExchangesSidebar: {
    "Exchange Integration":["exchanges/exchange-getting-started","exchanges/exchange-account-management",
    "exchanges/exchange-sending-transactions","exchanges/exchange-tracking-deposits","exchanges/exchange-transaction-receipts"],

    "Staked Seed Nodes Integration":["exchanges/staking-introduction","exchanges/staking-getting-started","exchanges/staking-ssn-operations",
    "exchanges/staking-ssn-maintenance", "exchanges/staking-faq"]
  },
  ContributorsSidebar: {
    "Contributors":["contributors/contribute-buildzil","contributors/contribute-guidelines","contributors/contribute-standards",
    "contributors/contribute-bug-bounty"],

    "Core Protocol Design":[
    {"Design Overview":["contributors/core-node-operation"]}, 
    {"Consensus Layer":["contributors/core-consensus","contributors/core-multisignatures"]},
    {"Network Layer":["contributors/core-gossip","contributors/core-broadcasting","contributors/core-blacklist","contributors/core-messaging-limits"]},
    {"Messaging Layer":["contributors/core-message-dispatch","contributors/core-message-queues"]},
    {"Data Layer": ["contributors/core-incremental-db"]},
    {"Directory Service": ["contributors/core-ds-mimo","contributors/core-ds-reputation"]},
    {"Lookup": ["contributors/core-websocket-server","contributors/core-transaction-dispatch","contributors/core-multipliers"]},
    {"Mining": ["contributors/core-pow","contributors/core-difficulty-adjustment","contributors/core-por","contributors/core-coinbase","contributors/core-global-gas-price"]},
    {"Mitigation Measures": ["contributors/core-guard-mode","contributors/core-rejoin-mechanism","contributors/core-view-change",
    "contributors/core-diagnostic-data","contributors/core-status-server"]}
  ]
  },
};