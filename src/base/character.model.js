const mongoose = require('mongoose');
const { Schema } = mongoose;
const BaseSchema  = require("./BaseSchema")
const CharacterSchema = new BaseSchema({
    address: {
        type: String,
        unique: true,
    }, // NFT Contract Address
    name: {
        type: String
    }, // brent, bacon, 
    symbol: {
        type: String,
    }, // brent: @BouncyBrent, bacon: @BouncyBacon
    image: {
        type: String
    }
});

const Character = mongoose.model('character', CharacterSchema);

module.exports = {
    Character,
}