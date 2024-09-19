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
const { ObjectId } = require('../base/BaseSchema');
const { isValidAdmin } = require('../auth/middleware');

const conn = web3.connection;

router.get('/admin/dashboard/data/:wallet', isValidAdmin, getDashboardData)

router.post('/admin/reward/rate', setRewardRate)
router.patch('/admin/reward/rate', isValidAdmin, updateRewardRate)

router.post('/admin/character/add', createCharacter)
router.post('/admin/character/update', updateCharacter)

// add nft token contract and character
router.post("/admin/nft/create", isValidAdmin, createNFT)
router.post("/admin/nft/update", isValidAdmin, updateNFT)
router.post("/admin/nft/delete", isValidAdmin, deleteNFT)

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
                id: nft.id,
                address: nft.address,
                // characters: characters,
                character: characters.length > 0 ? characters[0] : {},
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
        let rateData;
        if(id){
            rateData = await Reward.findById(id);
            rateData.rate = rate
            await rateData.save()
        }else{
            rateData = new Reward({
                rate: rate,
                mode: "PVE",
            })
            await rateData.save();
        }
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
        let nftMeta = await getMeta(conn, nft.address)
        nft = {
            id: nft.id,
            address: nft.address,
            character: nft.character, 
            image: nftMeta?.json?.image
        }
        res.json({ code: '00', data: nft, message: null })
    } catch (error) {
        res.json({ code: '02', message: error.message })
    }
}
async function updateNFT(req, res, next){
    try {
        const { nftId, character } = req.body;
        let nft = await NFT.findById(nftId)
        nft.character = [character];
        await nft.save();
        let nft_info = await NFT.findById(nftId).populate("character");
        let result = {
            id: nft.id,
            address: nft.address,
            character: nft_info?.character.length > 0 ? nft_info?.character[0] : {}, 
        }
        res.json({ code: '00', data: result, message: null })
    } catch (error) {
        res.json({ code: '02', message: error.message })
    }
}

async function deleteNFT(req, res, next){
    try {
        const { nftId } = req.body;
        let nft = await NFT.findByIdAndDelete(nftId)
        res.json({ code: '00', data: nft, message: null })
    } catch (error) {
        res.json({ code: '02', message: error.message })
    }
}

module.exports = router;