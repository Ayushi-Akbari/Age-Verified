const mongoose = require('mongoose')
const Setting = require("../models/SettingModel");
const User = require("../models/UserModel");
const Market = require("../models/MarketModel")

const addSettingData = async (req, res) => {
  console.log("req.query : ", req.query);
  const { shop } = req.query;

  const isUser = await User.findOne({ host: shop });

  if (!isUser) {
    return res.status(404).send({ messgae: "Shop Is Not Found." });
  }

  const {
    customization,
    title,
    description,
    acceptButton,
    rejectButton,
    popUp,
    popUpBackground,
    outerPopUpBackground,
    popUpLogo,
    policy,
    advanced,
    displayCriteria,
    monthlyAnalysis,
    htmlContent,
    market,
    type
  } = req.body;

  const setting = {
    customization,
    title,
    description,
    acceptButton,
    rejectButton,
    popUp,
    popUpBackground,
    outerPopUpBackground,
    popUpLogo,
    policy,
    advanced,
    displayCriteria,
    monthlyAnalysis,
  };

  if (!market) {
    return res.status(400).json({ msg: "Market ID is missing or invalid." });
  }
 
  const isPresent = await Setting.findOne({ shop_name: shop, market_id: market});

  if(type === "index" && isPresent){
    return res
      .status(200)
      .send({ messgae: "Setting Data is Present." });
  }

   const parseAndAttachImage = (key, fileKey) => {
    setting[key] = JSON.parse(setting[key] || "{}");    
    if (req?.files?.[fileKey]?.[0]) {
      setting[key].image = `/image/${isUser._id}/${market}/${req.files[fileKey][0].filename}`;
    }
    setting[key] = JSON.stringify(setting[key]);
  };
  parseAndAttachImage("popUpBackground", "popUpBackgroundImage");
  parseAndAttachImage("outerPopUpBackground", "outerPopUpBackgroundImage");
  parseAndAttachImage("popUpLogo", "popUpLogoImage");
  
  let settingData;
  if (isPresent) {
    settingData = await Setting.updateOne(
      { shop_name: shop },
      {
        $set: {
          settings: setting,
          html_content: htmlContent
        },
      },
    );
  } else {
    settingData = await Setting.create({
      shop_id: isUser._id,
      shop_name: shop,
      settings: setting,
      html_content: htmlContent,
      market_id: new mongoose.Types.ObjectId(market)
    });
  }

  if (!settingData) {
    return res.status(404).send({ messgae: "Setting Is Failed to Add." });
  }

  if (isPresent) {
    return res
      .status(200)
      .send({ messgae: "Setting Is Updated Successfully." });
  } else {
    return res.status(200).send({ messgae: "Setting Is Added Successfully." });
  }
};

const getSettingData = async (req, res) => {
  try {
    const { shop, market_id } = req.query;

    if (!shop) {
      return res
        .status(400)
        .send({ message: "Missing 'shop' query parameter." });
    }

    const isUser = await User.findOne({ host: shop });

    if (!isUser) {
      return res.status(404).send({ message: "Shop not found." });
    }

    const market = await Market.findOne({shop_id : isUser._id })
    if (!market) {
        return res.status(404).json({ msg: "Market not found for this shop." });
    }
    let marketId;

    if (market_id) {
      const marketIdObj = market.market.find(m => m._id.toString() === market_id.toString());
      marketId = marketIdObj ? marketIdObj._id : null;
    }
    if (!marketId) {
      const primaryMarket = market.market.find(m => m.primary === true);
      marketId = primaryMarket ? primaryMarket._id : null;
    }

    const settingData = await Setting.findOne({ shop_id: isUser._id, market_id: marketId });
    if (!settingData) {
      return res.status(200).send({ message: "Setting not found." });
    }
    
    return res.status(200).send({
      message: "Setting data fetched successfully.",
      data: settingData.toObject(),
    });
  } catch (err) {
    console.error("Error fetching setting data:", err);
    return res.status(500).send({ message: "Internal server error." });
  }
};

module.exports = { addSettingData, getSettingData };
