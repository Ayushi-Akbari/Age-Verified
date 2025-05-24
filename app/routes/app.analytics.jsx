import React from 'react';
// import { AppProvider, Button } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import Button from "./app.plans"
import { useLoaderData } from "@remix-run/react";

export default function AdditionalPage() {
    const handleClick = () => {
      alert("button clicked");
      console.log("button Clicked");
      
    };
  
    return (
      <Button onClick={handleClick} />
    );
  }

