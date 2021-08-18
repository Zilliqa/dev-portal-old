---
id: contribute-guidelines
title: Contribution Guidelines
keywords:
  - development
  - guidelines
description: Development guidelines for contributing to Zilliqa core.
---

---

## Development Process

We keep our development process fairly simple and enforce any hard rules through automation.

Before beginning, please familiarize yourself with these documents:

1. [Code of Conduct](https://github.com/Zilliqa/Zilliqa/blob/master/CODE_OF_CONDUCT.md)
1. [Coding Style](https://github.com/Zilliqa/Zilliqa/blob/master/CODING_STYLE.md)
1. [Coding and Review Guidelines](https://github.com/Zilliqa/Zilliqa/blob/master/CONTRIBUTING.md)

These are the basic things to consider when contributing to the project:

1. The `master` branch is the main development branch of the Zilliqa repository. All new work must be created on a new branch off of the `master` branch.
1. When compiling code changes, use `./build.sh style` instead of just `./build.sh` in order for clang-format to automatically fix the code formatting.
1. Write or perform any tests for your code changes. The different supported tests are described in the [section](#testing) below.
1. When submitting a pull request, fill in the details requested in the [template](https://github.com/Zilliqa/Zilliqa/blob/master/.github/PULL_REQUEST_TEMPLATE.md).

## CI/CD Pipeline and Release Management

Pull requests must get approval from at least 2 reviewers before they can be merged into the `master` branch.

Additionally, pull requests must pass the automated checks on the code changes. These are done by Travis CI build jobs along both the branch and the merge with `master`. These checks include:

1. Code build
1. clang-format
1. clang-tidy
1. Code coverage

New releases are periodically created, and these can be accessed by checking out release tags (e.g., `git checkout tags/v6.2.0`).
These releases are accompanied by [release notes](https://github.com/Zilliqa/Zilliqa/releases) detailing the fixes, improvements, and any new features.

Releases are also automatically made available as Docker images on our [Docker Hub repository](https://hub.docker.com/repository/docker/zilliqa/zilliqa).
Node operators who are not on our officially supported operating systems may choose to run their nodes on these images instead.

## Testing

There are several ways to test out the core protocol:

1. Writing [unit tests](https://github.com/Zilliqa/Zilliqa/tree/master/tests) targeted at specific parts of the code. Most unit tests are executed as part of the CI/CD pipeline to ensure non-regression.
1. Booting up a [local testnet](https://github.com/Zilliqa/Zilliqa#boot-up-a-local-testnet-for-development) to simulate the Zilliqa network on a local machine.
1. Launching a cloud-based testnet that approximates the actual Zilliqa Mainnet. Currently this method is available only to the Zilliqa Research team. Please coordinate with the team should your code changes require testing using this method.
