module.exports = {
  BasicsSideBar: {
    "Blockchain Basics": ["basics/basics-intro-blockchain", "basics/basics-intro-consensus", "basics/basics-intro-accounts",
      "basics/basics-intro-txns", "basics/basics-intro-gas"],

    "Zilliqa Architecture": ["basics/basics-zil-nodes", "basics/basics-zil-sharding", "basics/basics-zil-consensus",
      "basics/basics-zil-schnorr-signatures", "basics/basics-zil-reward", "basics/basics-zil-contract", "basics/basics-zil-gas"]
  },
  APIsSideBar: {
    "Introduction": ["apis/api-introduction"],
    "Blockchain-related Methods": ["apis/api-blockchain-ds-block-listing",
      "apis/api-blockchain-get-blockchain-info",
      "apis/api-blockchain-get-current-ds-epoch",
      "apis/api-blockchain-get-current-mini-epoch",
      "apis/api-blockchain-get-ds-block",
      "apis/api-blockchain-get-ds-block-rate",
      "apis/api-blockchain-get-latest-ds-block",
      "apis/api-blockchain-get-latest-tx-block",
      "apis/api-blockchain-get-miner-info",
      "apis/api-blockchain-get-network-id",
      "apis/api-blockchain-num-ds-blocks",
      "apis/api-blockchain-get-num-tx",
      "apis/api-blockchain-get-num-tx-blocks",
      "apis/api-blockchain-get-prev-difficulty",
      "apis/api-blockchain-get-prev-ds-difficulty",
      "apis/api-blockchain-get-total-coin-supply",
      "apis/api-blockchain-get-tx-rate",
      "apis/api-blockchain-get-tx-block",
      "apis/api-blockchain-get-tx-block-rate",
      "apis/api-blockchain-tx-block-listing"],

    "Transaction-related Methods": ["apis/api-transaction-create-tx",
      "apis/api-transaction-get-minimum-gas-price",
      "apis/api-transaction-get-num-txns-dsepoch",
      "apis/api-transaction-get-num-txns-txepoch",
      "apis/api-transaction-get-recent-txs",
      "apis/api-transaction-get-tx",
      "apis/api-transaction-get-transaction-status",
      "apis/api-transaction-get-txs-for-txblock",
      "apis/api-transaction-get-txs-for-txblock-ex",
      "apis/api-transaction-get-txbodies-for-txblock",
      "apis/api-transaction-get-txbodies-for-txblock-ex"],

    "Contract-related Methods": ["apis/api-contract-get-contractaddress-from-txid",
      "apis/api-contract-get-smartcontract-code",
      "apis/api-contract-get-smartcontract-init",
      "apis/api-contract-get-smartcontracts",
      "apis/api-contract-get-smartcontract-state",
      "apis/api-contract-get-smartcontract-substate",
      "apis/api-contract-get-state-proof"],

    "Account-related Methods": ["apis/api-account-get-balance"]
  },
  DevelopersSidebar: {

    "Getting Started": ["dev/dev-started-introduction", "dev/dev-started-helloworld", "dev/dev-started-env"],
    "Upgrade Notices": ["dev/dev-upgrade-v8"],

    "User Key Management": ["dev/dev-keys-introduction", "dev/dev-keys-zilpay", "dev/dev-keys-pkey", "dev/dev-keys-zrc2-wallet-support", "dev/dev-keys-magic"],

    "Developer Toolings": ["dev/dev-tools-ceres", { "SDKs": ["dev/dev-tools-zilliqajs", "dev/dev-tools-gozilliqa", "dev/dev-tools-java", "dev/dev-tools-sdks"] },
      "dev/dev-tools-websockets", "dev/dev-tools-cli", "dev/dev-tools-ide", "dev/dev-tools-explorer", "dev/dev-tools-faucet"],

    "Other Developer Information": ["dev/dev-wrapped-zil"],

    "Transaction Lifecycle": ["dev/dev-txn-signing", "dev/dev-txn-broadcasting", "dev/dev-txn-polling", "dev/dev-txn-confirmation",
      "dev/dev-txn-receipt"],

    "Educational Resources": [
      "dev/dev-education-videos",
      { "Sample app – RentOnZilliqa": ["dev/dev-rentonzilliqa-introduction", { "Scilla Contract": ["dev/dev-rentonzilliqa-contract", "dev/dev-rentonzilliqa-library", "dev/dev-rentonzilliqa-mutable-variables", "dev/dev-rentonzilliqa-procedures", "dev/dev-rentonzilliqa-transitions"] }, { "Frontend Application": ["dev/dev-rentonzilliqa-frontend", "dev/dev-rentonzilliqa-components", "dev/dev-rentonzilliqa-scripting", "dev/dev-rentonzilliqa-modals", "dev/dev-rentonzilliqa-pages"] }] },
    ]
  },
  MinersSidebar: {
    "Miners": ["miners/mining-getting-started", "miners/mining-zilclient", "miners/mining-zilminer", "miners/mining-proxy",
      "miners/mining-additional-info"]
  },
  ExchangesSidebar: {
    "Exchange Integration": [
      { "Getting Started": ["exchanges/exchange-getting-started", "exchanges/exchange-ip-whitelisting", "exchanges/exchange-key-whitelisting-1", "exchanges/exchange-key-whitelisting-2"] },
      "exchanges/exchange-account-management",
      "exchanges/exchange-sending-transactions",
      "exchanges/exchange-tracking-deposits",
      "exchanges/exchange-transaction-receipts",
      "exchanges/exchange-managing-zrc2-tokens"],
    "Rosetta": [
      { "Introduction": ["exchanges/rosetta-introduction", "exchanges/rosetta-unsupported-api", "exchanges/rosetta-setting-up-seed-node", "exchanges/rosetta-setting-up-no-seed-node"] },
      {
        "Data API": [{
          "Network": [
            "exchanges/rosetta-data-network-list",
            "exchanges/rosetta-data-network-options",
            "exchanges/rosetta-data-network-status"],
          "Account": ["exchanges/rosetta-data-account-balance"],
          "Block": [
            "exchanges/rosetta-data-block",
            "exchanges/rosetta-data-block-transaction"],
        }]
      },
      {
        "Construction API": [
          "exchanges/rosetta-construction",
          "exchanges/rosetta-construction-derive",
          "exchanges/rosetta-construction-preprocess",
          "exchanges/rosetta-construction-metadata",
          "exchanges/rosetta-construction-payloads",
          "exchanges/rosetta-construction-parse",
          "exchanges/rosetta-construction-combine",
          "exchanges/rosetta-construction-hash",
          "exchanges/rosetta-construction-submit",
        ]
      }
    ]
  },
  StakingSidebar: {
    "Zilliqa Seed Node Staking": ["staking/staking-overview", "staking/staking-disclaimer"],
    "Staking Phase 1.1": [
      "staking/phase1/staking-phase11-notice",
      "staking/phase1/staking-phase1-overview",
      "staking/phase1/staking-general-information",
      {
        "Delegators":
          ["staking/phase1/delegator/staking-delegator-overview",
            "staking/phase1/delegator/staking-delegator-reading-contract-states",
            "staking/phase1/delegator/staking-delegator-operations",
            "staking/phase1/delegator/staking-delegator-gzil"]
      },
      {
        "SSN Operators": [
          "staking/phase1/ssn-operator/staking-ssn-before-you-start",
          "staking/phase1/ssn-operator/staking-ssn-setup",
          "staking/phase1/ssn-operator/staking-ssn-enrollment",
          "staking/phase1/ssn-operator/staking-commission-management",
          "staking/phase1/ssn-operator/staking-ssn-maintenance",
          "staking/phase1/ssn-operator/staking-ssn-upgrading",]
      },

      "staking/phase1/staking-error-codes",
    ],
  },
  ContributorsSidebar: {
    "Contributors": ["contributors/contribute-buildzil", "contributors/contribute-guidelines", "contributors/contribute-standards",
      "contributors/contribute-bug-bounty"],

    "Core Protocol Design": [
      { "Design Overview": ["contributors/core-node-operation"] },
      { "Consensus Layer": ["contributors/core-consensus", "contributors/core-multisignatures"] },
      { "Network Layer": ["contributors/core-gossip", "contributors/core-broadcasting", "contributors/core-blacklist", "contributors/core-messaging-limits"] },
      { "Messaging Layer": ["contributors/core-message-dispatch", "contributors/core-message-queues"] },
      { "Data Layer": ["contributors/core-accounts", "contributors/core-transaction-lifecycle", "contributors/core-incremental-db", "contributors/core-scilla-operation"] },
      { "Directory Service": ["contributors/core-ds-mimo", "contributors/core-ds-reputation"] },
      { "Lookup": ["contributors/core-isolated-server", "contributors/core-websocket-server", "contributors/core-transaction-dispatch", "contributors/core-multipliers"] },
      { "Mining": ["contributors/core-pow", "contributors/core-difficulty-adjustment", "contributors/core-por", "contributors/core-coinbase", "contributors/core-global-gas-price"] },
      {
        "Mitigation Measures": ["contributors/core-guard-mode", "contributors/core-rejoin-mechanism", "contributors/core-view-change",
          "contributors/core-diagnostic-data", "contributors/core-status-server"]
      }
    ]
  },
};