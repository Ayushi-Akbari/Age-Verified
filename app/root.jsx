import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwindStylesheetUrl from "./tailwind.css?url";
import NavMenu from "./component/navMenu";
import { useLocation } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const id_token = formData.get("id_token");
  const shop = formData.get("shop");

  const data = {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: id_token,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    requested_token_type:
      "urn:shopify:params:oauth:token-type:offline-access-token",
  };

  if (!shop || !data) {
    throw new Error("Store name is missing or null!");
  }

  //Access token
  const url = `https://${shop}/admin/oauth/access_token`;
  if (!url) {
    throw new Error("URL is missing or null!");
  }

  const response = await axios.post(url, data);

  if (response.status !== 200) {
    return { msg: response.error, status: 404 };
  }

  const access_token = response.data.access_token;

  if(!access_token){
    throw new Error("Access Token is missing or null!");
  }

  // Fetch access scopes
  const scopesResponse = await fetch(
    `https://${shop}/admin/oauth/access_scopes.json`,
    {
      headers: {
        "X-Shopify-Access-Token": access_token,
      },
    },
  );

  if (!scopesResponse.ok) {
    throw new Error("Failed to get access scopes");
  }

  const { access_scopes } = await scopesResponse.json();

  const requiredScopesString = process.env.OPTIONAL_SCOPES;
  const requiredScopes = requiredScopesString.split(",");
  const grantedScopes = access_scopes.map((scope) => scope.handle);

  const result = requiredScopes.filter(
    (scope) => !grantedScopes.includes(scope),
  );

  return { result, requiredScopes };
};

export const links = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export default function App() {
  console.log("hiiiiiiiiiiiiii");
  
  const fetcher = useFetcher();
  const submitted = useRef(false);
  const scopesRequested = useRef(false);

 useEffect(() => {

    if (!submitted.current) {
      submitted.current = true;
      (async () => {
        try {
          const idToken = await shopify.idToken();
          const url = new URL(window.location.href);
          const shop = url.searchParams.get("shop");
          if (idToken && shop) {
            fetcher.submit(
              { id_token: idToken, shop },
              { method: "post", action: "/" }
            );
          }
        } catch (error) {
          console.error("Error getting ID token:", error);
        }
      })();
    }
  }, []);

  useEffect(() => {
  if (fetcher.data && !scopesRequested.current) {
    scopesRequested.current = true;
    (async () => {
      try {
        const idToken = await shopify.idToken();
        const url = new URL(window.location.href);
        const shop = url.searchParams.get("shop");

        if (
          fetcher.data.result.length > 0 &&
          fetcher.data.requiredScopes?.length > 0
        ) {
          const response = await shopify.scopes.request(fetcher.data.result);

          if (response.result === "granted-all") {
            window.onload()
          }
        } else {
          if (idToken && shop) {
            fetcher.submit(
              { id_token: idToken, shop },
              { method: "post", action: "/app?index" }
            );
          }
        }
      } catch (err) {
        console.error("Error requesting scopes:", err);
      }
    })();
  }
}, [fetcher.data]);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />

        <meta
          name="shopify-api-key"
          content="6473332dff158d7aab8327543871590a"
        />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />

        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
