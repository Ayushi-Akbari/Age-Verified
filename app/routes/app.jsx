import { boundary } from "@shopify/shopify-app-remix/server"; 
import NavMenu from "../component/navMenu"
import { PrefetchPageLinks, useRouteError } from "@remix-run/react";

export default function App() {
  return (
    <>
      <NavMenu />
    </>
  );
}

export function ErrorBoundary() {  
  console.log("hello");
  
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};