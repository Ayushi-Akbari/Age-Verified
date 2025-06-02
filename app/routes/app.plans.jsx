// PolarisButtonExample.jsx
import React from 'react';
import { AppProvider, Button, Page } from '@shopify/polaris';

export default function PolarisButtonExample({ onClick, message }) {
  console.log("PolarisButtonExample received onClick:", onClick);
  message= 'click me'

  return (
   <div>Hello</div>
  );
}
