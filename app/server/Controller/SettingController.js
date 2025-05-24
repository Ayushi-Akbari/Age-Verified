const Setting = require("../models/SettingModel");
const User = require("../models/UserModel");

const addSettingData = async (req, res) => {
  console.log("req.query : ", req.query);
  const { shop } = req.query;

  const isUser = await User.findOne({ host: shop });

  console.log("isUser : " , isUser);
  

  if (!isUser) {
    return res.status(404).send({ messgae: "Store Is Not Found." });
  }

  const setting = ({
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
    market,
    monthlyAnalysis,
  } = req.body);

  const htmlContent = req.body.htmlContent

  const parseAndAttachImage = (key, fileKey) => {
    setting[key] = JSON.parse(setting[key] || "{}");    
    if (req?.files?.[fileKey]?.[0]) {
      setting[key].image = `/image/${req.files[fileKey][0].filename}`;
    }else{
      setting[key].image = null
    }
    setting[key] = JSON.stringify(setting[key]);
  };
  parseAndAttachImage("popUpBackground", "popUpBackgroundImage");
  parseAndAttachImage("outerPopUpBackground", "outerPopUpBackgroundImage");
  parseAndAttachImage("popUpLogo", "popUpLogoImage");

  console.log("htmlontent : " , htmlContent);
  

  const isPresent = await Setting.findOne({ shop_name: shop });
  console.log("isPresent : " , isPresent);
  
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
    settingData = Setting.create({
      shop_id: isUser._id,
      shop_name: shop,
      settings: setting,
      html_content: htmlContent
    });
  }

  console.log("settingData : " , settingData);
  

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
    console.log("req.query:", req.query);
    const { shop } = req.query;

    if (!shop) {
      return res
        .status(400)
        .send({ message: "Missing 'shop' query parameter." });
    }

    const isUser = await User.findOne({ host: shop });

    if (!isUser) {
      return res.status(404).send({ message: "Store not found." });
    }

    const settingData = await Setting.findOne({ shop_name: shop });

    if (!settingData) {
      return res.status(404).send({ message: "Setting not found." });
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
