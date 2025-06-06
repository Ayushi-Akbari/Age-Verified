const Market = require("../models/MarketModel")
const User = require("../models/UserModel")

const addMarket = async(req,res) => {
    const {language , country, primary} = req.body
    const { shop } = req.query;

    const isUser = await User.findOne({ host: shop });
    if (!isUser) {
        return res.status(404).send({ messgae: "Shop Is Not Found." });
    }

    let market = await Market.findOne({ shop_id: isUser._id })
    
    if(market){
        if (primary) {
            market.market = market.market.map(entry => ({
            ...entry,
            primary: false,
            }));
        }

        const exists = market.market.some(
            (entry) => entry.language === language && entry.country === country
        );
        if (!exists) {
            market.market.push({ language, country, primary });
            await market.save();
        }
    }else{
        market = await Market.create({
            shop_id: isUser._id,
            shop_name: shop,
            market: {
                language,
                country,
                primary
            }
        })
    }

    if (!market) {
        return res.status(404).send({ messgae: "Market Is Failed to Add." });
    }
    return res.status(200).send({ market, messgae: "Market Is Added Successfully." });
}

const getMarket = async(req,res) => {
    const { shop } = req.query;

    const isUser = await User.findOne({ host: shop });
    if (!isUser) {
        return res.status(404).send({ messgae: "Shop Is Not Found." });
    }

    let market = await Market.findOne({ shop_id: isUser._id })

    if(!market){
        return res.status(404).send({ messgae: "Market Data Is Not Found." });
    }

    return res.status(200).send({ market, messgae: "Market Data Fetched Successfully." });
}

const deleteMarket = async (req, res) => {
  try {
    const { id, shop } = req.query;

    const isUser = await User.findOne({ host: shop });
    if (!isUser) {
      return res.status(404).send({ messgae: "Shop Is Not Found." });
    }

    let market = await Market.findOne({ shop_id: isUser._id });
    if (!market) {
      return res.status(404).send({ messgae: "Market Is Not Found." });
    }

    market.market = market.market.filter(
      (entry) => entry._id.toString() !== id.toString()
    );
    await market.save();

    return res.status(200).send({ market, messgae: "Market Is Deleted Successfully." });
  } catch (error) {
    console.error("Delete Market Error:", error);
    return res.status(500).send({ messgae: "Internal Server Error", error: error.message });
  }
};

const setPrimaryMarket = async(req,res) => {
    try {
    const { shop } = req.query;
    const { id } = req.body

    const isUser = await User.findOne({ host: shop });
    if (!isUser) {
      return res.status(404).send({ messgae: "Shop Is Not Found." });
    }

    let market = await Market.findOne({ shop_id: isUser._id });
    if (!market) {
      return res.status(404).send({ messgae: "Market Is Not Found." });
    }

    market.market.forEach((entry) => {
        if (entry._id.toString() === id.toString()) {
            entry.primary = true;
        } else {
            entry.primary = false;
        }
        });
    await market.save();

    return res.status(200).send({ market, messgae: "Market Is Updated Successfully." });
  } catch (error) {
    console.error("Delete Market Error:", error);
    return res.status(500).send({ messgae: "Internal Server Error", error: error.message });
  }
}

module.exports = {addMarket , getMarket, deleteMarket, setPrimaryMarket}