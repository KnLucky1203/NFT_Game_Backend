const dotenv = require('dotenv');
dotenv.config();
const { Connection } = require('@solana/web3.js');

// const connection = new Connection(`${process.env.SOLANA_RPC}/?api-key=${process.env.API_KEY}`);
const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=5c2e7676-8a44-414f-9ea6-97004d81bcb8`);

module.exports = {
    connection
}