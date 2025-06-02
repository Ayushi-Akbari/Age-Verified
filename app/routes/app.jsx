import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server"; 
import NavMenu from "../component/navMenu"

export default function App() {
  // const { apiKey } = useLoaderData();

  return (
    <NavMenu />
    // <><Outlet />
    // </>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
