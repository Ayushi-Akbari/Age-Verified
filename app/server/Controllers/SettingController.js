const { log } = require("console");
const Setting = require("../models/SettingModel");
const User = require("../models/UserModel");

const addSettingData = async (req, res) => {
  console.log("req.query : ", req.query);
  const { shop } = req.query;

  const isUser = await User.findOne({ host: shop });

  if (!isUser) {
    return res.status(404).send({ messgae: "Shop Is Not Found." });
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

  console.log("req.files : ", req.files);
  

  const parseAndAttachImage = (key, fileKey) => {
    setting[key] = JSON.parse(setting[key] || "{}");    
    if (req?.files?.[fileKey]?.[0]) {
      setting[key].image = `/image/${req.files[fileKey][0].filename}`;
      // setting[key].imageFile = null
    }
    setting[key] = JSON.stringify(setting[key]);

    console.log("Parsed and attached image for key:", key, "Image path:", setting[key]);
    
  };
  parseAndAttachImage("popUpBackground", "popUpBackgroundImage");
  parseAndAttachImage("outerPopUpBackground", "outerPopUpBackgroundImage");
  parseAndAttachImage("popUpLogo", "popUpLogoImage");

    console.log("isPresent : " , setting.popUpBackground);
    console.log("isPresent : " , setting.outerPopUpBackground);
        console.log("isPresent : " , setting.popUpLogo);

  // console.log("htmlontent : " , htmlContent);
  
  // const isPresent = await Setting.findOne({ shop_name: shop, language: req.body.language, country: req.body.country });
  const isPresent = await Setting.findOne({ shop_name: shop});

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
      // language: req.body.language, 
      // country: req.body.country,
      // primary: req.body.primary
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
    console.log("req.query:", req.query);
    const { shop } = req.query;

    if (!shop) {
      return res
        .status(400)
        .send({ message: "Missing 'shop' query parameter." });
    }

    const isUser = await User.findOne({ host: shop });

    if (!isUser) {
      return res.status(404).send({ message: "Shop not found." });
    }

    const settingData = await Setting.findOne({ shop_id: isUser._id });
    if (!settingData) {
      return res.status(404).send({ message: "Setting not found." });
    }
    
    // let settingDetail = await Setting.findOne({ shop_id: isUser._id, language: req.body.language, country: req.body.country});

    // if(!settingDetail){
    //   settingDetail = await Setting.findOne({ shop_id: isUser._id, primary: true});
    // }


    

    return res.status(200).send({
      message: "Setting data fetched successfully.",
      data: settingData.toObject(),
    });
  } catch (err) {
    console.error("Error fetching setting data:", err);
    return res.status(500).send({ message: "Internal server error." });
  }
};

// const updateSetting = async (req, res) => {
//   const { shop  } = req.query;

//   if (!shop) {
//     return res.status(400).send({ message: "Shop name is required." });
//   }

//   // const isUser = await User.findOne({
// }

module.exports = { addSettingData, getSettingData };
