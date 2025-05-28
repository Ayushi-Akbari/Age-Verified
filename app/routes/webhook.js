import {encrypt, decrypt} from "./crypto";
import axios from "axios";

const webhookSubscription = async (store_name, token, store_user_id) => {
    const webhookEvents = [
        'app/uninstalled',
        'shop/update',
        'themes/publish'
      ];

    if(!store_name || !token || !store_user_id){
        throw new Error("Store name is missing or null!");
    }

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
    `https://${store_name}/admin/api/2025-04/graphql.json`,
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
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
    // console.log("Shopify Webhooks:", data);

    const webhookSubscriptions = data.data.webhookSubscriptions.edges;

  // Create webhook subscription
    if (!webhookSubscriptions || webhookSubscriptions.length === 0) {
    if (webhookEvents.length > 0) {
        const encryptedStoreUserId = encrypt(store_user_id);
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

        console.log('Registering webhook for topic:', topic, 'as', topicData, '->', fileName);

        const callbackUrl = `https://64b9-2405-201-200d-173-d96b-41d0-c03b-28b.ngrok-free.app/hooks/${fileName}`;

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
        
        try {
            const response = await fetch(`https://${store_name}/admin/api/2025-04/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': token
            },
            body: JSON.stringify({ query: mutation, variables })
            });
            
            const data = await response.json();
            console.log(" data : " , data);

            if(data.data.userErrors){
            return { msg: data.data.userErrors, status: 404 };
            }

            console.log("data.userErrorrs :  " , data.data.webhookSubscriptionCreate);
        } catch (error) {
            return { msg: error, status: 404 };
        }
        }
    }
    }
    console.log("done : " );

  return { msg: "done", status: 200 };
}

export default webhookSubscription