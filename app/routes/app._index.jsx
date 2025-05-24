import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import axios from 'axios'
import NavMenu from "app/component/navMenu";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const id_token = formData.get("id_token");
  const shop = formData.get("shop");

  const credential = {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: id_token,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    requested_token_type:
      "urn:shopify:params:oauth:token-type:offline-access-token",
  };

  if(!shop || !credential){
    throw new Error("Store name is missing or null!");
  }
  const url = `https://${shop}/admin/oauth/access_token`;
  if (!url) {
    throw new Error("URL is missing or null!");
  }
  
  const response = await axios.post(url, credential);
  // console.log("response : ", response);

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
      shopOwnerName
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
  themes(first: 10, roles: MAIN) {
      nodes {
      id
      }
  }
  shopLocales(published: true) {
      primary
      locale
  }
}
`;

  const shopResponse = await fetch(
    `https://${shop}/admin/api/2025-04/graphql.json`,
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

  const json = await shopResponse.json();
  
  const userData = json.data
 
  const data = {
    email: userData.shop.email,
    token_id: id_token,
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
    shopLocales_primary: userData.shopLocales[0].primary,
    shopLocales_locale: userData.shopLocales[0].locale,
    theme_id: userData.themes.nodes[0].id,
  }

    const res = await axios.post("http://localhost:8001/user/add-shop", data)

    if(res.status !== 200){
      return {msg: shopResponse.error , status : 404};
    }
  return res.data
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
        // console.log("shop:", shop);

        // fetcher.submit(
        //   { id_token: idToken, shop },
        //   { method: "post", action: "/app?index" }
        // );
      }

      fetchIdTokenAndSubmit();
    }

    // Check when data comes back
    if (fetcher.data && !retrieved) { 
      async function fetchUserData() {
        const userData = fetcher.data
    
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
        shopLocales_primary: userData.shopLocales[0].primary,
        shopLocales_locale: userData.shopLocales[0].locale,
        theme_id: userData.themes.nodes[0].id,
      }

      // console.log("data : " , data);

      const response = await axios.post("http://localhost:8001/user/add-shop", data)

      // console.log("response : " , response);

      setUserData(response.data.userData)
      
      setRetrieved(true);
      } 
      fetchUserData()

     
      
    }
  }, [fetcher, retrieved, shopify, userData]);

  return (
    <>
    {/* <NavMenu /> */}
    <Page>
      
      Hello
    </Page>
  
    </>
  )  
}

