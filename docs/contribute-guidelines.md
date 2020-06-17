---
id: contribute-guidelines
title: Coding and contribution guidelines
---
## Development process

We keep our development process fairly simple and enforce any hard rules through automation.

Before beginning, please familiarize yourself with these documents:

1. [Code of Conduct](https://github.com/Zilliqa/Zilliqa/blob/master/CODE_OF_CONDUCT.md)
1. [Coding Style](https://github.com/Zilliqa/Zilliqa/blob/master/CODING_STYLE.md)
1. [Coding and Review Guidelines](https://github.com/Zilliqa/Zilliqa/blob/master/CONTRIBUTING.md)

These are the basic things to consider when contributing to the project:

1. The `master` branch is the development branch of the Zilliqa repository. All new work must be created on a new branch off of the `master` branch.
1. When compiling code changes, use `./build.sh style` instead of just `./build.sh` in order for clang-format to automatically fix the code formatting.
1. Write or perform any tests for your code changes. The different supported tests are described in the [section](#testing) below.
1. When submitting a pull request, fill in the details requested in the [template](https://github.com/Zilliqa/Zilliqa/blob/master/.github/PULL_REQUEST_TEMPLATE.md).

## CI/CD pipeline

Most checks 

## Testing

There are several ways to test out the core protocol:

1. Writing [unit tests](https://github.com/Zilliqa/Zilliqa/tree/master/tests) targeted at specific parts of the code. Most unit tests are executed as part of the CI/CD pipeline to ensure non-regression.
1. Booting up a [local testnet](https://github.com/Zilliqa/Zilliqa#boot-up-a-local-testnet-for-development) to simulate the Zilliqa network on a local machine.
1. Launching a cloud-based testnet that approximates the actual Zilliqa Mainnet. Currently this method is available only to the Zilliqa Research team. Please coordinate with the team should your code changes require testing using this method.

## Releases

