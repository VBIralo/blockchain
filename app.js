var md5 = require('crypto-md5');
var fs = require('fs');
var chains = require(__dirname + "/chains.json");

class Block {
    constructor(data) {
        this.index = 0;
        this.data = data;
        this.previousHash = '';
        this.timestamp = Date.now();
        this.nonce = 0;
        this.hash = this.CalcHash();
    }

    CalcHash() {
        return md5((this.index + JSON.stringify(this.data) + this.previousHash + this.timestamp + this.nonce).toString(), 'hex');
    }

    mineBlock(difficulty) {
        console.log('Mining...')
        while (this.hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            this.nonce++;
            this.hash = this.CalcHash();
        }
        return console.log(`Block #${this.index} | ${this.data[0].from} -> ${this.data[0].to} | ${this.data[0].amount} \nBlock Hash: ${this.hash}\n---------------`)
    }
};

class Blockchain {
    constructor() {
        if (chains.length == 0) {
            this.chain = [this.createGenesisBlock()];
        } else {
            this.chain = chains;
        };
        this.pow = 1;
    }

    createGenesisBlock() {
        return new Block([new Transaction('', '', 1000)]);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    getBlocks() {
        return this.chain.map(a => a)
    }

    saveBlocks() {
        return fs.writeFileSync(__dirname + "/chains.json", JSON.stringify(this.chain, null, "\t"));
    }

    addNewBlock(newBlock) {
        newBlock.index = this.getLatestBlock().index + 1;
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.pow);
        this.chain.push(newBlock);
    }

    isChainValid() {
        return validateChain(this.chain, this.pow)
    }

    findTx(txf) {
        return this.chain.some((block) => {
            return findTransaction(block.data, txf);
        })
    }
}

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.timestamp = Date.now();
        this.hash = this.CalcHash();
    }
    CalcHash() {
        return md5((this.from + this.to + this.amount).toString(), 'hex');
    }
}

let findTransaction = (txs, txf) => {
    return txs.find((tx) => tx.hash == txf.hash);
}

let validateChain = (chain, pow) => {
    return chain.every((currentBlock) => {
        if (currentBlock.index > 0) {
            const previousBlock = chain[currentBlock.index - 1];

            if (previousBlock.index + 1 !== currentBlock.index) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
            if (currentBlock.hash.substring(0, pow) !== '0'.repeat(pow)) {
                return false;
            }
        }

        if (currentBlock.hash !== currentBlock.CalcHash()) {
            return false;
        }

        return true;
    })
}

module.exports = {
    Blockchain,
    Block,
    Transaction
}

module.exports.findTransaction = findTransaction;
module.exports.validateChain = validateChain;

var bc = new Blockchain;

bc.addNewBlock(new Block([new Transaction('Vlad', 'Sasha', 1200)]))
bc.addNewBlock(new Block([new Transaction('Sasha', 'Lesha', 1000)]))
bc.addNewBlock(new Block([new Transaction('Lesha', 'Ilya', 950)]))
bc.addNewBlock(new Block([new Transaction('Ilya', 'Annya', 700)]))
bc.addNewBlock(new Block([new Transaction('Annya', 'Dima', 20)]))

bc.saveBlocks()

//console.log("VALIDATION: " + bc.isChainValid())
//console.log(bc.getBlocks().map(a=>a.data))