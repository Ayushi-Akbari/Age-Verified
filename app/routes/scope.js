// import axios from "axios";


// const secretKey = process.env.SHOPIFY_API_KEY;
// const secretSecret = process.env.SHOPIFY_API_SECRET;

// console.log("secretKey : ", secretKey);
// console.log("secretSecret : ", secretSecret);

// const scope = async(shop, id_token) => {

//     console.log("inside scope function");
    
//     console.log("shop : ", shop);
//     console.log("id_token : ", id_token)

// //    console.log("secretKey : ", secretKey);
// //    console.log("secretSecret : ",a secretSecret);   
    
    
//     const data = {
//     client_id: "6473332dff158d7aab8327543871590a",
//     client_secret: "71772b28f37947861384f3c7566250d3",
//     grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
//     subject_token: id_token,
//     subject_token_type: "urn:ietf:params:oauth:token-type:id_token",
//     requested_token_type:
//         "urn:shopify:params:oauth:token-type:offline-access-token",
//     };

//   if (!shop || !data) {
//     throw new Error("Store name is missing or null!");
//   }

//   //Access token
//   const url = `https://${shop}/admin/oauth/access_token`;
//   if (!url) {
//     throw new Error("URL is missing or null!");
//   }

//   const response = await axios.post(url, data);

//   if (response.status !== 200) {
//     return { msg: response.error, status: 404 };
//   }

//   const access_token = response.data.access_token;
//   console.log("Access Token:", access_token); 

//   if(!access_token){
//     throw new Error("Access Token is missing or null!");
//   }

//   return true
// }

// export default scope;