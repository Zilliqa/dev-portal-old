---
id: dev-env-testnet
title: Testnet
---

---

## Developer Testnet

|          | URL(s) |
|:---------|:-------|
| **API URL** | `https://dev-api.zilliqa.com/` |
| **Block Explorer** | [**Link**](https://dev-explorer.zilliqa.com) |
| **Faucet** | [**Link**](https://dev-wallet.zilliqa.com) |
| **WebSocket endpoint** | wss://dev-ws.zilliqa.com |


The rest of the section contains operational scripts for running testnets on Kubernetes clusters running on AWS cloud.

## Features

- [x] Easy-to-start working environment setup using Vagrant
- [x] Kops workflow for managing small cluster (<200) and production-ready high-availability cluster (1000+)
- [x] Automatic generated Kubernetes manifest and scripts for testnet running (via `bootstrap.py`)
- [x] Cluster sharing (via `kops/3_export_kubeconfig.sh` with cluster short name)
- [x] Testnet sharing (via `boostrap.py` with same options and name)
- [x] Third-party service integration
  - [x] Datadog monitoring for master nodes in the cluster (additional setup required)
- [x] Production-ready testnet
  - [x] AWS Load-balancer support (default to http)
  - [x] Legitimate https certificate for load-balancers (use `--staging-https` or `--production-https`)
  - [x] Up to 1000 nodes using host network mode (use `--host-network` to enable)
  - [x] Testnet nodes scheduling based on instance type (available when use manifest-based cluster) 

## Prerequisite

A virtual-machine based working environment is provided via Vagrant, offering faster and eaiser setup for **first-time** user. All the dependencies (`kops`, `kubectl`, `docker`, and `awscli`) are included in the `Vagrantfile`.

Here's a **quick start** for Ubuntu 16.04 users to get the Vagrant VM ready. 

1. Install vagrant and virtualbox

```bash
sudo apt install vagrant virtualbox
```

2. Clone this repository
```bash
git clone git@github.com:Zilliqa/testnet.git
cd testnet
```

3. Provision the VM.
```
vagrant up --provision
```

4. Setup AWS credentials, read this AWS [doc](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) to get your AWS access credentials

```console
$ vagrant ssh
Welcome to Ubuntu 16.04.5 LTS (GNU/Linux 4.4.0-139-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

7 packages can be updated.
6 updates are security updates.

New release '18.04.1 LTS' available.
Run 'do-release-upgrade' to upgrade to it.


Last login: Tue Nov 20 13:26:01 2018 from 10.0.2.2
vagrant@ubuntu-xenial:/vagrant$ aws configure
AWS Access Key ID [None]: ****************
AWS Secret Access Key [None]: ****************
Default region name [None]: us-west-2
Default output format [None]:
```

If there are any errors during the provision, try the following methods
- suspend (`vagrant suspend`) or halt (`vagrant halt`) the VM and run Step 3 "**Provision the VM**" again
- or, destory (`vagrant destroy`) the VM and star over from the beginning.

> :exclamation: **Warning**: The following directories or files on your host machines are copied or synced to the VM
> - Current working directory `.` is synced to VM's `/vagrant`
> - `~/.ssh/id_rsa` is copied to `/home/vagrant/.ssh/id_rsa` (if you are using a different key for Github access, copy it manually)

Alternatively, if you prefer running everything on your host machine, you can still try the hard way.
- [kubectl 1.10.6](https://github.com/kubernetes/kubectl) ([install](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-binary-via-native-package-management))
- [docker](https://www.docker.com/) ([install](https://docs.docker.com/install/) and [post-install](https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user))

## Getting Started

If you choose the Vagrant approach and have provisioned the VM, you can use the following commands:
- `vagrant up` to start/resume the VM
- `vagrant ssh` to enter the VM
- `vagrant suspend` to save the state and suspend the VM
- `vagrant status` to check the current state of the VM

Once you have the working environment ready using Vagrant VM or on you host machine, you can continue with the following steps:

1. [Getting a Kubernetes cluster](#getting-a-kubernetes-cluster)
2. [Getting a full-fledged testnet](#getting-a-full-fledged-testnet)
3. [Debugging the testnet](#debugging-the-testnet)

### Getting a Kubernetes cluster

You can choose to use an existing Kubernetes cluster or launch a new cluster.

#### Option 1: Using an existing cluster

Typically the admin of the cluster will provide a [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file with all the cluster access details.
The simplest way is to put it at `~/.kube/config` or properly store multiple according to [this](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

<details>
<summary>Here is an example of kubeconfig</summary>

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <redacted>
    server: https://1.1.1.1:443
  name: k8s-cluster
contexts:
- context:
    cluster: k8s-cluster
    user: admin
  name: k8s-context
current-context: k8s-context
kind: Config
preferences: {}
users:
- name: admin
  user:
    as-user-extra: {}
    # used for kubernetes dashboard login
    password: Ykf8Esxd8sieWHneOdWdCsBCyOE8GyNp
    username: admin
```

</details>

#### Option 2: Launching a new cluster

##### Step 1: Genearting a cluster directory with `bootstrap.py --cluster-mode=true`

Run `bootstrap.py --cluster-mode true` with other cluster options to generate a cluster directory. Three different grades (development, preview, and production) of clusters are supported through the option `--cluster-grade`, which helps to decide the detailed specification for the cluster.

* Generate the directory for a development cluster with random name, specified name (e.g., `apple`), or more worker machines
    ```bash
    # dev cluster, named random string, 25 worker machines
    ./bootstrap.py --cluster-mode true
    # dev cluster, named `apple`, 25 worker machines
    ./bootstrap.py apple --cluster-mode true
    # dev cluster, named `apple`, 100 worker machines
    ./bootstrap.py apple --cluster-mode true --worker-machine 100
    ```

* Generate the directory for a preview cluster with more control on machines

    ```bash
    ./bootstrap.py --cluster-mode true --cluster-grade pre --worker-machine 100 --lookup-machine 20
    ```

Some important options for cluster-mode:
- `--host-network`: Configure the cluster to allow host-network for testnet. Default to `false`.
- `--monitoring`: Install monitoring addons for the cluster, whici can be accessed after testnet bootstrapping via `./testnet.sh dashboard`. Default to `false`.


The different between `development`, `preview` and `production` grade clusters are listed here.

| node type | development | preview | production |
| - | - | - | - |
| master node | (`c5.xlarge` ~ `c5.9xlarge`) | `c5.18xlarge` | `c5.18xlarge` |
| shard node | `t2.medium` | `t2.medium` | `t2.medium` |
| web node | `t2.medium` | `m5.large` | `m5.xlarge` |
| DS guard node | N/A | `t2.medium` | `m5.xlarge` |
| multiplier node | N/A | `m5.large` | `m5.xlarge` |
| lookup node | N/A | `m5.large` | `m5.4xlarge` | 
| seed node | N/A | `m5.large` | `m5.2xlarge` |
| lookup node (hidden) | N/A | `m5.large` | `m5.2xlarge` |

Here are the parameters used for setting the number of machines used. Note that some of node type will share the same machine parameter.

| node type | development | preview | production |
| - | - | - | - |
| master node | 1 | 1 | 3 |
| shard node | `--worker-machine` | `--worker-machine`| `--worker-machine` |
| web node | `--network-io-machine` | `--network-io-machine` | `--network-io-machine` |
| DS guard node | N/A | `--ds-guard-machine` | `--ds-guard-machine` |
| multiplier node | N/A | `--network-io-machine` | `--network-io-machine` |
| lookup node | N/A | `--lookup-machine` | `--lookup-machine` | 
| seed node | N/A | `--internal-lookup-machine` | `--internal-lookup-machine` |
| lookup node (hidden) | N/A | `--internal-lookup-machine` | `--internal-lookup-machine` |

##### Step 2: Running your cluster

Once you have the generated cluster directory, you can simply launch the cluster through

```
./cluster.sh up
```

or terminate it

```
./cluster.sh down
```

### Getting a full-fledged testnet

Firstly, run `kubectl cluster-info` to verify your access to the Kubernetes cluster you launched or configured. Then, run the steps below. 

#### Step 1: Generating a testnet directory with `bootstrap.py`

Simply run `./bootstrap.py`.

You can use most of the default options there for small-scale testnet, but you should specify the zilliqa image you want to test. For example, if you want to test a specific zilliqa version (`f2d4a8a` or `f2d4a8aed74851f3f0acaa9724878257eb6c4ee5`), there are two ways of doing this:

- Use `-c,--commit` to set the commit SHA1

  ```bash
  # use short format
  ./bootstrap.py -c f2d4a8a
  # ues long format
  ./bootstrap.py -c f2d4a8aed74851f3f0acaa9724878257eb6c4ee5
  ```

-  Not only use `-c,--commit` to set SHA1, but also use `-i,--image` to overwrite the image URL

  ```bash
  # only short format
  ./bootstrap.py -c f2d4a8a -i 648273915458.dkr.ecr.us-west-2.amazonaws.com/zilliqa:f2d4a8a
  ```

> Note: You have to run [`scripts/make_image.sh`](https://github.com/Zilliqa/Zilliqa/blob/master/scripts/make_image.sh) from core repository before you can use the image.

<details>
<summary> All options of bootstrap.py are here</summary>

```
❯ ./bootstrap.py -h
usage: bootstrap.py name [-n num] [-d num] [-l num] [-a num] [-c commit]

bootstrap a small/large testnet

positional arguments:
  NAME                  testnet name (default: 5-letter random string)

optional arguments:
  -h, --help            show this help message and exit

Testnet Specification:
  -t small/large, --template small/large
                        template folder selection (default: small)
  -n INTEGER            number of normal nodes (default: 20)
  -d INTEGER            number of ds nodes within normal nodes (default: 10)
  -l INTEGER            number of lookup nodes (default: 1)
  -a INTEGER            number of archival nodes (default: 1)
  -p PORT, --port PORT  the host network port used for zilliqa app (default:
                        30303 or 32768-65535 when in host network mode)

Tesntet Image:
  To reference the Zilliqa image version in testnet, -c is required. In
  addition, you may use -i to overwrite the image URL however -c is still
  needed in fetching constants.xml

  -c COMMIT, --commit COMMIT
                        Set the commit SHA1 from
                        https://github.com/Zilliqa/Zilliqa.
  -i IMAGE, --image IMAGE
                        Set the image URL

Testnet features:
  --gentxn {true, false}
                        enable/disable gentxn (default: true)
  --recovery {true, false}
                        enable/disable recovery (default: false)
  --daemon {true, false}
                        enable/disable daemon monitoring zilliqa process
                        (default: false)
  --wallet {true, false}
                        enable/disable wallet (default: false)
  --scilla-wallet {true, false}
                        enable/disable scilla wallet (default: false)
  --host-network {true, false}
                        enable/disable host network mode for testnet (default:
                        false)
  --https {aws.z7a.xyz,aws.zilliqa.com}
                        use https and select domain in ELB urls
  --elb-logs {true, false}
                        enable/disable elb access logging in S3 bucket "elb-
                        logs.k8s.z7a.xyz"
  --clusters CLUSTER1,CLUSTER2,...
                        set the list of clusters, in which the first will be
                        primary and the rest will be secondary
  --lookup-multiplier {true, false}
                        enable/disable lookup multiplier and level-2 lookup

Miscellaneous:
  --genkeypair GENKEYPAIR
                        path to genkeypair binary
  -f, --force           skip checking the latest master
```
</details>

#### Step 2: Running your testnet in the testnet directory

The testnet directory contains `configmap/`, `manifest/` and a single script `testnet.sh`.

```
.
├── configmap          # a dir to be mounted to `/etc/zilliqa` in the container
│   ├── constants.xml  # copied from template (small/large)
│   ├── constants.xml.1fb077b         # fetched from the commit 1fb077b
│   ├── constants_local.xml.1fb077b   # fetched from the commit 1fb077b
│   ├── keys.txt
│   └── init.py
├── manifest           #
│   ├── explorer.yaml
│   ├── lookup.yaml
│   ├── new.yaml
│   ├── normal.yaml
│   ├── scilla-wallet.yaml
│   ├── services.yaml
│   └── wallet.yaml
└── testnet.sh
```

In `configmap/`, the file `constants.xml` is generated by the scripts and will be used when running the zilliqa node in containers. There are also two reference constants file fetched from the commit you specified through `-c,--commit`.

In `manifest/`, each `.yaml` file contains a component of the testnet. Note that `services.yaml` is fundamental and needed by most of other components.

The single script `testnet.sh` wraps most of the `kubectl` commands and provide handy subcommmands for testnet management.

```
❯ ./testnet.sh
Usage: ./testnet.sh subcommand [ARGS]

Available subcommands:

    up              bring up all the components for testnet
    down            tear down all the components for testnet
    reload          reload the configmap from local
    restart         restart the nodes without affecting other components
    new             launch new nodes
    create          create configmap/ or manifest/*.yaml
    delete          delete configmap/ or manifest/*.yaml
    force-delete    force delete configmap/ or manifest/*.yaml

    ssh             get ssh access into zilliqa nodes
    logs            get kubernetes logs of zilliqa nodes
    who             find out who is using the IP
    where           find out where are the pods running

    all             show the testnet components status
    status          show the testnet nodes status
    url             show the testnet urls
    dashboard       show the kuberentes dashboard and credentials

    sync-primary    get the necessary information from primary testnet
```

Here are some most-frequently-used subcommands for changing the testnet status.

- `./testnet.sh up` to launch the testnet with all the components
- `./testnet.sh down` to fully delete the testnet
- `./testnet.sh reload` after you edit anything in `configmap/`
- `./testnet.sh restart` to only restart the zilliqa nodes (not other componenets)
- `./testnet.sh new N` to launch N new nodes after the testnet is running

And a few commands for read-only options

- `./testnet.sh all` to show the status of all the components
- `./testnet.sh status` to show the status of all the zilliqa nodes
- `./testnet.sh status --epoch` to show the latest epoch number on each node
- `./testnet.sh status --recovery` to show the recovery time on each node
- `./testnet.sh url` to show all the load-balancer urls

If you prefer GUI, login in the Kubernetes Web dashbaord using the url and credentials from `./testnet.sh dashboard`

```
❯ ./testnet.sh dashboard
dashboard: https://api.cluster.k8s.z7a.xyz/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/#!/search?namespace=default&q=work
username: admin
password: 48VyHgOsW6wS9oRYEBFY7KXBY0andakL
```

For advanced users, you can use `./testnet.sh create|delete|force-delete` to invidually create or delete either the `configmap` or the components in `manifest/`.

### Debugging the testnet

#### Debugging Kubernetes componenets

<details>
<summary>
Here's an example output of `./testnet.sh all`
</summary>

```
❯ ./testnet.sh all
NAME                                  READY     STATUS     RESTARTS   AGE
pod/jeacm-explorer-7b9445cfc9-z6fnr   0/1       Init:0/1   0          2m
pod/jeacm-lookup-0                    2/2       Running    0          2m
pod/jeacm-normal-0                    2/2       Running    0          2m
pod/jeacm-normal-1                    2/2       Running    0          2m
pod/jeacm-normal-10                   2/2       Running    0          2m
pod/jeacm-normal-11                   2/2       Running    0          2m
pod/jeacm-normal-12                   2/2       Running    1          2m
pod/jeacm-normal-13                   2/2       Running    0          2m
pod/jeacm-normal-14                   2/2       Running    1          2m
pod/jeacm-normal-15                   2/2       Running    0          2m
pod/jeacm-normal-16                   2/2       Running    0          2m
pod/jeacm-normal-17                   2/2       Running    1          2m
pod/jeacm-normal-18                   2/2       Running    0          2m
pod/jeacm-normal-19                   2/2       Running    0          2m
pod/jeacm-normal-2                    2/2       Running    0          2m
pod/jeacm-normal-3                    2/2       Running    0          2m
pod/jeacm-normal-4                    2/2       Running    0          2m
pod/jeacm-normal-5                    2/2       Running    0          2m
pod/jeacm-normal-6                    2/2       Running    0          2m
pod/jeacm-normal-7                    2/2       Running    0          2m
pod/jeacm-normal-8                    2/2       Running    0          2m
pod/jeacm-normal-9                    2/2       Running    0          2m
pod/jeacm-wallet-5cd48fdd97-mxv24     0/1       Init:0/1   0          2m

NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP        PORT(S)          AGE
service/jeacm            ClusterIP      None             <none>             30303/TCP        2m
service/jeacm-api        LoadBalancer   100.64.150.112   ae4924e507b8c...   4201:32085/TCP   2m
service/jeacm-explorer   LoadBalancer   100.68.113.147   ae4b3df2e7b8c...   80:30859/TCP     2m
service/jeacm-wallet     LoadBalancer   100.64.227.229   ae53303447b8c...   80:31719/TCP     2m

NAME                                        DESIRED   CURRENT   READY     AGE
replicaset.apps/jeacm-explorer-7b9445cfc9   1         1         0         2m
replicaset.apps/jeacm-wallet-5cd48fdd97     1         1         0         2m
```
</details>

When you see the resources are having abnormal `STATUS` (e.g., `Init:0/1`) or in the state of not `READY` (e.g., `1/2`), you can check their logs via `./testnet.sh logs TYPE INDEX`

```bash
# check the log of the 0th lookup node
./testnet.sh logs lookup 0

# check the log of the 18th normal node
./testnet.sh logs normal 0
```

#### Debugging within the container

If you want to get in the node for further debugging, just run `./testnet.sh ssh TYPE INDEX`.

```
# ssh into the 0th lookup node 
./testnet.sh ssh lookup 0

# ssh into the 18th normal node
./testnet.sh ssh normal 18
```