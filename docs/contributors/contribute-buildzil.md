---
id: contribute-buildzil
title: Building Zilliqa
keywords:
  - contribution
  - core
description: Contribution guide for Zilliqa core.
---

---

The Zilliqa core is implemented in C++ and archived in our open-source [Github repository](https://github.com/Zilliqa/Zilliqa/).

Zilliqa Research primarily maintains the code base and moderates contributions from external developers.

While we have made great strides to realize the core protocol that runs the Zilliqa Mainnet, this continues to be a living, breathing endeavour. New features, improvements, and bug fixes are regularly pushed. Contributions from the developer community towards the advancement of this project are always welcome.

## Quickstart Guide

Building the Zilliqa code base is officially supported on Ubuntu 18.04.

Follow these steps to perform the build:

1. Install the required dependencies according to [this section](https://github.com/Zilliqa/Zilliqa/#build-dependencies) in the repository.
1. Clone the [Zilliqa repository](https://github.com/Zilliqa/Zilliqa/).
1. Build the source code according to [this section](https://github.com/Zilliqa/Zilliqa/#build-from-source-code).

When successful, the outputs (including the `zilliqa` binary) will be created in the `build` subfolder of the working directory.

## Next Steps

Once you are able to build the code base, there are several ways you can contribute:

1. Submit code changes as pull requests (please read the [guidelines](contribute-guidelines.md))
1. Submit [proposals](contribute-standards.md) to improve the core protocol design
1. Submit bug reports and feature requests in the [repository issues](https://github.com/Zilliqa/Zilliqa/issues)
1. Submit security-related issues to our [bug bounty program](contribute-bug-bounty.md)

## Contributing to Scilla

A fully functional Zilliqa node also includes the Scilla smart contract interpreter. If you are interested in contributing to that project, please refer to the [Scilla website](https://scilla-lang.org/#getinvolvedsection).

## Resources

These are the available resources that help explain the core protocol:

1. The Zilliqa [whitepaper](https://docs.zilliqa.com/whitepaper.pdf)
1. The [Zilliqa architecture](../basics/basics-zil-nodes.mdx) and [Core protocol design](../contributors/core-node-operation.md) sections
1. The [Zilliqa Improvement Proposals](https://github.com/Zilliqa/ZIP/) repository
1. Monthly updates and tech writeups in the [official blog](https://blog.zilliqa.com/)
1. The developer community channels on our [official Discord server](https://discord.com/invite/XMRE9tt)
