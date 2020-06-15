---
id: core-data
title: Data layer
---
## Blockchain Data

## Transaction Checks

### Lookup level

[Validate Txn Function](https://github.com/Zilliqa/Zilliqa/blob/7b684a25f81dd4e790f596ca19672990c41d4b72/src/libServer/LookupServer.cpp#L309)

1. Check if the chain ID matches the chain ID of the network. This is done to prevent replay attacks.
2. Check if the txn code size is within the limits of max code size.
3. Check if the txn gas price is greater than the minimum gas price required
4. Check the signature of the corresponding pubKey in the txn
5. Check if the sender has non-zero balance
6. If it is a contract creation transaction, check if the txn gas is greater than the minimum gas for a contract creation transaction
7. If it is a contract call transaction, check if the txn gas is greater than the minimum gas for a contract call transaction.
8. Check if the txn nonce is not less than the sender nonce.

### Shard Level

[CheckCreatedTransactionFromLookup](https://github.com/Zilliqa/Zilliqa/blob/7b684a25f81dd4e790f596ca19672990c41d4b72/src/libValidator/Validator.cpp#L94)

1. Checks 1,2,3,4,5 are similar as lookup level.
2. Also if it is a non-DS node, check if the txn is in correct shard.
3. Also check if the sender has enough balance for the txn.

## Local Storage

### Lookup Nodes

1. Lookups are full nodes hence they store all the data. Transactions, blocks, microblocks, state, and state deltas (of previous 10 DS epochs) are stored by lookups.
1. Lookup persistence (specifically `lookup-0`) is also uploaded to AWS S3 for synchronization of nodes.

### DS and Shard Nodes

1. These nodes store DS Blocks, Tx Blocks, current state.
1. The shard nodes also store processed txns of that DS epoch in temporary storage. These are uploaded to S3 for backup.
1. The DS nodes also store all the microblocks as they receive them from the shard nodes.

## Cloud Storage

- [Introduction](#introduction)
- [Authenticated Access](#authenticated-access)
- [Unauthenticated Access](#unauthenticated-access)
  - [Configuring Bucket Policy in Command Line](#configuring-bucket-policy-in-command-line)
- [References](#references)

### Introduction

Zilliqa network uses AWS Simple Storage Service (S3) to achieve high-volume data transfer, distribution and persistence for blockchain-related data that includes persistence data, snapshot, state deltas, logs and release package.

The following tables shows the storage locations for different objects and their permissions for our nodes running on AWS (through *authenticated access*) or unlimited access from any nodes (through *unauthenticated access*). More details can be found in this doc.

| Location Pattern                                  | Authenticated Access | Unauthenticated Access | Usage                                                               |
|---------------------------------------------------|----------------------|------------------------|---------------------------------------------------------------------|
| `s3://<bucket_name>/incremental/<network_name>/*` | R/W                  | R/-                    | persistence snapshot per 10 ds epoch, for joining/rejoining purpose |
| `s3://<bucket_name>/statedelta/<network_name>/*`  | R/W                  | R/-                    | state deltas for constructing the state                             |
| `s3://<bucket_name>/persistence/*`                | R/W                  | -/-                    | persistence tarballs used for recovery/back-up                      |
| `s3://<bucket_name>/logs/<network_name>/*`        | R/W                  | -/-                    | logs for each node in the network                                   |
| `s3://<bucket_name>/release/*`                    | R/W                  | -/-                    | release tarballs                                                    |
| `s3://<bucket_name>/txns-backup/<network_name>/*` | R/W                  | -/-                    | transactions backup                                                 |

> Note:
>
> 1. This pattern table describes the latest development on `master` branch in <https://github.com/Zilliqa/testnet>.
> 2. `<bucket_name>` is the bucket name used in `bootstrap.py --bucket=<bucket_name>`.
> 3. `<network_name>` is the network name used in `bootstrap.py <network_name>`.
> 4. Authenticated access is automatically configured during cluster creation.
> 5. Unauthenticated access configuration requires manual effort as described at **[Configuring Bucket Policy in Command Line](#configuring-bucket-policy-in-command-line)**
> 6. `R/W` means read and write. `R/-` means read-only. `-/-` means no access allowed.

### Authenticated Access

The authenticated access is automatically configured during cluster creation. The IAM role of the EC2 instances that run Zilliqa nodes will have additional policy configured. An example of the policy document is here:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            ... // other non-S3 policies
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::301978b4-****-****-****-3a2f63c5182c"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:*Object"
            ],
            "Resource": [
                "arn:aws:s3:::301978b4-****-****-****-3a2f63c5182c/*"
            ]
        }
    ]
}
```

The requests from these instances will be trasparently authenticated using the IAM role of instances, so the nodes will be allowed to access.

### Unauthenticated Access

The unauthenticated access, or public access, is configured manually [using AWS commandline tools](#configuring-bucket-policy-in-commandline). This involves creating a bucket policy document like this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:ListBucket",
            "Condition": {
                "StringLike": {
                    "s3:prefix": [
                        "incremental/*",
                        "statedelta/*"
                    ]
                }
            },
            "Resource": "arn:aws:s3:::301978b4-****-****-****-3a2f63c5182c"
        },
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": [
                "arn:aws:s3:::301978b4-****-****-****-3a2f63c5182c/incremental/*",
                "arn:aws:s3:::301978b4-****-****-****-3a2f63c5182c/statedelta/*"
            ]
        }
    ]
}
```

> Note: This policy document is meant to be configured for a specific S3 bucket in its bucket policy, whereas the policy document in **[Authenticated Access](#authenticated-access)** is meant to be used as IAM policy.

The use of `"Principal": "*"` in the policy allows public access and the condition and resource with prefix limits the access to certain prefixes (or folders).

#### Configuring Bucket Policy in Command Line

Make sure you have admin access to the bucket `<bucket-name>`. If you are inside the Cloud9 bastion with S3 admin access to `<bucket-name>`, you can directly invoke the following commands. Otherwise, please configured the AWS credentials in command line first.

```bash
aws s3api put-bucket-policy --bucket <bucket-name> --policy file://policy.json
```

The file `policy.json` should contain a valid bucket policy document as above. Do remember to replace the example bucket name string from `301978b4-****-****-****-3a2f63c5182c` to the one you are configuring (i.e., `<bucket-name>`).

Also, try checking the existing policy before and after configuring:

```bash
aws s3api get-bucket-policy --bucket <bucket-name>
```

Other commands under `aws s3api` can be found at [AWS documentation](https://docs.aws.amazon.com/cli/latest/reference/s3api/index.html#cli-aws-s3api).

### References

- [Writing IAM Policies: Grant Access to User-Specific Folders in an Amazon S3 Bucket](https://aws.amazon.com/blogs/security/writing-iam-policies-grant-access-to-user-specific-folders-in-an-amazon-s3-bucket/)