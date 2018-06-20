var md5 = require('crypto-md5');
var fs = require('fs');

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
        this.chain = sync();
        this.pow = 4;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    getBlocks() {
        return this.chain;
    }

    saveBlocks() {
        return fs.writeFileSync(__dirname + "/chains.json", JSON.stringify(this.chain, null, "\t"));
    }

    addNewBlock(newBlock) {
        newBlock.index = this.getLatestBlock().index + 1;
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.pow);
        this.chain.push(newBlock);
        fs.writeFileSync(__dirname + "/chains.json", JSON.stringify(this.chain, null, "\t"))
    }

    isChainValid() {
        return validateChain(this.chain, this.pow)
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

let sync = () => {
    var node_blocks = [];
    if (!fs.existsSync("./chains.json")) {
        node_blocks.push(new Block([new Transaction('Genesis Block', 'Genesis Block', 0)]))
        fs.writeFileSync(__dirname + "/chains.json", JSON.stringify(node_blocks, null, '\t'))
        return chains = require(__dirname + "/chains.json");
    } else {
        return chains = require(__dirname + "/chains.json");
    }
};
//sync()


let findTransaction = (txs, txf) => {
    return txs.find((tx) => tx.hash == txf.hash);
}

let findTx = (block, data) => {
    var d = md5((data.from + data.to + data.amount).toString(), 'hex')

    return block.chain.some((bl) => {
        return bl.data.find((tx) => tx.hash == d);
    })
}

let validateChain = (chain, pow) => {
    var Hash = (block) => {
        return md5((block.index + JSON.stringify(block.data) + block.previousHash + block.timestamp + block.nonce).toString(), 'hex');
    }
    return chain.every((currentBlock) => {
        if (currentBlock.index > 0) {
            const previousBlock = chain[currentBlock.index - 1];

            if (previousBlock.index + 1 !== currentBlock.index) {
                console.log('invalid index')
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('invalid hash')
                return false
            }
            if (currentBlock.hash.substring(0, pow) !== '0'.repeat(pow)) {
                console.log('invalid pow')
                return false
            }
        }

        console.log(currentBlock.hash, Hash(currentBlock))

        if (currentBlock.hash !== Hash(currentBlock)) {
            console.log('invalid calchash')
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
module.exports.findTx = findTx;