import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import axios from 'axios'

export const action = async ({ request }) => {
  const formData = await request.formData();
  const id_token = formData.get("id_token");
  const shop = formData.get("shop");

  console.log("id_token : ", id_token);

  console.log("shop : ", shop);

  const url = `https://${shop}/admin/oauth/access_token`;+

  console.log("process.env.SHOPIFY_API_KEY : ", process.env.SHOPIFY_API_KEY);
  console.log("process.env.SHOPIFY_API_SECRET : " , process.env.SHOPIFY_API_SECRET);
  
  const data = {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: id_token,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    requested_token_type:
      "urn:shopify:params:oauth:token-type:offline-access-token",
  };

  console.log("data : ", data);
  

  const response = await axios.post(url, data);
  console.log("response : ", response);

  if (response.status !== 200) {
    return {msg: response.error , status : 404};
  }

  const access_token = response.data.access_token

  const query = `
  query ShopName {
    shop {
      billingAddress {
        countryCodeV2
        phone
      }
      email
      id
      name
      plan {
        displayName
        partnerDevelopment
        shopifyPlus
      }
      currencyCode
      currencyFormats {
        moneyFormat
      }
      timezoneAbbreviation
      ianaTimezone
      primaryDomain {
        host
      }
    }
    shopLocales(published: true) {
      primary
      locale
    }
  }
`;
  // Now query Shopify GraphQL API
  const shopResponse = await fetch(
    `https://${shop}/admin/api/2023-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": access_token,
      },
      body: JSON.stringify({
        query: query,
      }),
    }
  );

  if (shopResponse.status !== 200) {
    return {msg: shopResponse.error , status : 404};
  }
  console.log("shopifyResponse 1 : " , shopResponse);

  const json = await shopResponse.json();
  console.log("json : " , json);

  const themeResponse = await fetch(`https://${shop}/admin/api/2023-10/themes.json`, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": access_token,
      "Content-Type": "application/json"
    }
  });

  if (themeResponse.status !== 200) {
    return {msg: themeResponse.error , status : 404};
  }
  const themeData = await themeResponse.json();
  const mainTheme = themeData.themes.find(theme => theme.role === "main");
  console.log("Themes:", themeData.themes);

const fetcherdata = {
    status: 200,
    data : json.data,
    theme : mainTheme
}
  return fetcherdata;
};

export default function Index() {
  const shopify = useAppBridge();
  const fetcher = useFetcher();
  const [retrieved, setRetrieved] = useState(false);
  const [idToken, setIdToken] = useState(null)
  const [userData, setUserData] = useState(null)


  useEffect(() => {
    if (!retrieved && fetcher.state === "idle" && !fetcher.data) {
      async function fetchIdTokenAndSubmit() {
        const idToken = await shopify.idToken();
        setIdToken(idToken)

        const url = new URL(window.location.href);
        const shop = url.searchParams.get("shop");
        console.log("shop:", shop);

        fetcher.submit(
          { id_token: idToken, shop },
          { method: "post", action: "/app?index" }
        );
      }

      fetchIdTokenAndSubmit();
    }

    // Check when data comes back
    if (fetcher.data && !retrieved) { 
      async function fetchUserData() {
        const userData = fetcher.data.data
      const theme = fetcher.data.theme

      console.log("theme : " , theme);
      

      const data = {
        email: userData.shop.email,
        token_id: idToken,
        shop_id: userData.shop.id,
        shop_name: userData.shop.name,
        country_code: userData.shop.billingAddress.countryCodeV2,
        phone: userData.shop.billingAddress.phone,
        plan_displayName: userData.shop.plan.displayName,
        plan_partnerDevelopment: userData.shop.plan.partnerDevelopment,
        plan_shopifyPlus: userData.shop.plan.shopifyPlus,
        currency_code: userData.shop.currencyCode,
        currency_format: userData.shop.currencyFormats.moneyFormat,
        timezoneAbbreviation: userData.shop.timezoneAbbreviation,
        ianaTimezone: userData.shop.ianaTimezone,
        host: userData.shop.primaryDomain.host,
        shopLocales_primary: userData.shopLocales.primary,
        shopLocales_locale: userData.shopLocales.locale,
        theme_id: theme.admin_graphql_api_id,
      }

      console.log("data : " , data);

      // const response = await axios.post("http://localhost:8001/user/add-setting", data)

      console.log("response : " , response);

      setUserData(response.data.userData)
      
      setRetrieved(true);
      } 
      fetchUserData()

      console.log("userData : " , userData);
      
    }
  }, [fetcher, retrieved, shopify, userData]);

  return (
    <Page>
      Hello
    </Page>
  );
}

