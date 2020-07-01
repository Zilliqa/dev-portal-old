---
id: mining-zilminer-setup
title: 用ZilMiner设置挖矿工具
---

1. 在单独的GPU平台上安装 **ZilMiner**：

    - **对于Windows操作系统:** [**下载最新版本**](https://github.com/DurianStallSingapore/ZILMiner/releases/)
    - **对于Ubuntu操作系统:** [**下载最新版本**](https://github.com/DurianStallSingapore/ZILMiner/releases/)

2. 使用以下命令在GPU平台上设置ZilMiner：

    ```shell
    zilminer -P zil://wallet_address.worker_name@zil_node_ip:get_work_port
    ```

    > **注意：**您必须相应地更改 *wallet_address*，*worker_name*，*zil_node_ip*和*get_work_port*。

    - 对于`wallet_address` ：您可以输入任意Zilliqa地址。这仅供池主服务器用于记帐。如果您正在独自挖矿，则可以忽略此参数。
    - 对于`worker_name` ：您可以输入任何您想要的任意工作者名称。
    - 对于`zil_node_ip` ：请输入运行Zilliqa客户端的CPU节点的IP地址。
    - 对于`get_work_port` ：请输入`GETWORK_SERVER_PORT`中使用的端口。默认为`4202`。