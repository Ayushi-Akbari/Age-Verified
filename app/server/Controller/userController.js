const User = require("../models/userModel")

const addSetting = async (req,res) => {

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

const getSetting = async (req,res) => {
    const {shop_name} = req.query

    if(!shop_name){
        res.status(400).json({ msg: "Store id is not found." });
    }

    const user = await User.findOne({
        where : {shop_name : shop_name}
    })

    if(!user) {
        res.status(400).json({ msg: "App Settings not found.." });
    }

    res.status(200).json({ msg: "App Setings Fetched Successfully." , data: user});

}

// const addSetting = async (req,res) => {
//     const {name} = req.query

//     console.log("name : ", name);

module.exports = {addSetting, getSetting}