---
id: mining-zilminer
title: ZILMiner for mining rigs
---

1. Install **Zilminer** on your GPU rigs:

    - **For Windows OS:** [**DOWNLOAD THE LASTEST RELEASE HERE**](https://github.com/DurianStallSingapore/ZILMiner/releases/)
    - **For Ubuntu OS:** [**DOWNLOAD THE LASTEST RELEASE HERE**](https://github.com/DurianStallSingapore/ZILMiner/releases/)

2. Setup your **Zilminer** on your GPU rigs with the following command:

    ```shell
    zilminer -P zil://wallet_address.worker_name@zil_node_ip:get_work_port
    ```

    > **NOTE:** You have to change the *wallet_address*, *worker_name*, *zil_node_ip*, and *get_work_port* accordingly.

    - For `wallet_address` : You can input any arbitrary Zilliqa address. This is only used by the pool master for accounting purposes. If you are mining solo, you can ignore this parameter.
    - For `worker_name` : You can input any arbitrary worker name you desire.
    - For `zil_node_ip` : Please input the IP address of the CPU node running the Zilliqa client.
    - For `get_work_port` : Please input the port used in `GETWORK_SERVER_PORT`. Default is `4202`.