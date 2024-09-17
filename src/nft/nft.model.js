const mongoose = require('mongoose');
const { Schema } = mongoose;
const BaseSchema = require("../base/BaseSchema")
const NFTSchema = new BaseSchema({
    address: {
        required: true,
        type: String,
        unique: true,
    },
    name: {
        type: String
    },
    symbol: {
        type: String,
    },
    image: {
        type: String
    }
});

const NFT = mongoose.model('nft', NFTSchema);

module.exports = {
    NFT,
}