# cs-699-dapp
decentralized webapp project for CS 699 Directed Study

### Mission
Web3 is the conjunction of machine-learning, decentralized storage, and blockchain economies. It promises to eliminate high barriers to entry for internet services; guarantee online anonymity for all users; provide unlimited access to websites and online storage. However, these promises have yet to be fulfilled by a fully realized example of these new technologies. The capabilities and limitations of dApps are theoretical with the exception of experimental proofs. The purpose of this project is to build a concept webapp that is entirely supported by blockchain and distributed storage. In developing this webapp I will learn more about and actualize Web3 technologies through firsthand experience.

### Objectives
1. build smart contract
    * facilitate user accounts
      * create and delete users
      * use wallet address as identifier
      * site-admin privileges
      * file sharing
    * track user content
      * create and delete files
      * file names, file size, storage tracker
    * test locally using truffle suite
      * write self-checking tests
      * deploy contract to local blockchain
      * validate all contract functions
2. build client
      * login with wallet
        * read and store wallet address
      * interact with smart contract
        * use contract ABI from current build
        * connect to blockchain through wallet
        * listen for contract events
      * store and load files with distrubted storage
        * connect to storage through provider endpoint
        * send cid of uploaded file to contract
        * retrieve cid from contract
        * retrieve file from storage using cid
5. Migrate contract onto public blockchain
      * write contract to blockchain
      * copy address of new contract
      * edit client to use contract address
      * verify success with etherscan
7. Publish client to distributed storage
      * build source code for production
      * upload build directory to storage
      * copy tracker
      * verify success with storage endpoint

### Implementation notes
Objective 1:  
I chose to write the contract in **Solidity**, a high-level object-oriented language specific for smart contracts.  
**Truffle** and **Ganache** are two development tools used to debug and deploy smart contracts. Ganache provides a
local blockchain environment that can be used to to test contracts. Truffle is a similar tool that can be used to 
compile and deploy contracts on to public blockchains.
  
Objective 2:  
My web client is written in **React javascript**, this was the most familiar framework and webapp language for me.  
I created a **Metamask** crypto wallet, to interact with my smart contract. Because the contract is on the Ethereum blockchain, it can only be accessed through transactions which requires currency only when the state is changed.  
The storage network used to store user content was **IPFS**, a peer-to-peer network of storage nodes. This is the largest and most ubiquitous service for distributed storage.  
I used **Infura** and **MetaMask** to connect to IPFS and the Ethereum blockchain respectively through my javascript code.  
  
Objective 3:  
I chose to deploy to the **Ropsten** test network, a development clone of the main Ethereum blockchain. It provides an identical environment that is free for developers to use. However, there is a significant performance limitation to this
network because blockchain miners are not incentivized to mine transactions. This makes contract calls noticeably slower. For this reason, I edited my client code to listen for events from the emitted from the contract. These events are emitted when the state is updated.
  
Objective 4:  
I used an online service called **Fleek** to publish my built webapp on IPFS. I alternatively could've uploaded the website myself using IPFS command line. However, this service creates a dedicated http endpoint that is much faster than most IPFS endpoints. It also automatically builds your source code for optimization on IPFS. It was important that the client is accessed through IPFS in order to fully execute the project's mission of not relying on the conventional internet services.

### Summary
The name of my decentralized webapp (dAPP) is "My Beautiful Repository of Knowledge" or MBRK. The site allows users to store and load files onto IPFS and is supported by an Ethereum smart contract. Users can also share their repository with other users. Upload and download times using IPFS was surprisingly fast, I recorded a peak throughput of 20Mbps download and upload. However, in practice it took a considerable time for the smart contract to update: 30-60s. I believe this is because the contract is stored on Ropsten instead of the main network. The advantage to using a smart contract as a backend instead of a server-hosted api is scalability. Because the chain is copied and maintained globally, developers do not need to worry about server-scaling for increased use or for geo-availability. However, each state change on the Ethereum blockchain requires ether. The cost per transaction far exceeds server-hosting costs at most cloud providers.  
  
An interesting functionality of IPFS I discovered was optimized file availability. I noticed that repeatedly requesting a file in 60 minute increments resulted in faster download times than requesting the same file in 48 hour increments. I believe this is the effect of IPFS's intrinsic data retrieval process. By frequently requesting the same file, I indirectly cached a copy of that file on IPFS nodes nearest my location. The same nodes in my proximity are likely garbage collecting that file after it has not been requested for some time. This explains why download times were low in the first scenario and not the second. After researching into how IPFS nodes distributes files, I confirmed this to be true. This is an extremely powerful fact, because it allows persons in remote geographical regions readily available access to frequently used resources. Something that is still difficult for conventional cloud storage providers.

***

## Resources
* Hosting
    * [Fleek](https://app.fleek.co): client deployment and IPFS gateway
    * [Infura](https://app.fleek.co/#/): ethereum and IPFS endpoint providers
    * [MetaMask](https://metamask.io): ethereum wallet 
    * [Etherscan](https://etherscan.io): contract monitoring
* Javascript and syntax documentation
    * [Solidity](https://solidity-by-example.org): smart contract language
    * [ipfs-http-client](https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client): ipfs api wrapper
    * [web3.js](https://web3js.readthedocs.io/en/v1.7.3/): blockchain api wrapper
* Local development
    * [Truffle](https://trufflesuite.com/docs/truffle/): contract deployment and debug console
    * [Ganache](https://trufflesuite.com/docs/ganache/): local blockchain environment

## Use instructions

Access the deployed dAPP through [fleek](https://dark-unit-5214.on.fleek.co)
>CID: QmWwxbnTtHiek3yTi9iuWcDtH4JaDP1kVAJjtuUzMqsCis

View the smart contract with [Etherescan](https://ropsten.etherscan.io/address/0xc73625759efb549796497cC606187cD8A361120C)
>address: 0xc73625759efb549796497cC606187cD8A361120C  

**users must have an account on the site to interact with the smart contract**
## Deploy instructions
```
cd smartcontract
truffle deploy --network ropsten
```
1. Copy the contract address of the deployed "MBRK" contract
2. In `client/src/constants.js` replace the value of `CONTRACT_ADDRESS`
```
cd client
npm run build
```
3. Using an ipfs client of your choice, upload the entire build directory at `client/build`
    * [IPFS Desktop](https://docs.ipfs.io/install/ipfs-desktop/)
5. Copy the CID hash pointing to the uploaded **folder*
6. Access the deployed dApp through an ipfs gateway.
    * you may add the cid to the end any of these:
    * https://ipfs.infura.io/ipfs/
    * https://ipfs.io/ipfs/
    * https://ipfs.fleek.co/ipfs/

## Author
Moubarak Jeje  
jeje@wisc.edu