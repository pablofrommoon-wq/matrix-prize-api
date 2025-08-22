const { Connection, PublicKey } = require('@solana/web3.js');
const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS for your Framer origin
  res.setHeader('Access-Control-Allow-Origin', 'https://project-c6ifdlomqxccdcjzkntq.framercanvas.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Fetch SOL balance
    const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/dmWve-nK7N6weLy6-sTOV', 'confirmed');
    const balance = await connection.getBalance(new PublicKey('CVhCqdyt17hYdr7Lq7zKvyDMhro36wzh6S5uvKKot2UM'));
    const solBalance = balance / 1_000_000_000; // Convert lamports to SOL

    // Fetch SOL price in USD
    const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const solPrice = priceResponse.data.solana.usd;

    // Calculate USD balance
    const usdBalance = (solBalance * solPrice).toFixed(2);

    res.status(200).json({ balance: usdBalance });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
};