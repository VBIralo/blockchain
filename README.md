<h1 align="center">A minimal blockchain with web-interface.</h1>


## 🎉 Features
- 💎 Blocks with index, hash, data, and timestamp.
- ⛏ Proof-of-work system.
- ⛓ In-memory JavaScript array to store the blockchain.
- ✅ Block integrity validation.

## 📦 Installation

To install this application, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

#### Source

You'll need [Git](https://git-scm.com) to run the project from source. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/VBIralo/blockchain

# Go into the repository
$ cd blockchain

# Install dependencies
$ npm install

# Run the app
$ npm start
```

<<<<<<< HEAD
Go to [localhost:8080/](http://localhost:8080/)

=======
>>>>>>> master
## 🎫 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## ℹ️ FAQ 

#### When or why I would use this?

You should use this if you want to build a bitcoin wallet, payment processor, or bitcoin merchant portal in javascript. You might also be interested in why decentralized networks or p2p applications are useful, or what advantages they have; this project seems like a good way to learn about that.

#### What is the block chain actually for?

The blockchain is for authorizing payments of a cryptocurrency between two peers without the need for a centralized 3rd party approving of the transaction. There are other uses of the blockchain which are more in line with the second point, digital signatures, but they are secondary to the main purpose of peer to peer transfer of value. Bitcoin is blockchain's killer app.

#### Why the hell should I care about the blockchain?

Blockchain facilitates trade over a network. Imagine a metal as scarce as gold with a magical property of "can be transported over a communications channel". This has implications with respect to individual rights, the world economy, and the way we monetize and transfer value at a level higher than bartering directly for goods.

Lately people are distancing themselves from the proof-of-work concept and are using blockchain to describe only the mechanism of signing a transaction as verification of sending an amount. Change "sending an amount" to almost anything else - authorizing a change in a ruleset, casting a vote for a politician, verifying a point of IoT data is authentic. Now add in the concept of a peer-to-peer network to this and you've eliminated a middleman that once existed, thereby improving the efficiency and reducing cost. In these cases, "blockchain" refers to the structuring of a program or database in such a way that it has no central point of failure while still providing all of the features expected. For example, augur and gnosis are decentralized prediction markets. Ethereum has implemented smart contracts which enable decentralized release of funds based on a gambling outcome.