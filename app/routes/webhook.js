import { encrypt, decrypt } from "./encryption.server";
import axios from "axios";
import { countryOptions, languageOptions } from "app/component/market";

const webhookSubscription = async (store_name, token, store_user_id) => {
  const webhookEvents = ["app/uninstalled", "shop/update", "themes/publish"];

  if (!store_name || !token || !store_user_id) {
    throw new Error("Store name is missing or null!");
  }

  const query = `query {
        webhookSubscriptions(first: 10) {
          edges {
            node {
              id
              topic
              endpoint {
                __typename
                ... on WebhookHttpEndpoint {
                  callbackUrl
                }
                ... on WebhookEventBridgeEndpoint {
                  arn
                }
                ... on WebhookPubSubEndpoint {
                  pubSubProject
                  pubSubTopic
                }
              }
            }
          }
        }
      }
      `;

  const shopResponse = await fetch(
    `https://${store_name}/admin/api/2025-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query: query,
      }),
    },
  );

  if (!shopResponse.ok) {
    return { msg: shopResponse.error, status: 404 };
  }

  const data = await shopResponse.json();
  const webhookSubscriptions = data.data.webhookSubscriptions.edges;

  // Create webhook subscription
  if (!webhookSubscriptions || webhookSubscriptions.length === 0) {
    if (webhookEvents.length > 0) {
      const encryptedStoreUserId = encrypt(store_user_id);
      console.log("encryptedStoreUserId : ", encryptedStoreUserId);

      for (const topic of webhookEvents) {
        const fileName = `${topic.replace("/", "-")}?suid=${encodeURIComponent(encryptedStoreUserId)}`;

        let topicData;
        switch (topic) {
          case "app/uninstalled":
            topicData = "APP_UNINSTALLED";
            break;
          case "shop/update":
            topicData = "SHOP_UPDATE";
            break;
          case "themes/publish":
            topicData = "THEMES_PUBLISH";
            break;
          default:
            topicData = topic.toUpperCase().replace("/", "_");
        }

        console.log('Registering webhook for topic:', topic, 'as', topicData, '->', fileName);

        const callbackUrl = `https://4a8c-2405-201-200d-173-6487-cbd4-8793-893.ngrok-free.app/hooks/${fileName}`;

        console.log("callbackUrl : ", callbackUrl);

        const mutation = `
            mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
            webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
            webhookSubscription {
                id
                topic
                format
                endpoint {
                __typename
                ... on WebhookHttpEndpoint {
                    callbackUrl
                }
                }
            }
            userErrors {
                field
                message
            }
            }
        }
        `;

        const variables = {
          topic: topicData,
          webhookSubscription: {
            callbackUrl,
            format: "JSON",
          },
        };

        try {
          const response = await fetch(
            `https://${store_name}/admin/api/2025-04/graphql.json`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": token,
              },
              body: JSON.stringify({ query: mutation, variables }),
            },
          );

          const data = await response.json();
          console.log(" data : ", data);

          if (data.data.userErrors) {
            return { msg: data.data.userErrors, status: 404 };
          }

          console.log(
            "data.userErrorrs :  ",
            data.data.webhookSubscriptionCreate,
          );
        } catch (error) {
          return { msg: error, status: 404 };
        }
      }
    }
  }
  console.log("done : ");

  return { msg: "done", status: 200 };
};

