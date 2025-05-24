const User = require("../models/UserModel")

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
    res.status(200).json({ userData, msg: "App Setings added Successfully." });
}

const getShopData = async (req,res) => {
    const {shop_name} = req.query
    if(!shop_name){
        res.status(400).json({ msg: "Store is not found." });
    }
    const user = await User.findOne({ host: shop_name })
    if(!user) {
        res.status(400).json({ msg: "App Settings not found.." });
    }
    res.status(200).json({ msg: "App Setings Fetched Successfully." , data: user});
}

const getStoreId = async (req,res) => {
    const {shop_name} = req.query
    
    if(!shop_name){
        res.status(400).json({ msg: "Store is not found." });
    }
    const user = await User.findOne({ host: shop_name })

    if(!user) {
        res.status(400).json({ msg: "App Settings not found.." });
    }
    res.status(200).json({ msg: "App Setings Fetched Successfully." , data: user._id});
}

module.exports = {addShopData, getShopData, getStoreId}