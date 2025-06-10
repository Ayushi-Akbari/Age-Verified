import { useEffect, useState, useRef, useCallback } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import axios from "axios";
import NavMenu from "app/component/navMenu";
import webhookSubscription, {addSetting, appStatus} from "./webhook";
import { AppProvider, Card, Page, Box, Link, List, Button, ProgressBar, Spinner, Banner, Collapsible } from '@shopify/polaris';
import Cookies from 'js-cookie';
import {
  CheckSmallIcon
} from '@shopify/polaris-icons';

export const action = async ({ request }) => {
  console.log("inside action");
  const formData = await request.formData();
  const state = formData.get("state");

  console.log("state : ", state);
  

  switch (state) {
    case "index":
      console.log("index : ");
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
      console.log("access_token : ", access_token);

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

      // if (state !== "update_status") {
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

      const res = await axios.post(
        "http://localhost:8001/user/add-user",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

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

      if (result.status !== 200) {
        return { msg: "Error in webhook", status: 404 };
      }

      const setting = await addSetting(shop);
      if (setting.status !== 200) {
        return { msg: "Failed to save your settings.", status: 404 };
      }
      // }

      const themeId = userData.themes.nodes[0].id.split("/").pop();

      const status = await appStatus(shop, access_token, themeId);
      console.log("status : ", status);

      if (status.status !== 200) {
        return { msg: "Failed to save your settings.", status: 404 };
      }

      return { status: status.msg, shop, access_token, themeId };
      break;
   

    case "update_status": 
      console.log("update_status: ");
        const token = formData.get("access_token");
        const shopName = formData.get("shop");
        const theme_id = formData.get("themeId");

        const updatedStatus = await appStatus(shopName, token, theme_id);
        console.log("status : ", updatedStatus);

        if (updatedStatus.status !== 200) {
          return { msg: "Failed to save your settings.", status: 404 };
        }
        return { status: updatedStatus.msg, shop:shopName, access_token: token, themeId:theme_id };
        break;
    }
};

export default function Index() {
  const startTime = performance.now();
  const fetcher = useFetcher();
  const [status, setStatus] = useState(() => {
    const saved = Cookies.get("agex_status");
    return saved !== undefined ? JSON.parse(saved) : null;
  });
  const [enableOpen, setEnableOpen] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const submitted = useRef(false);
  const [clicked, setClicked] = useState(false);
  const [reloadClicked, setReloadClicked] = useState(true)
  const [state, setState] = useState({shop:"", access_token:"", themeId:""})

  const toggleEnable = useCallback(() => {
  setEnableOpen(prev => {
    const newValue = !prev;
    if (newValue === true) {
      setCustomizeOpen(false);
    }
    return newValue;
  });
  }, []);

  const toggleCustomize = useCallback(() => {
    setCustomizeOpen(prev => {
    const newValue = !prev;
    if (newValue === true) {
      setEnableOpen(false);
    }
    return newValue;
  });
  }, []);


  useEffect(() => {
    if (!submitted.current) {
      (async () => {
        try {
          const idToken = await shopify.idToken();
          const shop = Cookies.get('shop')
          
          if(!shop){
            const url = new URL(window.location.href);
            const shopName = url.searchParams.get("shop");
            console.log("shop:", shopName);

            if (shopName) {
              Cookies.set('shop', shopName, { 
                expires: 7, 
                secure: true, 
                sameSite: 'None' 
              });

              const cookie = Cookies.get('shop');
              console.log("cookie:", cookie);
          }
          }
          
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
            submitted.current = true;
            if (idToken && shop) {
              console.log("id token and shop present");
              
              fetcher.submit(
                { id_token: idToken, shop, state: "index" },
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
    if (fetcher.data) {
      console.log("fecther.dat : " , fetcher.data);
      setState({
        shop: fetcher.data.shop,
        access_token: fetcher.data.access_token,
        themeId: fetcher.data.themeId,
      })
      if (fetcher.data.status !== null) {
        setReloadClicked(false)
        setClicked(false)
        console.log("inside status : ");
        
      setStatus(fetcher.data.status);
    }
    //   setReloadClicked(false)
    }
  }, [fetcher.data]);

  
  const handleClick = () => {
    // setStatus(null)
    if (clicked) {
      setReloadClicked(true)
      if (state.access_token && state.shop && state.themeId) {
        console.log("state.access_token && state.shop && state.themeId present");
        
        fetcher.submit(
          { access_token: state.access_token, shop: state.shop, themeId: state.themeId, state: "update_status" },
          { method: "post", action: "/app?index" },
        );
      }
      // window.location.reload();
    } else {
      setClicked(true);
      window.open(`https://admin.shopify.com/store/${shop.split('.')[0]}/themes/${state.themeId}/editor?context=apps`, "_blank");
    }
  };

  return (
    <AppProvider>
      <Page>
        <div className="p-4 space-y-6">
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-custom text-gray-700">Dashboard</h1>
            <button className="px-4 py-2 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-100 transition">
              Support
            </button>
          </div>

          <div>
            <Banner
              title={status === false ? "AgeX is Enabled" : "AgeX is Not Activated for Your Theme"}
              tone={status === false ? "success" : "warning"}
              className="font-custom"
            >
              <div className="py-1">
                <List>
                  <List.Item>
                    <div className="text-[13px] font-custom font-light text-gray-800">
                      {status === false ? "AgeX is Currently Enabled on Your Store" : "AgeX is Currently Disabled on Your Store."}
                    </div>
                  </List.Item>
                </List>

                <div className="mt-3">
                  <Button 
                    size="large" 
                    onClick={handleClick}
                    // loading = {reloadClicked}
                  >
                    {/* {status === true ? "Enable App" : status === false ? "Disable App" : reloadClicked ? <Spinner size="small" /> : "Reload" } */}
                    {reloadClicked ? <Spinner size="small" /> : clicked ? "Reload" : status === false ? "Disable App" : "Enable App" }
                    </Button>
                </div>
              </div>
            </Banner>
          </div>

          <Box>
            <Card>
              <div className="font-medium mb-3">Setup Guide</div>
              <div className="flex">
                <div className="text-[12px] font-custom font-light text-black ">
                  {status === null ? 0 : status === false ? 2 : 1} of 2 Tasks Completed
                  <span className="font-semibold ml-3">{status === null ? '0%' : status === false ? '100%' : '50%'}</span>
                </div>
                <div className="w-1/2 my-auto ml-3">
                  <ProgressBar progress={status === null ? 0 : status === false ? 100 :50} size="small" />
                </div>
              </div>
              <div className=" py-1 font-custom font-light text-black">
                <div className={`mt-5 p-2 border border-transparent hover:border-gray-100 hover:bg-gray-100 rounded-md transition-colors ${enableOpen && "bg-gray-100"}`}>
                  <div
                    onClick={toggleEnable}
                    className={`flex text-[12px] cursor-pointer select-none ${enableOpen ? "font-semibold" : "font-custom"}`}
                  >
                    <span className="font-bold mr-1 text-green-600 flex items-center">
                      {status === false ? (
                        <CheckSmallIcon className="flex w-6 h-6" />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <g fill="#888">
                            {Array.from({ length: 18 }).map((_, i) => {
                              const angle = (i * 20) * (Math.PI / 180);
                              const x = 12 + 9 * Math.cos(angle);
                              const y = 12 + 9 * Math.sin(angle);
                              return <circle key={i} cx={x} cy={y} r="1" />;
                            })}
                          </g>
                        </svg>
                      )}

                    </span>

                    Enable App
                    <span className={`${status === false ? 'bg-green-300' : 'bg-yellow-300'} ml-2 py-[2px] px-[7px] rounded-xl text-[12px] font-normal`}>
                      {status === false ? "on" : "off"}
                    </span>
                  </div>
                  <Collapsible
                    open={enableOpen}
                    id="enable-collapsible"
                    expandOnPrint
                  >
                    <div className="text-[12px] cursor-pointer select-none py-2 px-5">
                      By activating{" "}
                      <Link
                        url={`https://admin.shopify.com/store/${state.shop.split('.')[0]}/themes/${state.themeId}/editor?context=apps`}
                        external
                      >
                        this app embed
                      </Link>
                      , you are one step closer to enabling AgeX.
                    </div>

                  </Collapsible>
                </div>

                <div className={` mt-2 p-2 border border-transparent hover:border-gray-100 hover:bg-gray-100 rounded-md transition-colors ${customizeOpen && "bg-gray-100"}`}>
                  <div
                    onClick={toggleCustomize}
                    className={`flex text-[12px] cursor-pointer select-none ${customizeOpen ? "font-semibold" : "font-custom"}`}
                  >
                    <span className="font-bold mr-1 text-green-600 flex items-center">
                      {status !== null ? (
                        <CheckSmallIcon className="flex w-6 h-6" />
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <g fill="#888">
                            {Array.from({ length: 18 }).map((_, i) => {
                              const angle = (i * 20) * (Math.PI / 180);
                              const x = 12 + 9 * Math.cos(angle);
                              const y = 12 + 9 * Math.sin(angle);
                              return <circle key={i} cx={x} cy={y} r="1" />;
                            })}
                          </g>
                        </svg>
                      )}
                    </span>
                    Customize Settings
                  </div>
                  <Collapsible
                    open={customizeOpen}
                    id="customize-collapsible"
                    expandOnPrint
                  >
                    <div className="py-2 px-5">
                      <div className="font-custom text-[12px] cursor-pointer select-none my-3">
                      Select a template and alter the AgeX settings to better suit your needs.
                    </div>
                    <Button variant="primary" size="large" onClick={() => { window.location.href = `/app/setting`}}>Settings</Button>
                    </div>
                  </Collapsible>
                </div>

                <div className="flex items-center space-x-2 mt-6 ml-2">
                  <Link
                    url="https://agex.tawk.help/category/getting-started"
                    external
                  >
                    Read App Setup Tutorials
                  </Link>
                </div>
              </div>
            </Card>
          </Box>
        </div>
      </Page>
    </AppProvider>
  );
}