const initialState = {
  customization: {
    layout: "template1",
    age: "18",
    verify_method: "no-input",
    date_fromat: "european_date",
    popup_show: false,
  },
  title: {
    text: "Welcome!",
    text_weight: "400",
    fonts: "serif",
    text_size: 35,
    text_color: "#535050",
  },
  description: {
    text: "Please verify that you are 18 years of age or older to enter this site.",
    text_weight: "100",
    fonts: "sans-serif",
    text_size: 14,
    text_color: "#8d8686",
  },
  acceptButton: {
    text: "Yes, I’m under 18",
    fonts: "sans-serif",
    text_weight: "500",
    text_size: 14,
    text_color: "#ffffff",
    background_color: "#007f5f",
    border_color: "#007f5f",
    border_width: 1,
    border_radius: 6,
    redirect_url: "",
  },
  rejectButton: {
    text: "No, I’m over 18",
    fonts: "sans-serif",
    text_weight: "100",
    text_size: 14,
    text_color: "#000000",
    background_color: "#cccccc",
    border_color: "#cccccc",
    border_width: 1,
    border_radius: 6,
  },
  popUp: {
    height: "400",
    width: "620",
    border_radius: "20",
    border_width: "1",
    top_bottom_padding: "25",
    left_right_padding: "30",
  },
  popUpBackground: {
    background_color: "#ffffff",
    border_color: "#4e1818",
    background_opacity: "1",
    image_enabale: true,
    image: `http://localhost:8001/image/background_image.png`,
    imageFile: "",
  },
  outerPopUpBackground: {
    background_color: "#959aa3",
    outer_opacity: "0.8",
    image_enabale: false,
    image: null,
    imageFile: "",
  },
  popUpLogo: {
    show_logo: true,
    logo_square: false,
    image: `http://localhost:8001/image/logo.png`,
    imageFile: "",
  },
  policy: {
    checked: true,
    text: "",
  },
  monthlyAnalysis: false,
  advanced: {
    css: "",
    script: "",
  },
  displayCriteria: {
    page: "all-pages",
    count: 0,
    url: [],
  },
  imageFile: null,
  market: "",
};

const htmlData = `<div style="background-color: rgb(149, 154, 163); width: 100%; padding: 3rem;"><div style="display: flex; justify-content: center; align-items: center; width: 100%;"><div style="box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px; display: flex; flex-direction: row; width: 620px; height: 400px; border: 1px solid rgb(78, 24, 24); border-radius: 20px; background-color: rgb(255, 255, 255); opacity: 1;"><div style="width: 45%; display: flex; justify-content: center; align-items: center;"><img src="http://localhost:8001/image/background_image.png" alt="Popup background" style="width: 100%; height: 100%; object-fit: cover; border-top-left-radius: 20px; border-bottom-left-radius: 20px;"></div><div style="width: 55%; padding: 0.5rem 1rem 1rem; display: flex; flex-direction: column; align-items: center; margin-left: 1rem; text-align: center;"><div style="display: flex; justify-content: center; align-items: center; margin: 1rem 1rem 1.2rem; width: 100px; height: 100px;"><img src="http://localhost:8001/image/logo.png" alt="Popup Logo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 9999px;"></div><span style="display: block; font-weight: 400; font-size: 35px; font-family: serif; color: rgb(83, 80, 80); margin-bottom: 20px;">Welcome!</span><span style="display: inline-block; font-weight: 100; font-size: 14px; font-family: sans-serif; color: rgb(141, 134, 134); line-height: 2;">Please verify that you are 18 years of age or older to enter this site.</span><div style="margin-top: 1rem; width: 100%; display: flex;"><div style="display: flex; column-gap: 1rem; justify-content: center; align-items: center; width: 100%;"><button id="acceptButton" style="transform: scale(1); transition: transform 0.1s; font-size: 14px; color: rgb(255, 255, 255); background-color: rgb(0, 127, 95); border-width: 1px; border-color: rgb(0, 127, 95); border-radius: 6px; font-weight: 500; font-family: sans-serif; padding: 0.6rem 1.5rem; width: fit-content;">Yes, I’m under 18</button><button id="rejectButton" style="transform: scale(1); transition: transform 0.1s; font-size: 14px; color: rgb(0, 0, 0); background-color: rgb(204, 204, 204); border-width: 1px; border-color: rgb(204, 204, 204); border-radius: 6px; font-weight: 100; font-family: sans-serif; padding: 0.6rem 1.5rem; width: fit-content;">No, I’m over 18</button></div></div><div style="margin-top: 1.25rem;"></div></div></div></div></div>`;

function resolveImagePath(relativeUrl) {
  const cleanPath = relativeUrl.startsWith("/") ? relativeUrl.slice(1) : relativeUrl;
  return path.join(process.cwd(), cleanPath);
}

