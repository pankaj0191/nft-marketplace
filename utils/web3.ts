
import EthereumNetworkChains from '../data/evm-network-chains.json'
import { ethers } from 'ethers';
import { UserWalletAddress } from '../@types';

import { NETWORK_CHAIN, PRIVATE_KEY } from './constants';

export const getContract = async (address: UserWalletAddress, abi: any) => {
    try {
        if (!address || !abi || !PRIVATE_KEY) return false;

        const provider = new ethers.providers.JsonRpcProvider(
            'https://eth-rinkeby.alchemyapi.io/v2/_b2rMXbor1aLVRhKBxOdGQMmd0zwcfsw'
        );
        const providerContract = new ethers.Contract(address, abi, provider);

        const wallet = new ethers.Wallet(PRIVATE_KEY || "");
        // const signer = wallet.provider.getSigner();
        const providerWallet = wallet.connect(provider)
        return providerContract.connect(providerWallet);
    } catch (error) {
        console.log(error)
    }
}

export const getNetworkChains = () => {
    return EthereumNetworkChains || [];
}

export const getNetworkChainData = (currentChainId = "") => {
    const { ethereum }: any = window;
    currentChainId = currentChainId && typeof currentChainId === "string" && currentChainId.trim() ? currentChainId.trim() : NETWORK_CHAIN.toString().trim();
    const chainData = getCurrentChain(currentChainId);
    if (chainData) {
        return {
            ...chainData,
            isConnected: window.ethereum && ethereum.chainId == currentChainId
        }
    }
    return {};
}

export const getCurrentChain = (chainId = "") => {
    const { ethereum }: any = window;
    chainId = chainId && typeof chainId === "string" && chainId.trim() ? chainId.trim() : (ethereum.chainId || "");
    const networkChains = getNetworkChains();
    return networkChains.find((chain) => chain.id == chainId || chain.hex == chainId) || {};
}

export const isValidUserWalletAddress = (address: UserWalletAddress) => {
    return ethers.utils.isAddress(address);
}