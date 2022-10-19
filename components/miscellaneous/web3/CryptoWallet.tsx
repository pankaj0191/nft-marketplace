// import CrypoWalletModal from "./Modal";
// import { useWeb3React } from "@web3-react/core";
// import React, { useEffect, useState } from "react";

// import { connectors, networkParams, NETWORK_CHAIN } from "utils";
// import { toHex, truncateAddress } from "helpers";
// import { useLocalStorage } from "../hooks";
// import { DvAvatar } from "../DvAvatar";

// import networks from 'data/evm-network-chains.json'

// export default function Home() {
//     const [provider, setProvider] = useLocalStorage('provider', '');
//     const [isOpen, setIsOpen] = useState<boolean>(false);
//     const {
//         library,
//         chainId,
//         account,
//         activate,
//         deactivate,
//         active
//     } = useWeb3React();
//     const [signature, setSignature] = useState("");
//     const [error, setError] = useState("");
//     const [signedMessage, setSignedMessage] = useState("");
//     const [verified, setVerified] = useState<Boolean>(false);

//     const network: any = networks.find(network => network.id === NETWORK_CHAIN) || {};

//     const message = "Welcome To Diamond Verse Marketplace!";

//     const switchNetwork = async () => {
//         try {
//             await library.provider.request({
//                 method: "wallet_switchEthereumChain",
//                 params: [{ chainId: toHex(network.id) }]
//             });
//         } catch (switchError: any) {
//             if (switchError.code === 4902) {
//                 try {
//                     const newNetworkParams: any = networkParams;
//                     await library.provider.request({
//                         method: "wallet_addEthereumChain",
//                         params: [newNetworkParams[toHex(network.id)]]
//                     });
//                 } catch (error: any) {
//                     setError(error.message || "Something went wrong!");
//                 }
//             }
//         }
//     };

//     const signMessage = async () => {
//         if (!library) return;
//         try {
//             const signature = await library.provider.request({
//                 method: "personal_sign",
//                 params: [message, account]
//             });
//             setSignedMessage(message);
//             setSignature(signature);
//         } catch (error: any) {
//             setError(error.message);
//         }
//     };

//     const verifyMessage = async () => {
//         if (!library) return;
//         try {
//             const verify: any = await library.provider.request({
//                 method: "personal_ecRecover",
//                 params: [signedMessage, signature]
//             });
//             const isVarified = account && verify === account.toLowerCase() ? true : false;
//             setVerified(isVarified);
//         } catch (error: any) {
//             setError(error.message);
//         }
//     };

//     const refreshState = () => {
//         setProvider('')
//         setSignature("");
//         setVerified(false);
//     };

//     const disconnect = () => {
//         refreshState();
//         deactivate();
//     };

//     useEffect(() => {
//         (async () => {
//             const newConnectors: any = connectors;
//             console.log(provider)
//             if (provider) {
//                 await activate(newConnectors[provider]);
//             } else {
//                 deactivate();
//             }

//         })();
//     }, [provider]);

//     return (
//         <>
//             {
//                 account ? (
//                     <div className="rounded-full cursor-pointer font-bold text-base uppercase tracking-wide flex items-center">
//                         <div>
//                             <DvAvatar />
//                         </div>
//                         <div>
//                             <p className="text-[#fff] text-sm font-normal normal-case px-3"> {truncateAddress(account, 2)}</p>
//                         </div>
//                     </div>
//                 ) : (
//                     <button
//                         className="  connectwallet_btn text-center mx-auto text-[#fff] font-bold py-1 px-2 border-[#fff] rounded-full bg-transparent	 text-sm"
//                         onClick={() => setIsOpen(true)}
//                     >
//                         Connect Wallet
//                     </button>
//                 )
//             }
//             <CrypoWalletModal isOpen={true} closeModal={setIsOpen} useProvider={[provider, setProvider]} />
//         </>
//     );
// }


const CryptoWallet = () => {

    return (
        <></>
    )
}

export default CryptoWallet;