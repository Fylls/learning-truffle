<div align="center">

# Truffle Framework

<!-- ![truffle-share](https://user-images.githubusercontent.com/55017307/134491149-19929558-8ddd-48ce-958d-f430569f3ab6.png) -->

![truffle-web-oficial](https://user-images.githubusercontent.com/55017307/134491154-d62ea515-9471-404b-bfc6-70274ea40ca4.png)

</div>

---

it's way easier to build a blockchain app with truffle nowadays.

Truffle is pretty much a standard for blockchain development and you can use it on all evm compatible blockchain like ethereum binance machine and polygon.

---

truffle is the most popular framework for writing smart contracts it was originally created for ethereum.

you can write contract in solidity or vyper.

---

We'll learn how to Compile, Deploy & Test smart contracts

---

## Why Truffle?

<br>

- **Compiling**

it's a very convenient because you can switch from one version of solidity to another very easily by just changing a configuration for deployment it runs a local development blockchain called ganache.

on this blockchain you can make any mistake that you want it doesn't matter it's completely isolated from mainnet (the production network of ethereum)

<br>

- **Testing**

it uses under the hood a javascript framework called mocha so the syntax will feel familiar if you already know web development.

if you didn't use truffle you could still develop smart contracts but you will have to create a lot of boilerplate code to integrate different tools together and that's really not fun at all truffle is a huge time saver.

in terms of usage truffle is a command line framework meaning that you will run it in your terminal there are only a few commands that you will use regularly

---

## Installation

you have to download NodeJS

```bash
>>> npm install -g truffle
>>> truffle version
```

---

## Setting up

```bash
>>>  truffle init
```

**contracts folder:** where you will write your smart contracts

**migrations folder:** where you will write 'migration files' to explain truffle how to deploy your smart contracts to the blockchain (written in JS)

**test folder:** where you will write your test files to make sure that your smart contracts work well

**configuration file:** `truffle-config.js` allows you to configure a few options in truffle like which version of solidity you are using or which network you want to deploy your smart contracts to

---

<div align="center">

let's begin

</div>

---

## Compiling

Migration.sol is automatically created by truffle, you can ignore it

by default truffle is going to use solidity 0.5 but if you want to use more recent version you have to edit `truffle-config.js`

```java
module.exports = {
  compilers: {
    solc: { version: "0.8.4" },
  }
}
```

this commands compiles all the contracts in the `./contract` folder

```bash
>>> truffle compile
```

after compilation you will get artifacts in `./build/contracts` folder under the name of `<name-of-your-contract>.json`

an artifact contains important information to interact with your contract (name, ABI, networks, compiler, etc.)

networks key in artifact will change after you compile

if you compile or deploy this artifact file will be updated.

it's possible that you have some incompatibility between the different version of solidity in your smart contracts.
Always have to make sure that the different pragma statements are compatible between each other

---

## Testing

```bash
>>> truffle test
```

testing your smart contract is a very important: once you deploy your smart contract it's not possible to modify its code anymore so you need to fix any bug before the deployment and in order to find potential bugs in your smart contract you need to test it.

in the truffle framework tests are written in the `./test` folder
you can write test in node.js or in solidity but in most cases you will write test in node.js

before everything else: import the contract artifact.
The contract artifact is an object provided by truffle to interact with our smart contract

```javascript
const SimpleStorage = artifacts.require("SimpleStorage.sol")
```

it also spins a local dev blockchain (ganache) where you will deploy your smart contracts

example of testing

```javascript
// import artifact - helps us interact with contract
const SimpleStorage = artifacts.require("SimpleStorage.sol")

// contract block
contract("SimpleStorage", () => {
  it("Should update data", async () => {
    // deploy - storage is a pointer to our SC instance
    const storage = await SimpleStorage.new()

    // call updateData function & wait fot TX to be mined
    await storage.updateData(10)

    // call readData function (view function - no gas)
    const data = await storage.readData()

    // if number is BIG this can fail due to overflow
    // assert(data.toNumber() === 10);

    // simple string comparison - typeof(data) is BigNumber
    assert(data.toString() === "10")
  })
})
```

---

## Deploying (locally)

deploy to local dev blockchain (ganache)

we need to create a migration file.
truffle will run migrations in order.
the first migration is already written for you

`1_initial_migration.js`

```javascript
const Migrations = artifacts.require("Migrations")

module.exports = function (deployer) {
  deployer.deploy(Migrations)
}
```

`2_deploy_contracts.js`

```javascript
const SimpleStorage = artifacts.require("SimpleStorage.sol")

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage)
}
```

once we have our migration files:
runs ganache, gives 10 accounts ( address + private key)

```bash
>>> truffle develop
```

once local blockchain is started, we can deploy our contracts

```bash
>>> truffle migrate --reset
```

since local env we will not find block hash tx on etherscan, only local to your computer.

---

## Deploying on public testnet

public test net is an alternative network to mainnet so it runs on a public network of computers so
it's not ust on your machine the public test net is totally isolated from mainnet the production network of ethereum so you can break everything on tests on a public test net it doesn't matter.

and it's also a little bit less flexible that your local development blockchain because you don't control all the nodes of the network actually you don't control any of the, so you don't have 10 accounts pre-funded with ether instead you need to get some test net ether in order to deploy your smart contract or if you want to deploy.

search for a faucet for your testnet

<br>

**faucet** is a tool provided by each test net in order to distribute for free some testnet ETH or for binance smart chain, testnet BNB.

- `https://faucet.rinkeby.io/`

- `https://faucet.ropsten.be/`

- `https://testnet.binance.org/faucet-smart`
- ...
- ...

<br>

we need to add new network in the `truffle-config.js` file in the root folder
contrary to ethereum for deploying to binance smart chain you don't need `Infura`, BSC already has a public URL available to use

<br>

```javascript
const HDWalletProvider = require("@truffle/hdwallet-provider")
const privateKeys = ["0x + PRIVATE_KEY"]

module.exports = {
  /*
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    eth: {
      provider: () => new HDWalletProvider(privateKeys, "ETH_NODE_URL"),
      network_id: 1,
      skipDryRun: true,
    },

    ethTestnet: {
      provider: () => new HDWalletProvider(privateKeys, "ETH_NODE_URL"),
      network_id: 5,
      skipDryRun: true,
    },

    bsc: {
      provider: () =>
        new HDWalletProvider(privateKeys, "https://bsc-dataseed.binance.org/"),
      network_id: 56,
      skipDryRun: true,
    },

    bscTestnet: {
      provider: () =>
        new HDWalletProvider(
          privateKeys,
          "https://data-seed-prebsc-1-s1.binance.org:8545/"
        ),
      network_id: 97,
      skipDryRun: true,
    },
  },
}
```

<br>

after setting the desired network run this command:

```bash
>>> truffle migrate --reset --network bscTestnet
```

now it takes more time, both for contracts deployment and transactions.
since we don't control the nodes, we have to wait for miners

<br>

**output:**

```bash
Compiling your contracts...
===========================
> Compiling .\contracts\Migrations.sol
> Compiling .\contracts\SimpleStorage.sol
> Compilation warnings encountered:


> Artifacts written to C:\Users\serge\Documents\GitHub\learning-truffle\build\contracts
> Compiled successfully using:
   - solc: 0.8.4+commit.c7e474f2.Emscripten.clang



Starting migrations...
======================
> Network name:    'bscTestnet'
> Network id:      97
> Block gas limit: 30000000 (0x1c9c380)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x6057f6002356aff4b79eaed52e4cf61a9dd1cf8ba3001d4de408ec20c3837a5b
   > Blocks: 4            Seconds: 14
   > contract address:    0x326152cd11cb8380FA8761B0ae4cB9373791343a
   > block number:        12615625
   > block timestamp:     1632398771
   > account:             0x30371B85a4e0FDA3A79223bB47d765dB51EC9E80
   > balance:             0.99753108
   > gas used:            246892 (0x3c46c)
   > gas price:           10 gwei
   > value sent:          0 BNB
   > total cost:          0.00246892 BNB


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00246892 BNB


2_deploy_contracts.js
=====================

   Deploying 'SimpleStorage'
   -------------------------
   > transaction hash:    0x942fa8641686dd4450e77760fd9e32d2836792e88558d2204916eea96d83760c
   > Blocks: 3            Seconds: 9
   > contract address:    0xcaE4222469d1F5219a82Ebc45D9F5306BafF3524
   > block number:        12615636
   > block timestamp:     1632398804
   > account:             0x30371B85a4e0FDA3A79223bB47d765dB51EC9E80
   > balance:             0.99591776
   > gas used:            118819 (0x1d023)
   > gas price:           10 gwei
   > value sent:          0 BNB
   > total cost:          0.00118819 BNB


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00118819 BNB


Summary
=======
> Total deployments:   2
> Final cost:          0.00365711 BNB
```

<br>

you can verify your deployments & transaction with a block-explorer (EtherScan, BscScan, etc)

---

## Interacting with Smart Contracts

right now we are connected to the Binance Smart Chain Testnet

<br>

```bash
>>> truffle console --network bscTestnet

truffle(bscTestnet)

>>> storage = await SimpleStorage.deployed()
undefined

>>> storage.address
'0xcaE4222469d1F5219a82Ebc45D9F5306BafF3524'

>>> await storage.updateData(10)
{
  tx: '0x4593df4f7786bf2511fb37d300e8ffd12070365874f2cbfa90a3af4bb9519748',
  receipt: {
    blockHash: '0xb3b9867092fd567338ae7b42a928a60a13a3a28683332c67ea76ddec7b53cd75',
    blockNumber: 12616137,
    contractAddress: null,
    cumulativeGasUsed: 230468,
    from: '0x30371b85a4e0fda3a79223bb47d765db51ec9e80',
    gasUsed: 41602,
    logs: [],
    logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    status: true,
    to: '0xcae4222469d1f5219a82ebc45d9f5306baff3524',
    transactionHash: '0x4593df4f7786bf2511fb37d300e8ffd12070365874f2cbfa90a3af4bb9519748',
    transactionIndex: 1,
    type: '0x0',
    rawLogs: []
  },
  logs: []
}


>>> data = await storage.readData()
undefined

>>> data.toString()
'10'

```

---

## Develop (locally)

this command is going to do two things: first it start a local development blockchain and second it attach a truffle console to it

truffle develop is different from the truffle console you use to connect to a public test net

```bash

>>> truffle develop
Truffle Develop started at http://127.0.0.1:9545/

Accounts:
(0) 0x1eda575639927323080bbe0f34dd097f3c5bee04
(1) 0x04cd97bc1001d807ad0d5975bdaaef012f3875c8
(2) 0x396ff28fa884b513be9e9617474b6b2b85ebf92c
(3) 0xb91bd1759fa6e17b9125930d8ad3a12f7a0ebd3c
(4) 0x793e5f6b5364bc12ab835625a413597e88b0bb1d
(5) 0xa3989dbb2168e2f6f2ddbae28c85149467458a6a
(6) 0x6be36217d8713d057a5c811f03c2546e1b450366
(7) 0xd4d2b5ab42e28e34d228446ba623189e552c1ae4
(8) 0xc90dfa5a7dc01580b0e2d6793d37392651c10cd1
(9) 0x2fc9eb5a82ad7b4456f1d3dbf1cb9c0978fa2c57

Private Keys:
(0) df9c2805ff8e163c250321432dded0de49f5d70161d854dac7ac4bce613f9fe9
(1) 3af07b28c9696b256d340eec4821231f7db6c2bded7da49f4c3be1420fb6d21a
(2) c9a9e6932289e14e5d2e18bcd78c9ca7df861576ae6ca7c418c9fd5d414d8422
(3) 56c349c9cecc47fd3bc2566da10cf8e3f219889824d67797a1b2d74701f9032d
(4) b3de498bd55659e26cfe5bc1057dd05d73592999d139d08fc020242005dd3b58
(5) bcb06fe97d22bd1a53a204650e6d06d87658368c04212814f6885d63a31cf9de
(6) d60d11b3417df64e4e10137ad082fc8bf879c37af49eeb993964e4034f699b7f
(7) e8763cfeccd2a98b80674bbf193871e1c78d2a506cab3e591d62d226ea9b82a7
(8) 2f221777f0621df6a14e4ea8d5d2ed03dc82cbfd0c420ec3b9f2b5536eab1c78
(9) 511f4a1bb028c5060aa2af3fbf30805943f5afb289bbdfcc5f6aafe732b315cb

Mnemonic: debate wrong symptom miss minute secret mesh gloom sting imitate riot buzz

⚠️  Important ⚠️  : This mnemonic was created for you by Truffle. It is not secure.
Ensure you do not use it on production blockchains, or else you risk losing funds.

truffle(develop)> ...

```
