# 入门



#### 注意

> Zillings（“ZILs”）的临时Zillings（“临时ZILs”）不能提供、出售或转让给美国人（如1933年美国证券法第S条所定义）。 请确保在交换临时ZIL时，确认ZIL的每个持有人不是美国人（如1933年美国证券法第S条所定义）。



虽然可以使用Zilliqa提供的公共节点与区块链进行交互，但我们建议所有想支持主网交易的交易所设置种子节点。本文档将指导您完成启动和运行所需的基本步骤。

## KYC和IP白名单

由于种子节点不直接从查找或分片节点中提取数据，因此Zilliqa必须将交易所列入白名单，以便接收有关区块链及其状态的数据广播。这需要一个静态的公共IP地址，最少有两个可以接收的开放端口（输入和输出）。

此外，由于种子节点提供商将获得奖励，我们要求所有想设置种子节点的交易所和个人通过KYC流程。 您可以通过填写我们的[>>**表单**<<](https://docs.google.com/forms/d/e/1FAIpQLScopeiLXU_10i6OzsZApIDyRYHpw4JqePDDe0Aoa5JIZo1muw/viewform)来开始此流程。请注意，在KYC完成之前，您将无法设置种子节点。

## 最低硬件要求

- x64 Linux OS（首选Ubuntu 16.04）
- 双核CPU或更高CPU（例如Intel i5处理器）
- 8GB DDR3 RAM或更好
- 500GB固态硬盘
- 100MB/s的上传和下载带宽

## 硬件准备

在开始之前，请选定并记下您的种子节点的通信端口。此步骤非常重要，因为未能提供正确的参数将会导致失败。

### Docker设置

> 注意：如果您使用AWS，则可以使用**ami-0812864268c7448b6**创建一个实例并跳过此步骤。

我们强烈建议使用[Docker](https://docker.com/)来设置种子节点，因为我们提供了经过测试的正式环境镜像供您使用。如果您尚未设置docker，请按照[官方文档](https://docs.docker.com/install/)中的说明进行操作。

设置Docker后，您可以继续下载mainnet的配置tarball：

```sh
# create a directory
$ mkdir my_seed && cd my_seed
$ curl -O https://mainnet-bugis-seedjoin.aws.zilliqa.com/configuration.tar.gz
$ tar -zxvf configuration.tar.gz

# Contents:
#
# launch.sh
# constants.xml
# launch_docker.sh
# dsnodes.xml
# download_and_verify.sh
# fetchHistorical.py
# fetchHistorical.sh
# config.xml
```

一旦成功解压缩了tarball，就要生成一个新的密钥对，如下所示：

```sh
$ ./launch_docker.sh --genkeypair
$ mv mykey.txt verifier.txt
```

### 本地设置

> 注意：这种方法仅在**Ubuntu 16.04**上进行了测试，并涉及编译C ++。我们强烈建议您考虑使用上面提供的Docker镜像。

如果你不能或不想使用Docker，你也可以从源代码构建Zilliqa二进制文件然后运行。

```sh
# clone Zilliqa source files
$ git clone https://github.com/Zilliqa/Zilliqa.git && cd Zilliqa && git checkout
<<commit_sha>> && cd Zilliqa

# install system dependencies
$ sudo apt-get update && sudo apt-get install \
    git \
    libboost-system-dev \
    libboost-filesystem-dev \
    libboost-test-dev \
    libssl-dev \
    libleveldb-dev \
    libjsoncpp-dev \
    libsnapp-dev \
    cmake \
    libmicrohttpd-dev \
    libjsonrpccpp-dev \
    build-essential \
    pkg-config \
    libevent-dev \
    libminiupnpc-dev \
    libprotobuf-dev \
    protobuf-compiler \
    libcurl4-openssl-dev \
    libboost-program-options-dev \
    libssl-dev

# build the binary. this may take awhile.
$ ./build.sh
```

构建应能正常退出。完成后，下载tarball配置，并生成密钥对：

```sh
# make a separate folder for keys and configuration
$ cd ../ && mkdir my_seed && cd my_seed
$ curl -O https://mainnet-bugis-seedjoin.aws.zilliqa.com/configuration.tar.gz
$ tar -zxvf configuration.tar.gz

# generate a keypair
$ ../Zilliqa/build/bin/genkeypair > verifier.txt
```

## 配置节点

在加入主网之前，节点需要进行配置。大多数配置都包含在**constants.xml**中，这个文件在我们解压缩的目录中的**configuration.tar.gz**，需要进行以下更改：

- 将`VERIFIER_PUBKEY`的值更改为`cat verifier.txt | cut -d ' ' -f1`
- 将`SEED_PORT`的值更改为`33133`（默认值），或您的自定义端口（如果有）。如果不选择`33133`，请务必记下后续步骤。

## 加入主网

> 注意：在继续此步骤之前，请确保您已完成KYC。

当完成了初始步骤，加入主网会相对简单些。

```sh
# NOTE: run only ONE of the following.
# for Docker setup
$ ./launch_docker.sh
# for native setup
$ ./launch.sh
```

您将被询问一系列问题。当要求输入您的IP地址和监听端口时，请输入您在提交KYC表单时所填写的值。这非常重要，因为您的节点**不能**与其他任何东西一起使用。

## 下一步

如果您已完成上述步骤，则应该会产生了一个正常运行的种子节点，该节点在`localhost:4201`上公开了RPC API。您可以在`zilliqa-00001-log.txt`查看详细日志。

以下说明将用一组简单的函数来作示例，交易所的开发人员可利用这些函数开始在Zilliqa区块链上实现自定义业务逻辑。您可以在与示例应用程序的[同一目录](https://github.com/Zilliqa/dev-portal/tree/master/examples/exchange)中找到完整源代码。