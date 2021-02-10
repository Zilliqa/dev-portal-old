---
id: rosetta-setting-up-no-seed-node
title: Setting up Zilliqa Rosetta connecting to public API endpoint
keywords: 
- rosetta
- middleware
- exchanges
- zilliqa
- rosetta
- setup
- public
- api
- endpoint
- standalone
description: Setting up Zilliqa Rosetta connecting to public API endpoint
---

---

Zilliqa rosetta also provide the option of connecting to public seed node service such `api.zilliqa.com` and `dev-api.zilliqa.com` instead of running seed node on your end. 

## Setup
### Step 1: Download `Zilliqa-rosetta` latest release from https://github.com/Zilliqa/zilliqa-rosetta/releases. 

### Step 2: Build `Zilliqa-rosetta` Docker image from Zilliqa and Scilla source code
```bash
cd rosetta_standalone
sh ./build_standalone.sh .sh
```

### Step 3:Running `Zilliqa-rosetta`
```bash
run_standalone.sh
```

## Maintainance
### Restarting Zilliqa Rosetta
```bash
docker stop <container name>
docker start <container name>
```
