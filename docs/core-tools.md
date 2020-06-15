---
id: core-tools
title: Tools
---
## NAT Resolver

As a result of IPv4 address scarcity, most home internet gateway devices (IGD) such as “home routers” and “switches” use network address translation (NAT) to map a public IP address assigned by the internet service provider (ISP) to a private network such as a local area network (LAN).

![image01](core/features/nat-resolver/image01.png)

This means that a node behind such devices will be assigned a private IP address and the gateway will route the traffic to and fro the outside world. As such, external nodes in the Internet are unable to route messages to node before devices with NAT. For instance, in the diagram below, when Alice wants to route a message to `192.168.1.101:12345`, Alice is unable to do so.

![image02](core/features/nat-resolver/image02.png)

One could manually specify a rule on the IGD to route network traffic received on one port to one of the devices in the LAN. For instance, one rule can be such that any message going to `177.66.55.44:12345` will be forwarded to `192.168.1.101:12345`. This is known as port forwarding.

Other than manual port forwarding, applications supporting universal plug and play (UPnP) can make use of the network protocol of UPnP to automatically get a mapping of router port(s) to their own port(s). Supporting UPnP is important for Zilliqa nodes, as it allows nodes behind IGD to join and communicate within the Zilliqa network.

We have recently implemented and merged support for UPnP via the use of MiniUPnP library. We have the implemented the following:

1. Use UPnP to get a direct port mapping from the IDG (Port n to Port n)
1. If direct port mapping fails, the node will attempt to map to 10 random ports on the IGD for 10 times
1. If this fails, the node will ask the IGD to return a port suitable for the mapping
1. In addition, we also added valid port checking and removed dangling mapping before attempting to get the mapping

NAT is a simple tool which allows nodes behind routers to join the network. Nodes behind routers have a different global IP and local IP. It builds a mapping from a particular port in the router to a particular port in a specific machine connected to it. This mapping allows to automatically forward data sent to a particular port of a router to the `[ local IP : port ]` of a node.

![image03](core/features/nat-resolver/image03.png)

## Profiling Zilliqa and Scilla

This tutorial shows how to profile Zilliqa and Scilla together in a C++ unit test that executes smart contract.

<!-- TOC depthTo:2 -->

