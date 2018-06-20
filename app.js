const express = require('express');
const http = require('http');
const url = require('url');
const bodyParser = require('body-parser');
const {
    Block,
    Blockchain,
    Transaction,
    validateChain,
    findTx
} = require('./api.js')

let server_port = process.env.SERVER_PORT || 8080;
let blockchain = new Blockchain;
let transactions = [];

// WEB
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post("/addtrans", function (req, res) {
    if (!req.body) return response.sendStatus(400);
    var r = req.body;
    addTransaction(r.from, r.to, r.amount);
    transactions.push(blockchain.getLatestBlock().data[0])
    res.send(blockchain.getLatestBlock());
});

app.post("/checktrans", function (req, res) {
    if (!req.body) return response.sendStatus(400);
    var r = req.body;

    res.send(findTx(blockchain, {
        from: r.from,
        to: r.to,
        amount: r.amount
    }) ? "This is transaction is valid" : "This is transaction is invalid");
});

app.get("/generator/:n?", function (req, res) {
    function genName() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 16; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    var i = 0;
    while (i < Number(req.params.n)) {
        blockchain.addNewBlock(
            new Block(
                [new Transaction(genName(), genName(), Math.floor(Math.random()*10000))]
            )
        );
        i++;
    }

    res.send('ok');
});

app.get('/', (req, res) => res.send('<a href="/blocks" target="_blank">blocks</a><br><a href="/transactions" target="_blank">transactions</a><br><a href="/addtrans.html" target="_blank">addtrans</a><br><a href="/checktrans.html" target="_blank">checktrans</a><br><a href="/validate" target="_blank">validate</a>'));
app.get('/blocks', (req, res) => res.send(blockchain.chain.map(d => `Block: #${d.index} <br> ${d.data[0].from} -> ${d.data[0].to} <br> Amount: ${d.data[0].amount}<br>${d.hash}<br><br>`).join('\n')));
app.get('/transactions', (req, res) => res.send(JSON.stringify(transactions)));
app.get('/validate', (req, res) => {
    res.send(validateChain(blockchain.chain, blockchain.pow) ? "This chein is valid" : "This chein is invalid")
});

let addTransaction = (from, to, amount) => {
    blockchain.addNewBlock(
        new Block(
            [new Transaction(from, to, amount)]
        )
    )
}

let replaceChain = (newBlocks) => {
    if (validateChain(newBlocks, blockchain.pow) && newBlocks.length > blockchain.length) {
        blockchain.chain = newBlocks;
    } else {
        console.log('Received blockchain invalid');
    }
};

//Init Node
const server = http.createServer(app);
server.listen(server_port);