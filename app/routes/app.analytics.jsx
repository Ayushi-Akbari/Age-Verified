import React, {useEffect} from 'react';

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
      <div>Hello analytics</div>
    );
  }

