// shopify/authRoutes.js
const express = require('express');
const router = express.Router();
const shopify = require('./shopify');

router.get('/auth', async (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.status(400).send("Missing shop parameter");

  const authRoute = await shopify.auth.begin({
    shop,
    callbackPath: '/auth/callback',
    isOnline: false,
    rawRequest: req,
    rawResponse: res,
  });

  return res.redirect(authRoute);
});

router.get('/auth/callback', async (req, res) => {
  try {
    const session = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res,
    });

    console.log('Shopify app installed by:', session.shop);
    res.redirect(`/?shop=${session.shop}`);
  } catch (err) {
    console.error('Shopify auth error:', err);
    res.status(500).send('Authentication failed');
  }
});

module.exports = router;
