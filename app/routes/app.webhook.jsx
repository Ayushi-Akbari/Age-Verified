import { useFetcher } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import axios from "axios"
import { encrypt } from './crypto';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const id_token = formData.get("id_token");
  const shop = formData.get("shop");

  console.log("shop : " , shop);
  console.log("id_token : " , id_token);

  const credential = {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    subject_token: id_token,
    subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
    requested_token_type:
      "urn:shopify:params:oauth:token-type:offline-access-token",
  };

  const webhookEvents = [
    'app/uninstalled',
    'shop/update',
    'themes/publish'
  ];
  

  if(!shop || !credential){
    throw new Error("Store name is missing or null!");
  }
  const url = `https://${shop}/admin/oauth/access_token`;
  if (!url) {
    throw new Error("URL is missing or null!");
  }
  
  const response = await axios.post(url, credential);

  if (response.status !== 200) {
    return {msg: response.error , status : 404};
  }

  const access_token = response.data.access_token

  console.log("access_token : " , access_token);

  const query = `query {
  webhookSubscriptions(first: 10) {
    edges {
      node {
        id
        topic
        endpoint {
          __typename
          ... on WebhookHttpEndpoint {
            callbackUrl
          }
          ... on WebhookEventBridgeEndpoint {
            arn
          }
          ... on WebhookPubSubEndpoint {
            pubSubProject
            pubSubTopic
          }
        }
      }
    }
  }
}
`;

  const shopResponse = await fetch(
    `https://${shop}/admin/api/2025-04/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": access_token,
      },
      body: JSON.stringify({
        query: query,
      }),
    }
  );

  if (!shopResponse.ok) {
    return { msg: shopResponse.error, status: 404 };
  }
  const data = await shopResponse.json();
  console.log("Shopify Webhooks:", data);

  const webhookSubscriptions = data.data.webhookSubscriptions.edges;
  console.log("webhookSubscriptions : ", webhookSubscriptions);

  const storeData = await axios.get(`http://localhost:8001/user/get-store-id?shop_name=${shop}`)
  console.log("storeId : " , storeData.data.data);
  const storeId = storeData.data.data

if (!webhookSubscriptions || webhookSubscriptions.length === 0) {
  if (webhookEvents.length > 0) {
    const encryptedStoreUserId = encrypt(storeId);
    console.log("encryptedStoreUserId : " , encryptedStoreUserId);
    

    for (const topic of webhookEvents) {
      const fileName = `${topic.replace('/', '-')}?suid=${encodeURIComponent(encryptedStoreUserId)}`;
      console.log("fileName : " , fileName);
      
      let topicData;
      switch (topic) {
        case 'app/uninstalled':
          topicData = 'APP_UNINSTALLED';
          break;
        case 'shop/update':
          topicData = 'SHOP_UPDATE';
          break;
        case 'themes/publish':
          topicData = 'THEMES_PUBLISH';
          break;
        default:
          topicData = topic.toUpperCase().replace('/', '_');
      }

    // You would now use topicData + fileName to register webhook with Shopify
      console.log('Registering webhook for topic:', topic, 'as', topicData, '->', fileName);

      const callbackUrl = `https://${shop}/hooks/${fileName}`;  //change it here make it dynamic without .myshopify.com

      console.log("callbackUrl : " , callbackUrl);

      const mutation = `
        mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
          webhookSubscription {
            id
            topic
            format
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
      `;

      const variables = {
        topic: topicData,
        webhookSubscription: {
          callbackUrl,
          format: "JSON"
        }
      };

      console.log("variables : " , variables);
      console.log("url : " , url);
      
      
      try {
        const response = await fetch(`https://${shop}/admin/api/2025-04/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': access_token
          },
          body: JSON.stringify({ query: mutation, variables })
        });
        
        const data = await response.json();
        console.log(" data : " , data);

        console.log("data.userErrorrs :  " , data.data.webhookSubscriptionCreate);
      } catch (error) {
        console.error("Fetch error:", error);
      }

  // if (result.errors || result.data.webhookSubscriptionCreate.userErrors.length > 0) {
  //   console.error('Webhook creation failed:', result);
  // } else {
  //   console.log('Webhook created:', result.data.webhookSubscriptionCreate.webhookSubscription);
  // }
    }
  }
}


  return true
};


export default function PolarisButtonExample() {
const [retrieved, setRetrieved] = useState(false);
const fetcher = useFetcher()
    useEffect(() => {

      if (!retrieved && fetcher.state === "idle" && !fetcher.data) {
        async function fetchData(){
            const idToken = await shopify.idToken()
            console.log("idTOken : " , idToken);

            const url = new URL(window.location.href);
            const shop = url.searchParams.get("shop");

            console.log("shop : " , shop);
            
            fetcher.submit(
                { id_token: idToken, shop },
                { method: "post", action: "/app/webhook" }
              );
        }

        fetchData()

        if (fetcher.data && !retrieved) { setRetrieved(true)}
      }
    },[])

  return (
    <div>Webhook</div>
  );
}

// const url = `https://${shop}/admin/api/2024-04/graphql.json`;



// const headers = {
//   'Content-Type': 'application/json',
//   'X-Shopify-Access-Token': token
// };

  // try {
//   const response = await fetch(url, {
//     method: 'POST',
//     headers,
//     body: JSON.stringify(query)
//   });

//   if (!response.ok) {
//     const error = await response.text();
//     console.error('HTTP error:', error);
//   } else {
//     const data = await response.json();
//     console.log('Shopify Webhooks:', data);
//   }
// } catch (err) {
//   console.error('Network error:', err);
// }

// const webhookSubscriptions = response.data.webhookSubscriptions.edges;

// if (!webhookSubscriptions || webhookSubscriptions.length === 0) {
//   if (webhookTopicsToRegister.length > 0) {
//     const encryptedStoreUserId = encrypt('encrypt', storeUserId); // assume you have this utility

//     webhookTopicsToRegister.forEach((topic) => {
//       const fileName = `${topic.replace('/', '-')}.php?suid=${encodeURIComponent(encryptedStoreUserId)}`;

//       let topicData;
//       switch (topic) {
//         case 'app/uninstalled':
//           topicData = 'APP_UNINSTALLED';
//           break;
//         case 'orders/create':
//           topicData = 'ORDERS_CREATE';
//           break;
//         case 'shop/update':
//           topicData = 'SHOP_UPDATE';
//           break;
//         case 'themes/publish':
//           topicData = 'THEMES_PUBLISH';
//           break;
//         case 'orders/updated':
//           topicData = 'ORDERS_UPDATED';
//           break;
//         case 'orders/delete':
//           topicData = 'ORDERS_DELETE';
//           break;
//         case 'discounts/delete':
//           topicData = 'DISCOUNTS_DELETE';
//           break;
//         case 'products/delete':
//           topicData = 'PRODUCTS_DELETE';
//           break;
//         default:
//           topicData = topic.toUpperCase().replace('/', '_');
//       }

//       // You would now use topicData + fileName to register webhook with Shopify
//       console.log('Registering webhook for topic:', topic, 'as', topicData, '->', fileName);
//     });
//   }
// }
