module.exports = {
  someSidebar: {
    "Blockchain Basics": ["basics-intro-blockchain","basics-intro-consensus","basics-intro-accounts","basics-intro-txns",
    "basics-intro-gas"],
    "Zilliqa Architecture": ["basics-zil-nodes","basics-zil-sharding","basics-zil-consensus","basics-zil-schnorr-signatures",
    "basics-zil-reward","basics-zil-contract","basics-zil-gas"]
  },
  someSidebar2: {
    "Getting Started": ["dev-started-introduction","dev-started-helloworld","dev-started-env"],
    "User Key Management": ["dev-keys-introduction","dev-keys-zilpay","dev-keys-pkey"],
    "Toolings for Web3": [{"SDKs":["dev-tools-zilliqajs","dev-tools-gozilliqa","dev-tools-java", "dev-tools-sdks"]},"dev-tools-websockets",
    "dev-tools-cli","dev-tools-ide","dev-tools-explorer","dev-tools-faucet"],
    "Transaction Lifecycle": ["dev-txn-signing","dev-txn-broadcasting","dev-txn-polling","dev-txn-confirmation","dev-txn-receipt"],
  },
  someSidebar3: {
    "Miners":["mining-getting-started","mining-zilclient","mining-zilminer","mining-proxy","mining-additional-info"]
  },
  someSidebar4: {
    "Exchange Integration":["exchange-getting-started","exchange-account-management","exchange-sending-transactions",
    "exchange-tracking-deposits","exchange-transaction-receipts"],
    "Staked Seed Nodes Integration":["staking-introduction","staking-getting-started","staking-ssn-operations","staking-ssn-maintenance",
    "staking-faq"]
  },
  someSidebar5: {
    "Contributors":["contribute-buildzil","contribute-guidelines","contribute-standards","contribute-bug-bounty"],
    "Core Protocol Design":["core-intro", 
    {"Design Overview":["core-node-operation"]}, 
    {"Consensus Layer":["core-consensus","core-multisignatures"]},
    {"Network Layer":["core-gossip","core-broadcasting","core-blacklist","core-messaging-limits"]},
    {"Messaging Layer":["core-message-dispatch","core-message-queues"]},
    {"Data Layer": ["core-incremental-db"]},
    {"Directory Service": ["core-ds-mimo","core-ds-reputation"]},
    {"Lookup": ["core-websocket-server","core-transaction-dispatch","core-multipliers"]},
    {"Mining": ["core-pow","core-difficulty-adjustment","core-por","core-coinbase"]},
    {"Mitigation Measures": ["core-guard-mode","core-rejoin-mechanism","core-view-change","core-diagnostic-data","core-status-server"]}
  ]
  },
};