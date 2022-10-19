import { ethers } from "ethers";
import Web3Modal from 'web3modal'
import { UserWalletAddress } from "../@types";
import { providerOptions, NFT_ADDRESS, NFT_ABI, NFT_MARKET_PLACE_ADDRESS, NFT_MARKET_PLACE_ABI } from "../utils";

export const getWeb3Provider = async () => {
    const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions
    });
    const connection = await web3Modal.connect();
    return new ethers.providers.Web3Provider(connection);
}

export const usePrivateContract = async (CONTRACT_ADDRESS: UserWalletAddress, CONTRACT_ABI: any) => {
    try {
        if (!CONTRACT_ADDRESS || !CONTRACT_ABI) return false;

        const provider = new ethers.providers.JsonRpcProvider(
            'https://eth-rinkeby.alchemyapi.io/v2/_b2rMXbor1aLVRhKBxOdGQMmd0zwcfsw'
        );
        const providerContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const wallet = new ethers.Wallet("cf74a2ad9819f689b383844ad6e5829b9663c767ecf7fd8615b10371f28f7a47");
        // const signer = wallet.provider.getSigner();
        const providerWallet = wallet.connect(provider)
        return providerContract.connect(providerWallet);
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const useContract = async (CONTRACT_ADDRESS: UserWalletAddress, CONTRACT_ABI: any) => {
    const { ethereum }: any = window;
    try {
        if (!CONTRACT_ADDRESS || !CONTRACT_ABI || typeof ethereum == 'undefined') return false;

        const account = ethereum.selectedAddress;
        if (account) {
            const provider = await getWeb3Provider();
            // console.log(await provider.getCode('SKDSskd23224KLDF23'))
            //sign the transaction
            const signer = provider.getSigner();
            return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        }
        return false;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const getTransactionOptions = async () => {
    try {
        const { ethereum }: any = window;
        const account = ethereum.selectedAddress;
        if (account) {
            const provider = await getWeb3Provider();
            //sign the transaction
            const signer = provider.getSigner();
            let feeData = await provider.getFeeData();
            let chainId = await provider.getNetwork();
            let nonce = await signer.getTransactionCount()
            return {
                chainId: chainId.chainId,
                gasPrice: feeData.gasPrice,
                nonce
            }
        }
        return false;
        
    } catch (error) {
        
    }
}

export const getNftMarketContract = async () => {
    return await useContract(NFT_MARKET_PLACE_ADDRESS, NFT_MARKET_PLACE_ABI);
};

export const getNftContract = async (address: string = "") => {
    address = address.trim() ? address.trim() : NFT_ADDRESS;
    return await useContract(address, NFT_ABI);
};

export const isWalletConnected = async () => {
    const { ethereum }: any = window;
    if (typeof ethereum == 'undefined') return false;
    return ethereum.selectedAddress;
}