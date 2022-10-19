import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import SweetAlert from 'react-bootstrap-sweetalert';
import { getCookie } from 'cookies-next';
import Web3Modal from 'web3modal'

import { useLocalStorage } from '../components/miscellaneous/hooks';
import { SECRET, NETWORK_CHAIN, providerOptions } from '../utils';
import { authenticate, getTokenData, getUserById, signOut, updateUserData } from 'services';

import { UserWalletAddress } from '../@types';
import { getWeb3Provider, useContract, usePrivateContract } from 'helpers';
import { toHex } from 'helpers/web3';
import networks from 'data/evm-network-chains.json';

interface MetamaskProviderProps {
    children: React.ReactNode,
    pageProps: any;
}

interface UserDataProps {
    address?: UserWalletAddress;
    id?: string;
}

export interface MetamaskContextResponse {
    user: any;
    isAuthenticated: Boolean;
    login: Function;
    logout: Function;
    setUserData: Function;
    loginUserSigner: Function;
    web3: {
        provider: any;
        library: any;
        address: UserWalletAddress;
        isConnected: Boolean;
        setWalletNotConnect: Function;
        network: {
            chainId: number;
            ensAddress: string;
            name: string;
        }
    }
}

let web3Modal: any;
if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        network: NETWORK_CHAIN, // optional
        cacheProvider: true,
        providerOptions, // required
    })
}

// Export Metamask Context API
export const MetamaskContext = React.createContext({});

