const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const router = express.Router()
const { getNFTswithImage, getNFTOne } = require('../../metaplex');
const { REWARD_TOKEN, getWalletTokenBalance } = require("../../simple");
const web3 = require("../../web3")
const { User } = require('../user/user.model');
const { NFT } = require("../nft/nft.model");
const { Reward } = require("../base/reward.model");
const { Character } = require("../base/character.model");
const validator = require("./base.validator");
const conn = web3.connection;

router.get('/base/reward/rate', getRewardRate)
router.get('/base/character', getCharacter)

async function getRewardRate(req, res, next){
    try {
        await validator.getRewardRate(req);
        let { mode } = req.query;
        mode = mode ? mode : "PVP"
        let rewards = await Reward.findOne({mode: mode});
        res.json({code:'00', data: { rate: rewards.rate, id: rewards.id }, message: null})
    } catch(err) {
        res.json({code: '02', message: err.message});
    }
}

async function getCharacter(req, res, next) {
    try {
        let character = await Character.find();
        res.json({ code: '00', data: character.map(({ createdAt, updatedAt, __v, ...rest}) => rest), message: null })
    } catch (error) {
        
    }
}

module.exports = router;