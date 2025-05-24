import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import "@shopify/polaris/build/esm/styles.css";
import { authenticate } from "../shopify.server";
import { StrictMode } from "react";
import NavMenu from "../component/navMenu"


export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function App() {
  // const { apiKey } = useLoaderData();

  return (
    <StrictMode>
    <NavMenu />
     </StrictMode>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