// Metamask Context Provider
const MetamaskProvider: React.FC<MetamaskProviderProps> = ({ children, pageProps }) => {
    const [token, setToken] = useLocalStorage("token", pageProps.token || "");
    const [user, setUser] = useState<any>(pageProps.data || {});
    const [disabledAlert, setDisabledAlert] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(pageProps.isAuthenticated || false);
    const [connected, setConnected] = useState({
        isConnected: false,
        title: 'Wallet Not Connected',
        message: "You are not connected with wallet!"
    });
    const userAddress = user.address || '';

    const [provider, setProvider] = useState<any>({});
    const [library, setLibrary] = useState<any>({});
    const [account, setAccount] = useState<string>(userAddress);
    const [signature, setSignature] = useState<string>("");
    const [network, setNetwork] = useState<any>({});

    const message = "Welcome To Diamond Verse Marketplace!";

    useEffect(() => {
        (async () => {
            const currentToken = getCookie(SECRET);
            setToken(currentToken || "")
            await checkIsWalletConnected(true);
        })();
    }, [connected, userAddress, token]);


    const handleConfirm = (event: any, type = '') => {
        type = type.trim();
        if (type == 'wallet') {
            setConnected({
                isConnected: false,
                title: 'Wallet Not Connected',
                message: "You are not connected with wallet!"
            });
        } else {
            window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn')
            setDisabledAlert(true);
        }
    }

    const handleCancel = () => {
        setDisabledAlert(true);
    }

    const logout = async () => {
        await signOut();
        refreshState();
    }

    const login = async () => {
        try {
            const provider = await web3Modal.connect();
            const library: any = new ethers.providers.Web3Provider(provider);
            setProvider(provider);
            setLibrary(library);
            await switchNetwork(library);
            const accounts = await library.listAccounts();
            if (accounts.length) {
                const userAddr = accounts.shift() || "";
                setAccount(userAddr);
                const signRes = await signMessage('', library, userAddr);
                if (signRes.isVarified) {
                    const ethNetwork = await library.getNetwork();
                    setNetwork(ethNetwork);
                    const loginData: any = await authenticate({
                        address: userAddr,
                        authData: {
                            customEth: {
                                id: userAddr,
                                signer: signRes.signature,
                                message: message,
                                network: {
                                    chainId: ethNetwork.chainId || 1,
                                    ensAddress: ethNetwork.ensAddress || "",
                                    name: ethNetwork.name || NETWORK_CHAIN
                                },
                                // connection: library.con
                            }
                        },
                        accounts: [...accounts, userAddr]
                    });
                    if (loginData) {
                        setToken(loginData.token);
                        setUser(loginData.user);
                        setIsAuthenticated(true);
                        return true;
                    }
                } else {
                    walletConnect(true, "Something went wrong!", "Signature not varified!");
                }
            }
        } catch (error: any) {
            var message = error?.message || "Something went wrong!"
            if(error.code === "NETWORK_ERROR") {
                message = "Network changed!";
            }
            walletConnect(true, "Something went wrong!", message);
            return;
        }
        const userData = getTokenData(token);
        if (userData) {
            await disconnect();
        }
    }

    // Check Signer message 
    const loginUserSigner = async () => {
        try {
            const signRes = await signMessage('', library, userAddress);
            return {
                status: signRes.isVarified,
                message: "",
                sign: signRes.signature
            }
        } catch (error: any) {
            return {
                status: false,
                message: error.message || "something went wrong",
                sign: ""
            }
        }
    }

    const checkIsWalletConnected = async (check = false) => {
        try {
            const data: any = getTokenData(token);
            if (data) {
                if (data?.user?.id) {
                    const provider = await web3Modal.connect();
                    const library: any = new ethers.providers.Web3Provider(provider);
                    setProvider(provider);
                    setLibrary(library);
                }
                const currentUser = await getUserById(data.user.id);
                setUser(currentUser);
                setIsAuthenticated(true);
                return true;
            }
        } catch (error: any) {
            console.error(error.message);
        }
        await disconnect();
        return false;
    }

    const switchNetwork = async (web3Library: any = {}) => {
        try {
            web3Library = Object.keys(web3Library).length ? web3Library : library;
            if (Object.keys(web3Library).length < 1) return;
            const siteNetwork = networks.find(network => network.id == NETWORK_CHAIN);
            const result = await web3Library.provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: toHex(siteNetwork?.decimal || 1) }]
            });
        } catch (switchError: any) {
            walletConnect(true, "Something went wrong!", switchError.message);
        }
    };

    const signMessage = async (signedMessage: string = "", web3Library: any = {}, userAddr: UserWalletAddress = "") => {
        web3Library = Object.keys(web3Library).length ? web3Library : library;
        if (Object.keys(web3Library).length < 1) return {
            signature: "",
            isVarified: false
        };
        try {
            signedMessage = signedMessage.trim() ? signedMessage.trim() : message;
            userAddr = userAddr.trim() ? userAddr.trim() : account;
            if (!signedMessage || !userAddr) return {
                signature: "",
                isVarified: false
            };;
            const signature = await web3Library.provider.request({
                method: "personal_sign",
                params: [signedMessage, userAddr]
            });
            setSignature(signature);
            const isVarified = await verifyMessage(signature, signedMessage, web3Library, userAddr);
            return {
                signature,
                isVarified
            };
        } catch (error: any) {
            walletConnect(true, "Something went wrong!", error.message);
            return {
                signature: "",
                isVarified: false
            };
        }
    };

    const verifyMessage = async (userSignature: string = "", signedMessage: string = "", web3Library: any = {}, userAddr: UserWalletAddress = "") => {
        web3Library = Object.keys(web3Library).length ? web3Library : library;
        if (Object.keys(web3Library).length < 1) return false;
        try {
            signedMessage = signedMessage.trim() ? signedMessage.trim() : message;
            userAddr = userAddr.trim() ? userAddr.trim() : account;
            userSignature = userSignature.trim() ? userSignature.trim() : signature;
            if (!signedMessage || !userAddr || !userSignature) return false;
            const verify = await web3Library.provider.request({
                method: "personal_ecRecover",
                params: [signedMessage, userSignature]
            });
            return verify === userAddr.toLowerCase();
        } catch (error: any) {
            walletConnect(true, "Something went wrong!", error.message);
            return false;
        }
    };

    const refreshState = () => {
        setAccount('');
        setNetwork("");
        setSignature("");
        setToken("");
        setUser({});
        setIsAuthenticated(false);
    };

    const disconnect = async () => {
        web3Modal.clearCachedProvider();
        await logout();
    };

    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = async (accounts: UserWalletAddress[]) => {
                if (accounts.length) {
                    setAccount(accounts.shift() || "");
                } else {
                    await disconnect();
                    window.location.reload();
                }
            };

            const handleChainChanged = (_hexChainId: any) => {
                setNetwork({
                    ...network,
                    chainId: parseInt(_hexChainId, 16)
                });
                if (isAuthenticated) switchNetwork();
            };

            const handleDisconnect = async () => {
                await disconnect();
                window.location.reload();
            };

            provider.on("accountsChanged", handleAccountsChanged);
            provider.on("chainChanged", handleChainChanged);
            provider.on("disconnect", handleDisconnect);

            return () => {
                if (provider.removeListener) {
                    provider.removeListener("accountsChanged", handleAccountsChanged);
                    provider.removeListener("chainChanged", handleChainChanged);
                    provider.removeListener("disconnect", handleDisconnect);
                }
            };
        }
    }, [provider]);



    const AlertTitle = (props: any) => {
        const { title = 'Metamask Not Found!' } = props
        return (
            <span className='text-dark'>{title}</span>
        )
    }

    const walletConnect = (action = false, title = "Wallet Not Connected", message = "You are not connected with wallet!") => {
        setConnected({
            isConnected: action,
            title: title,
            message: message
        });
    }

    const setUserData = async (inputData: any) => {
        const result = await updateUserData(user.id, inputData);
        if (result.status === "success") {
            const currentUser = await getUserById(user.id);
            setUser(currentUser);
        }
        return result;
    }

    return (
        <MetamaskContext.Provider value={{
            user,
            isAuthenticated,
            login,
            logout: disconnect,
            setUserData,
            loginUserSigner,
            web3: {
                provider,
                library,
                network,
                address: account,
                isConnected: checkIsWalletConnected,
                setWalletNotConnect: walletConnect,
            }
        }} >
            {!disabledAlert && <SweetAlert
                warning
                showCancel
                confirmBtnText="Install it!"
                confirmBtnBsStyle="outline-link"
                title={<AlertTitle />}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                focusCancelBtn
                confirmBtnCssClass="text-[#333] font-bold py-2 px-5 border-2 border-[#333] rounded-full"
                cancelBtnCssClass="text-[#FF0000] font-bold py-2 px-5 border-2 border-[#FF0000] rounded-full"
            >
                Metamask is not found on your browser!
            </SweetAlert>}
            {connected.isConnected && <SweetAlert
                danger
                title={<AlertTitle title={connected.title} />}
                onConfirm={() => handleConfirm(event, 'wallet')}
                confirmBtnCssClass="px-4 py-2 font-semibold block text-sm bg-[#571a81] text-white shadow-sm rounded"
            >
                <span className='text-dark'>{connected.message}</span>
            </SweetAlert>}
            {children}
        </MetamaskContext.Provider>
    )
}

export function useMetamaskcontext(): any | MetamaskContextResponse {
    return useContext(MetamaskContext);
}

export const getPrivateContract = usePrivateContract;
export const getEthContract = useContract;


export default {
    provider: MetamaskProvider,
    getContract: getEthContract,
    getPrivateContract: getPrivateContract,
    getWeb3Provider,
    context: MetamaskContext,
    useContext: useMetamaskcontext
};

