const dotenv = require('dotenv');
dotenv.config();
const express = require('express')
const router = express.Router()
const { getNFTswithImage, getNFTOne, getMeta } = require('../../metaplex');
const { REWARD_TOKEN, getWalletTokenBalance } = require("../../simple");
const web3 = require("../../web3")
const { User } = require('../user/user.model');
const { NFT } = require("../base/nft.model");
const { Reward } = require("../base/reward.model");
const { Character } = require("../base/character.model");
const validator = require("./admin.validator");
const conn = web3.connection;

router.get('/admin/dashboard/data/:wallet', getDashboardData)

router.post('/admin/reward/rate', setRewardRate)
router.patch('/admin/reward/rate', updateRewardRate)

router.post('/admin/character/add', createCharacter)
router.post('/admin/character/update', updateCharacter)

// add nft token contract and character
router.post("/admin/nft/create", createNFT)
router.post("/admin/nft/update", updateNFT)
router.delete("/admin/nft/delete", deleteNFT)

async function getDashboardData(req, res, next){
    try {
        let nfts = await NFT.find().populate("character");
        let result = [];
        for( let nft of nfts){
            let nftMeta = await getMeta(conn, nft.address)
            let characters = []
            for(let character of nft.character){
                characters.push({
                    id: character.id,
                    name: character.name,
                })
            }
            result.push({
                id: nft.address,
                address: nft.address,
                model: characters,
                image: nftMeta?.json?.image,
                // metaJson: nftMeta,
            })
        }
        res.json({code:'00', data: {
            taxWallet: process.env.ADMIN_WALLET,
            token: REWARD_TOKEN,
            taxPerUnit: 0.5,
            nfts: result
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

async function createCharacter(req, res, next) {
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

async function createNFT(req, res, next){
    try {
        const { nftMintAddress, character } = req.body;
        let nft = new NFT({
            address: nftMintAddress,
            character: character,
        })
        await nft.save();
        res.json({ code: '00', data: nft, message: null })
    } catch (error) {
        res.json({ code: '02', message: error.message })
    }
}
async function updateNFT(req, res, next){
    try {
        const { nftId, character } = req.body;
        let nft = await NFT.findById(nftId)
        nft.character = character;
        await nft.save();
        res.json({ code: '00', data: nft, message: null })
    } catch (error) {
        res.json({ code: '02', message: error.message })
    }
}

async function deleteNFT(req, res, next){
    try {
        const { nftId } = req.params;
        let nft = await NFT.findById(nftId)
        nft.character = character;
        await nft.delete();
        res.json({ code: '00', data: nft, message: null })
    } catch (error) {
        res.json({ code: '02', message: error.message })
    }
}

module.exports = router;