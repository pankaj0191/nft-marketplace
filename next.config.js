module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'ipfs.infura.io', 
      'ipfs.moralis.io', 
      "ui-avatars.com",
      "paradise.infura-ipfs.io"
    ]
  },
  env: {
    APP_BASE_URL: process.env.APP_BASE_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    SECRET: process.env.SECRET,

    CONTRACT_CHAIN_NETWORK: process.env.CONTRACT_CHAIN_NETWORK,
    NFT_MARKET_PLACE_ADDRESS: process.env.NFT_MARKET_PLACE_ADDRESS,
    NFT_ADDRESS: process.env.NFT_ADDRESS,

    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_NAME: process.env.MONGODB_NAME,

    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    INFURA_PROJECT_SECRET: process.env.INFURA_PROJECT_SECRET,
    INFURA_API_ENDPOINT: process.env.INFURA_API_ENDPOINT,
    INFURA_IPFS_BASE_URL: process.env.INFURA_IPFS_BASE_URL,
    INFURA_RPC_ENDPOINT: process.env.INFURA_RPC_ENDPOINT,
    INFURA_KEY: process.env.INFURA_KEY,
  }
}
