import React, {useEffect} from 'react';
// import { AppProvider, Button } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import Button from "./app.plans"
import { useLoaderData } from "@remix-run/react";

export default function AdditionalPage() {
  const startTime = performance.now(); 
    const handleClick = () => {
      alert("button clicked");
      console.log("button Clicked");
      
    };

     useEffect(() => {
        requestAnimationFrame(() => {
      const endTime = performance.now();
      const renderDuration = endTime - startTime;
      console.log(`UI design load/render time anyalytics page: ${renderDuration.toFixed(2)} ms`);
    });
      }, []);
  
    return (
      <Button onClick={handleClick} />
    );
  }

