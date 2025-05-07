const fetch = require('node-fetch'); // Make sure you install node-fetch or use a compatible method

async function fetchThemeLiquidFile( accessToken) {
  // Step 1: Fetch the list of themes
  const shopifyStoreUrl = "https://my-app-s.myshopify.com"
  const accessToken = "71772b28f37947861384f3c7566250d3"
  const response = await fetch(`${shopifyStoreUrl}/admin/api/2025/themes.json`, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  console.log("data : ", data);
  
  
  // Step 2: Identify the default theme (the one with role: 'main')
  const defaultTheme = data.themes.find(theme => theme.role === 'main');
  if (!defaultTheme) {
    throw new Error('Default theme not found.');
  }

  // Step 3: Fetch the theme.liquid file from the default theme
  const themeId = defaultTheme.id;

  const themeFiles = await fetch(`${shopifyStoreUrl}/admin/api/2025/themes/${themeId}/assets.json?asset[key]=templates/theme.liquid`, {
    method: 'GET',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  const themeFileData = await themeFiles.json();
  
  if (!themeFileData.asset) {
    throw new Error('theme.liquid file not found.');
  }

  return themeFileData.asset.value; // This is where the theme.liquid content would be
}

async function callFetchThemeLiquidFile() {
    try {
      const accessToken = "71772b28f37947861384f3c7566250d3"; // Replace with your access token
      const themeLiquidContent = await fetchThemeLiquidFile(accessToken);
      
      console.log("Theme Liquid Content: ", themeLiquidContent); // Output the content of the theme.liquid
    } catch (error) {
      console.error("Error fetching theme liquid file:", error);
    }
  }
  
  // Call the function
  callFetchThemeLiquidFile();
