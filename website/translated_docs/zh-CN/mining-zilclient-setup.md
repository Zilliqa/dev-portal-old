---
id: mining-zilclient-setup
title: CPU节点上安装Zilliqa客户端
---

1. 按照[**这里**](http://releases.ubuntu.com/xenial/)的说明来安装Ubuntu 16.04.5操作系统。

2. 按照[**这里**](https://docs.docker.com/install/linux/docker-ce/ubuntu/)的说明为Ubuntu安装Docker CE。

3. 在桌面中创建一个新目录并将目录更改为：

    ```shell
    cd ~/Desktop && mkdir join && cd join
    ```

4. 在命令提示符下获取docker镜像：

    ```shell
    wget https://mainnet-join.zilliqa.com/configuration.tar.gz
    tar zxvf configuration.tar.gz
    ```

5. 在命令提示符中找出您当前的IP地址并记录下来。

    ```shell
    curl https://ipinfo.io/ip
    ```

6. 在配置文件夹中编辑 *constant.xml* 文件：

    * 将`GETWORK_SERVER_MINE`设置为`true`。

    * 将`GETWORK_SERVER_PORT`设置为您将用于GetWork的端口。（默认为`4202`）

    * 将其他挖矿参数设置为`false`：

        ```shell
        <CUDA_GPU_MINE>false</CUDA_GPU_MINE>
        <FULL_DATASET_MINE>false</FULL_DATASET_MINE>
        <OPENCL_GPU_MINE>false</OPENCL_GPU_MINE>
        <REMOTE_MINE>false</REMOTE_MINE>
        ```

7. 在命令提示符下运行shell脚本以启动docker镜像。

    ```shell
    ./launch_docker.sh
    ```

8. 系统将提示您输入一些信息，如下所示：

    > **注意**：**请勿**复制您的IP地址并使用不同的端口来创建不同的CPU节点。您将会被主网列入黑名单，因而无法获得任何奖励。

    - `为容器指定一个名称（默认：zilliqa）：` <br>[如果使用默认值，按 **输入**跳过]
    - `输入您的IP地址（'NAT'或*.*.*.*）：` <br>[输入您在步骤5中找到的IP地址 **或**如果您在网络配置中选择了[选项1b](mining-initial-setup#option-1b)，则输入`NAT`]
    - `输入你的监听端口（默认值：33333）：` <br>[如果使用默认值，按 **输入**跳过]

    