- [Requirements](#requirements)
- [Step 0: Setup environment](#step-0-setup-environment)
- [Step 1: Update Zilliqa and Scilla source code](#step-1-update-zilliqa-and-scilla-source-code)
- [Step 2: Run the profiling script](#step-2-run-the-profiling-script)
- [Step 3: View the profiling result](#step-3-view-the-profiling-result)
- [More](#more)
- [References](#references)

<!-- /TOC -->

### Requirements

Ensure you have an Ubuntu OS (16.04 onwards, other OSes are not yet tested).

```console
$ lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 16.04.3 LTS
Release:        16.04
Codename:       xenial
```

Install [`speedscope`](https://github.com/jlfwong/speedscope) on your machine.

```bash
npm install -g speedscope
```

Get the script `profile.sh` and enter the repository directory.

```bash
git clone https://gist.github.com/Gnnng/e6ae97b2ce31d8f65c8c94a48a95ce94 profile
cd profile
```

### Step 0: Setup environment

You can choose to run the profiling on your machine or in a docker container.

> Using a container saves your time on setting up build environments for Zilliqa and Scilla and also provides an isolated context when running profiling. However, it does not mean any security as it will run in privilege mode for necessary permissions. Also, it might incur unexpected overhead on performance. So the recommendation is starting with the container solution for learning but using the native solution for reliable result.

#### Caveat

Some kernel changes are required to run `perf` properly, please be aware of these system-level change and keep the original values if you want to restore the settings. The command `./profile.sh setup` will run these commands to change the kernel settings.

```bash
sysctl -w kernel.perf_event_paranoid=-1
echo 0 | tee /proc/sys/kernel/kptr_restrict
```

#### Run in container

Start the container using the following command.

```bash
./profile.sh docker
```

Inside the container, run:

```bash
./profile.sh setup
```

#### Run on your machine

Set the directories variables according to your configuration. These are the path to code repositories. Also, make sure you install the build dependencies following the documentation in Zilliqa and Scilla.

```bash
export ZILLIQA_DIR=/the/path/of/zilliqa/directory
export SCILLA_DIR=/the/path/of/scilla/directory
```

Setup your environment for profiling.

```bash
sudo ./profile setup
```

### Step 1: Update Zilliqa and Scilla source code

Remember to update the code to the version you desired to profile. You can modify the source code directly in the referenced code repository. In this tutorial, some changes in Zilliqa are already being made on the branch `feature/perf`.

Let's checkout the branch in Zilliqa repository (e.g., `/zilliqa` in docker).

```cpp
git checkout feature/perf
```

If you are in the container environment, the code repository in `/zilliqa` is a shallow copy. You will need to run this first before checking out a remote branch.

```bash
git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
git fetch
```

You can also make code change in Scilla repository if you need.

### Step 2: Run the profiling script

Go back to the directory with `profile.sh` and just run:

```bash
./profile.sh run
```

The command `profile.sh run` is a simple wrapper that does the following tasks.

1. Enable smart contract
2. Build Zilliqa test case
3. Build Scilla
4. Profile using `perf`

It calls the unit test located in `tests/`. The default one used here is `Test_Contract` on the branch `feature/perf`, which calls `scilla-runner` to execute a smart contract.

After it finishes, you will see the generated profiling result `cputime.perf`.

### Step 3: View the profiling result

Simply run:

```bash
speedscope cputime.perf
```

> If you are using containers, run this command directly on your machine.

It will open your browser for you. You can find more about how to use it in `speedscope` documentation.

![speedscope](core/tools/profiling/speedscope.png)

### More

#### Tweaking the scripts

The script `profile.sh` is simple, change it for your need.

- `frequency`: This determines the sampling frequency of `perf`.

#### Resolving missing symbols

If you see things like `[unknown]` in the profiling result or the stack simply does not make sense, try the following fixes:

1. Re-compile Zilliqa and its dependency (e.g. `g3log`, `libjsoncpp`) with this gcc flag `-fno-omit-frame-pointer`.
2. Add debug symbols to both Zilliqa (e.g. inserting `-g` complier flag  or using Debug build) and Scilla (see this [tip](https://github.com/Zilliqa/scilla/wiki/Profiling-Scilla-:-Tips)).
3. Switch OCaml compiler to the version with frame pointer enabled as per [this doc](https://ocaml.org/learn/tutorials/performance_and_profiling.html#Using-perf-on-Linux).

### References

- [Speedscope](https://github.com/jlfwong/speedscope)
- [Using perf to profile Ocaml](https://ocaml.org/learn/tutorials/performance_and_profiling.html#Using-perf-on-Linux)
- [Install debug symbol packages](https://wiki.ubuntu.com/Debug%20Symbol%20Packages)
- [Fixing Stack Traces](http://www.brendangregg.com/perf.html#StackTraces)

## Zilliqa Daemon

### Background

Use Zilliqa daemon as the control point of all kinds of nodes. It will take the responsibility to launch the Zilliqa process and other auxiliary processes. The daemon can be used by community members too, they don’t need to manually restart the Zilliqa process if the Zilliqa process crashed.

### Zilliqa Daemon Process Design Change

1. It needs to get all the input parameters for Zilliqa process, so it can use them to launch the Zilliqa process.
1. After daemon started, it will check if Zilliqa process started, if not, it will start the Zilliqa process. The old behavior is if the Zilliqa process is not started, it waits for Zilliqa process to start.
1. Save the launch parameters into log file so can check later.
1. Following scripts should be launched after zilliqa process launched:  
    (1). scripts/uplaodIncrDB.py (only in lookup-0)  
    (2). scripts/auto_back_up.py (only in lookup-0)

### Testnet Repo Change

1. The bootstrap procedure of launching zilliqa should be removed (in bootstrap.py, and template/init.py)
1. The launched process of uploadIncrDB.py/auto_back_up.py should be removed (in template/init.py)
1. The template of launch.sh and launch_docker.sh both need to change. They will launch Zilliqa daemon process instead of Zilliqa process

### Upgrade Change

1. Currently we used some hacky way for upgrading, that is, only replace the zilliqa image inside the pod. And yaml also need to be updated after all nodes upgrade are done.
1. In the new approach, we should re-implement the upgrading to pod-image based replacement, with updated persistence from other nodes (S3).
1. Recovery implementation keeps the same, while using daemon & SUSPEND_LAUNCH to re-launch ZIlliqa process.

### Verify the change

1. Launch a small scale testnet to check the status
1. Kill Zilliqa process in random nodes, see if it can rejoin the testnet.
1. Recover lookup, dsguard and shard node
1. Recover community testnet
1. Rolling upgrade