const fetchMarket = async(shop) => { 
  if(shop){
    const res = await axios.get(
      `http://localhost:8001/market/get-market?shop=${shop}`,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if(res.status === 200){
      const market = res.data.market.market
      const sortedMarket = [...market].sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0));
      const marketOptions = sortedMarket.map((data) => ({
        label: `${countryOptions.find(opt => opt.value === data.country)?.label || data.country} (${languageOptions.find(opt => opt.value === data.language)?.label || data.language})${data.primary ? " (Primary)" : ""}`,
        value: data._id
      }));

      return marketOptions[0].value
    }
  }
  else{
    return null
  }
}

export const addSetting = async (shop) => {
  const latestState = initialState;
  const htmlContent = htmlData

  const market = await fetchMarket(shop)
  latestState.market = market

  const removeImages = (obj) => {
    const { image, ...rest } = obj;
    rest.imageFile = null;
    return rest;
  };
  const formData = new FormData();

  formData.append("popUpLogoImage", latestState.popUpLogo.imageFile);
  formData.append(
    "popUpBackgroundImage",
    latestState.popUpBackground.imageFile,
  );
  formData.append(
    "outerPopUpBackgroundImage",
    latestState.outerPopUpBackground.imageFile,
  );

  formData.append("customization", JSON.stringify(latestState.customization));
  formData.append("title", JSON.stringify(latestState.title));
  formData.append("description", JSON.stringify(latestState.description));
  formData.append("acceptButton", JSON.stringify(latestState.acceptButton));
  formData.append("rejectButton", JSON.stringify(latestState.rejectButton));
  formData.append("popUp", JSON.stringify(latestState.popUp));
  formData.append(
    "outerPopUpBackground",
    latestState.outerPopUpBackground.imageFile
      ? JSON.stringify(removeImages(latestState.outerPopUpBackground))
      : JSON.stringify(latestState.outerPopUpBackground),
  );
  formData.append(
    "popUpLogo",
    latestState.popUpLogo.imageFile
      ? JSON.stringify(removeImages(latestState.popUpLogo))
      : JSON.stringify(latestState.popUpLogo),
  );
  formData.append(
    "popUpBackground",
    latestState.popUpBackground.imageFile
      ? JSON.stringify(removeImages(latestState.popUpBackground))
      : JSON.stringify(latestState.popUpBackground),
  );
  formData.append("policy", JSON.stringify(latestState.policy));
  formData.append("advanced", JSON.stringify(latestState.advanced));
  formData.append(
    "displayCriteria",
    JSON.stringify(latestState.displayCriteria),
  );
  formData.append("market", latestState.market);
  formData.append("monthlyAnalysis", latestState.monthlyAnalysis);
  formData.append("htmlContent", htmlContent);
  formData.append("type","index")

  // for (let pair of formData.entries()) {
  //   console.log(`${pair[0]}:`, pair[1]);
  // }

  const response = await axios.post(
    `http://localhost:8001/setting/add-setting?shop=${shop}`,
    formData,
  );

  if(response.status !== 200){
    return { msg: 'Failed To Add Setting Data', status: 404 };
  }
  return { msg: 'Successfully Add Setting Data', status: 200 };
};

export const appStatus = async(shop, access_token, themeId) => {
  const assetUrl = `https://${shop}/admin/api/2025-04/themes/${themeId}/assets.json?asset[key]=config/settings_data.json`;
  
    const response1 = await fetch(assetUrl, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': access_token,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response1.ok) {
      return {
        result: 'error',
        msg: `Failed to fetch settings_data.json: ${response1.statusText}`,
      };
    }
  
    const assetData = await response1.json();   
    const settingsDataRaw = assetData?.asset?.value;

      let settingsJson;
    try {
      settingsJson = JSON.parse(settingsDataRaw);      
    } catch (err) {
      return {
        result: 'error',
        msg: 'Invalid JSON in settings_data.json',
      };
    }
  
    const blocks = settingsJson?.current?.blocks || {};    
    const blockDetails = blocks["5625791456518310532"]
  
    let appStatus = '0';
    if (blockDetails && !blockDetails.disabled) {
      appStatus = '1';
    }

    console.log("app status : " , appStatus);
    

    const res = await axios.put(
        `http://localhost:8001/user/update-app-status?shop=${shop}`, {appStatus},
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      
      // console.log("res : " , res);
      
    
      if (res.status !== 200) {
        return { msg: res.error, status: 404 };
      }
       
    return { msg: res.data.data, status: 200 };
}

export default webhookSubscription;