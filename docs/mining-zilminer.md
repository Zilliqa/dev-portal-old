---
id: mining-zilminer
title: Using ZILMiner for Mining Rigs
---
## Hardware Requirements

The [**Zilminer**](https://github.com/DurianStallSingapore/ZILMiner) software is officially supported on both Ubuntu and Windows OS.

Both **AMD** (with OpenCL) and **Nvidia** (with OpenCL or CUDA) GPUs are supported for the Zilliqa PoW process.

The **minimum** requirements for running **Zilminers** are:

- x64 Operating system (Ubuntu or Windows)
- Dual core processor or later
- 4GB DDR3 RAM or higher
- Any GPUs with at least 2 GB vRAM

## GPU Driver Setup for Zilminer

### OpenCL Driver Setup (for AMD/Nvidia GPUs)

If you wish to use OpenCL supported GPUs for PoW, please run the following to install the OpenCL developer package:

   ```shell
   sudo apt install ocl-icd-opencl-dev
   ```

You may need to reboot your PC for the installation to take effect. After reboot, check if your drivers are installed properly with the following command:

   ```shell
   clinfo
   ```
If you are facing issues such as missing OpenCL drivers, please follow this forum guide found [**HERE**](https://forum.zilliqa.com/t/guide-to-setting-up-6-amd-gpus-on-ubuntu-16-04/180). (Credits to @Speccles96)

### CUDA Driver Setup (for Nvidia GPUs only)

If you wish to use CUDA supported GPU for PoW, please download and install CUDA package from the [**NVIDIA official webpage**](https://developer.nvidia.com/cuda-downloads). You may need to reboot your PC for the installation to take effect.

## Mining Steps

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

## Stopping the Mining Process

To stop mining, you will need to kill your **Zilminer** process on your GPU rigs.