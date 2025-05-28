// PolarisButtonExample.jsx
import React from 'react';
import { AppProvider, Button, Page } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';

export default function PolarisButtonExample({ onClick, message }) {
  console.log("PolarisButtonExample received onClick:", onClick);
  message= 'click me'

  return (
    <AppProvider>
      <div style={{ padding: '2rem' }}>
        <Page>
        <Button onClick={onClick} variant="primary">Button      </Button>
        <Button onClick={onClick} variant="primary">Button      </Button>
        <Button onClick={onClick} variant="primary">Button      </Button>
        <Button onClick={onClick} variant="primary">Button      </Button>
        <Button onClick={onClick} variant="primary">Button      </Button>
        </Page>
        
        
      </div>
    </AppProvider>
  );
}
