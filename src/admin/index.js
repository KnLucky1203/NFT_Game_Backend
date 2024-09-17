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
const validator = require("./admin.validator");
const conn = web3.connection;

router.get('/admin/dashboard/data', getDashboardData)
router.post('/admin/reward/rate', setRewardRate)
router.patch('/admin/reward/rate', updateRewardRate)
router.post('/admin/character/add', addCharacter)
router.post('/admin/character/update', updateCharacter)

async function getDashboardData(req, res, next){
    try {
        let nfts = await NFT.find({});
        res.json({code:'00', data: {
            taxWallet: process.env.ADMIN_WALLET,
            token: REWARD_TOKEN,
            taxPerUnit: 0.5,
            nfts: nfts
        }})
    } catch(err) {
        res.json(err.message);
    }
}

async function setRewardRate(req, res, next) {
    try {
        await validator.setRewardRate(req);
        const {rate, mode} = req.body;
        let reward = new Reward ({
           rate, mode 
        });
        await reward.save();
        res.json({ code: '00', data: reward, message: null})
    } catch (error) {
        res.json({ code: '02', message: error.message});
    }
}

async function updateRewardRate(req, res, next) {
    try {
        const { rate, mode, id } = req.body;
        let rateData = await Reward.findById(id);
        rateData.rate = rate
        await rateData.save()
        res.json({ code: '00', data: rateData, message: null})
    } catch (error) {
        res.json({ code: '03', message: error.message})
    }
}

async function addCharacter(req, res, next) {
    try{
        const { address, name, symbol, image } = req.body;
        let character = new Character({
            name,
            symbol,
            address,
            image,
        })
        await character.save();
        res.json({ code: '00', data: character, message: null })
    }catch(err){
        res.json({ code: '02', message: err.message })
    }
}

async function updateCharacter(req, res, next) {
    try {
        const {id, address, name, symbol, image} = req.body
        let character = await Character.findById(id);
        character.name = name;
        character.symbol = symbol;
        character.image = image;
        character.address = address;
        await character.save()
        return res.json({ code: '00', data: {}, message: null })
    } catch(err) {
        res.json({ code: '02', message: err.message })
    }
}

module.exports = router;