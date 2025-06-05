const User = require("../models/UserModel")
const Market = require("../models/MarketModel")
const addShopData = async (req,res) => {
    const data = req.body
    const updatedData = {};
    for (const key in data) {
      if (data[key] === undefined || data[key] === null) {
        updatedData[key] = null;
      } else {
        updatedData[key] = data[key];
      }
    }

    let userData = await User.findOne({ shop_name: updatedData.shop_name });
    if(userData){
        console.log("present ");
        userData.updateOne({ $set: updatedData })
    }else {
        console.log("new");
        userData = await User.create(updatedData)
    }

    let marketData = await Market.findOne({ shop_name: updatedData.shop_name });
    let market = {
        language: updatedData.shopLocales_locale.toUpperCase(),
        country: updatedData.country_code.toUpperCase(),
        primary: updatedData.shopLocales_primary
    }
    
    if(marketData){
        const exists = marketData.market.some(
            (entry) => entry.language === market.language && entry.country === market.country
        );

        if (!exists) {
            marketData.market.push({ market });
            await marketData.save();
        }
    }else{
        marketData = await Market.create({
            shop_id: userData._id,
            shop_name: updatedData.shop_name,
            market: market
        })
    }
    res.status(200).json({ userData, msg: "App Setings added Successfully." });
}

const getShopData = async (req,res) => {
    const {shop} = req.query
    if(!shop){
        res.status(400).json({ msg: "Shop is not found." });
    }
    const user = await User.findOne({ host: shop })
    if(!user) {
        res.status(400).json({ msg: "App Settings not found.." });
    }
    res.status(200).json({ msg: "App Setings Fetched Successfully." , data: user});
}

const getShopId = async (req,res) => {
    const {shop} = req.query
    
    if(!shop){
        res.status(400).json({ msg: "Shop is not found." });
    }
    const user = await User.findOne({ host: shop })

    if(!user) {
        res.status(400).json({ msg: "App Settings not found.." });
    }
    res.status(200).json({ msg: "App Setings Fetched Successfully." , data: user._id});
}

module.exports = {addShopData, getShopData, getShopId}