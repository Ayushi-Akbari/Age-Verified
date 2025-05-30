import { useEffect, useState, useRef } from "react";
import { useFetcher } from "@remix-run/react";
import { Button, AppProvider, Page, Text, Box, Card, List } from "@shopify/polaris";
import axios from "axios";
import NavMenu from "app/component/navMenu";
import webhookSubscription from "./webhook.server";
import { constants } from "buffer";

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

  if (!shop || !credential) {
    throw new Error("Store name is missing or null!");
  }

  //Access token
  const url = `https://${shop}/admin/oauth/access_token`;
  if (!url) {
    throw new Error("URL is missing or null!");
  }

  const response = await axios.post(url, credential);
  if (response.status !== 200) {
    return { msg: response.error, status: 404 };
  }
  const access_token = response.data.access_token;

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
    },
  );

  if (shopResponse.status !== 200) {
    return { msg: shopResponse.error, status: 404 };
  }

  const json = await shopResponse.json();
  const userData = json.data;

  // Shop detail store to database
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
  };

  const res = await axios.post("http://localhost:8001/user/add-shop", data);
  if (res.status !== 200) {
    return { msg: shopResponse.error, status: 404 };
  }

  if (!shop || !access_token || !res.data.userData._id) {
    throw new Error("Shop, access token or user ID is missing or null!");
  }
  const result = await webhookSubscription(
    shop,
    access_token,
    res.data.userData._id,
  );
  console.log("result : ", result);

  return { data: res.data, access_token: access_token };
};

export default function Index() {
  const startTime = performance.now();
  const fetcher = useFetcher();

  const [message, setMessage] = useState(null);
  const submitted = useRef(false);

  useEffect(() => {
    if (!submitted.current) {
      submitted.current = true;
      (async () => {
        try {
          const idToken = await shopify.idToken();
          const url = new URL(window.location.href);
          const shop = url.searchParams.get("shop");

          const { granted } = await shopify.scopes.query();

          const requiredScopesString = import.meta.env.VITE_OPTIONAL_SCOPES;
          const requiredScopes = requiredScopesString.split(",");
          const scopeArray = requiredScopes.filter(
            (scope) => !granted.includes(scope),
          );

          if (scopeArray.length > 0) {
            const response = await shopify.scopes.request(scopeArray);

            if (response.result === "granted-all") {
              window.location.reload();
            } else if (response.result === "declined-all") {
            }
          } else {
            if (idToken && shop) {
              fetcher.submit(
                { id_token: idToken, shop },
                { method: "post", action: "/app?index" },
              );
            }
          }
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      })();
    }

    requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderDuration = endTime - startTime;
      console.log(
        `UI design load/render time index page: ${renderDuration.toFixed(2)} ms`,
      );
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("Updated after 5 seconds!");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  console.log("hiiiiiiiiiiiiii app index");

  return (
    <AppProvider>
      <Page>
        <div className="p-4 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-700 font-sans">
              Dashboard
            </h1>
            <button className="px-4 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-100 transition">
              Support
            </button>
          </div>

          <div>
            <Box>
              <Card padding="0">
                <div className="bg-green-800 text-white p-2.5">
                  AgeX is Enabled
                </div>

                <div className="px-4 py-3">
                  <List>
                    <List.Item>
                      AgeX is Currently Enabled on Your Store.
                    </List.Item>
                  </List>
                  <div className="mt-3">
                      <Button large>Disable App</Button>
                  </div>
                  
                </div>
              </Card>
            </Box>
          </div>
        </div>
      </Page>
    </AppProvider>
  );
}
