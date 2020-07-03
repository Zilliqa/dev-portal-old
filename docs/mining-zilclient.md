---
id: mining-zilclient
title: Running the Zilliqa Client
---
## Hardware Requirements

The [**Zilliqa Client**](https://github.com/Zilliqa/zilliqa) is only officially supported on Ubuntu 16.04 OS.

The **minimum** requirements for running the **Zilliqa Client** are:

- x64 Linux operating system (e.g Ubuntu 16.04.05)
- Recent dual core processor @ 2.2 GHZ. Examples:
   - Intel Core i5 or i7 (Skylake)
   - Intel Xeon (Skylake)
   - AMD Ryzen
- 4GB DRR3 RAM or higher
- NAT environment **OR** Public IP address
- Any GPUs with at least 2 GB vRAM

## Network Setup for Zilliqa Client

> **NOTE:** If you are using a home router, you are most probably in a NAT environment.

If you are in a NAT environment, you can either:

- Do single port forwarding using **Option 1a**. This should be your **DEFAULT OPTION**.
- Enable UPnP mode using **Option 1b** if your router does support UPnP.

If you have a public IP address, you can skip this network setup section entirely.

### Option 1a

Port forward to port `33133` for both external port (port range) and internal port (local port). You will also have to select the option for **BOTH** TCP and UDP protocol in your router menu when port forwarding. <br/> An example of this process can be found [**HERE**](https://www.linksys.com/us/support-article?articleNum=136711). After port forwarding, you may check if you have successfully port forwarded with this [**Open Port Check Tool**](https://www.yougetsignal.com/tools/open-ports/).

### Option 1b

Enable UPnP mode on your home router. Please Google how to access your home router setting to enable UPnP, an example can be found [**HERE**](https://routerguide.net/how-to-enable-upnp-for-rt-ac66u/). You can check if you have enabled it UPnP by installing the following tool:
   ```shell
   sudo apt-get install miniupnpc
   ```
Then type the following in the command line:
   ```shell
   upnpc -s
   ```
You should get a message showing either:

   - "List of UPNP devices found on the network : ..."
   - **OR** "No IGD UPnP Device found on the network !".

The first message means UPnP mode has been enabled successfully, while the latter means the enabling of UPnP mode has failed. If you receive the latter message, proceed with using [**Option 1a**](#option-1a) instead.

## Mining Steps

1. Create a single local or remote CPU node instance with Ubuntu 16.04 OS installed following instructions [**HERE**](http://releases.ubuntu.com/xenial/).

2. Install Docker CE for Ubuntu on your CPU node instance by following instructions [**HERE**](https://docs.docker.com/install/linux/docker-ce/ubuntu/).

3. Make a new directory in your Desktop and change directory to it:

    ```shell
    cd ~/Desktop && mkdir join && cd join
    ```

4. Get the joining configuration files:

    ```shell
    wget https://mainnet-join.zilliqa.com/configuration.tar.gz
    tar zxvf configuration.tar.gz
    ```

5. Find out your current IP address in the command prompt and record it down:

    ```shell
    curl https://ipinfo.io/ip
    ```

> ** Note:** Please consult the previous section if you are in a NAT environment.

6. Edit your _constant.xml_ file in your configuration folder:

    * Set `GETWORK_SERVER_MINE` to `true`.
    * Set `GETWORK_SERVER_PORT` to the port you will be using to GetWork. (default is `4202`)
    * Set the following mining parameters to `false`:

        ```shell
        <CUDA_GPU_MINE>false</CUDA_GPU_MINE>
        <FULL_DATASET_MINE>false</FULL_DATASET_MINE>
        <OPENCL_GPU_MINE>false</OPENCL_GPU_MINE>
        <REMOTE_MINE>false</REMOTE_MINE>
        ```
        
7. Install the python dependencies:
    
    ```shell
    sudo apt install python-pip
    export LC_ALL=C
    pip install request requests clint futures
    ```

8. Run the shell script in your command prompt to launch your docker image:

    ```shell
    ./launch_docker.sh
    ```

9. You will be prompted to enter some information as shown below:

    > **NOTE:** **DO NOT** duplicate your IP address and use different ports to create different CPU nodes. You will be blacklisted by the network and hence not be able to receive any rewards.

    - `Assign a name to your container (default: zilliqa):` <br/> [Press **Enter** to skip if using default]

    - `Enter your IP address ('NAT' or *.*.*.*):` <br/> [Key in your IP address as found in step 5 **OR** `NAT` if you chose [Option 1b](mining-initial-setup#option-1b) for network setup]

    - `Enter your listening port (default: 33133):` <br/> [Press **Enter** to skip if using default]

## Monitoring Progress

You are now a miner in the Zilliqa Mainnet. You can monitor your progress on your CPU node by using:

```shell
tail -f zilliqa-00001-log.txt
```

## Checking Your Generated Keypairs

To check your locally generated public and private key pairs in your _mykey.txt_ file, you can enter the following in your command prompt on your CPU node:

```shell
less mykey.txt
```

The first hex string is your **public key**, and the second hex string is your **private key**.

> **NOTE:** This key pair is generated locally on your disk. Do remember to keep your private key somewhere safe!

## Checking Your ZIL Balance

To check your balance for mining, input the address located in your _myaddr.txt_ file in the search bar of https://viewblock.io/zilliqa:

```shell
less myaddr.txt
```

## Stopping the Mining Process

To stop the mining client, stop the docker container running the **Zilliqa Client** on the CPU node:

```shell
sudo docker stop zilliqa
```