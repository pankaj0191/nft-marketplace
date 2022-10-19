import { NFT_ADDRESS, NFT_ABI, NFT_MARKET_PLACE_ADDRESS, NFT_MARKET_PLACE_ABI } from ".";


export const NFTMarket = {
    Address: NFT_MARKET_PLACE_ADDRESS,
    ABI: NFT_MARKET_PLACE_ABI
}

export const NFT = {
    Address: NFT_ADDRESS,
    ABI: NFT_ABI
}

export * from './web3'

export * from './constants'

export * from './infura'

export * from './providerOptions'

export default {
    NFTMarket,
    NFT
};
