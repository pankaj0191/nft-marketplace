// import { InjectedConnector } from "@web3-react/injected-connector";
// import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
// import { WalletLinkConnector } from "@web3-react/walletlink-connector";
// import { INFURA_RPC_ENDPOINT } from "./constants";
// import networks from 'data/evm-network-chains.json'

// const injected = new InjectedConnector({
//     supportedChainIds: networks.map(network => network.decimal)
// });

// const walletconnect = new WalletConnectConnector({
//     rpcUrl: INFURA_RPC_ENDPOINT,
//     bridge: "https://bridge.walletconnect.org",
//     qrcode: true
// });

// const walletlink = new WalletLinkConnector({
//     url: INFURA_RPC_ENDPOINT,
//     appName: "Diamond Verse"
// });

export const connectors = {
    injected: {},
    walletConnect: {},
    coinbaseWallet: {}
};
