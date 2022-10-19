// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import Button from '@mui/material/Button';
// import List from '@mui/material/List';
// import Image from 'next/image';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import { useWeb3React } from '@web3-react/core';

// import { connectors } from "utils/connectors";
// import { useLocalStorage } from '../hooks';

// interface CrypoWalletModalProps {
//   isOpen: boolean;
//   closeModal: Function;
//   useProvider: [string, Function];
// }

// export default function CrypoWalletModal({ isOpen, closeModal, useProvider }: CrypoWalletModalProps) {
//   const { activate } = useWeb3React();
//   const [provider, setProvider] = useProvider;

//   const providers = [
//     {
//       name: "Metamask",
//       icon: '/web3/icons/metamask-wallet.png',
//       slug: 'injected'
//     },
//     {
//       name: "Wallet Connnect",
//       icon: '/web3/icons/wallet-connect.png',
//       slug: 'walletConnect'
//     },
//     {
//       name: "Coinbase Wallet",
//       icon: '/web3/icons/coinbase-wallet.png',
//       slug: 'coinbaseWallet'
//     }
//   ];


//   const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
//     if (
//       event.type === 'keydown' &&
//       ((event as React.KeyboardEvent).key === 'Tab' ||
//         (event as React.KeyboardEvent).key === 'Shift')
//     ) {
//       return;
//     }
//     closeModal(open);
//   };

//   return (
//     <div>
//       <Drawer
//         anchor="right"
//         open={isOpen}
//         onClose={toggleDrawer(false)}
//       >
//         <Box
//           sx={{ width: "100%" }}
//           role="presentation"
//           onClick={toggleDrawer(false)}
//           onKeyDown={toggleDrawer(false)}
//         >
//           <h1>Connect Wallets</h1>
//           <List>
//             {providers.map((provider, index) => (
//               <ListItem
//                 key={index}
//                 disablePadding
//                 onClick={() => {
//                   activate(connectors.coinbaseWallet);
//                   setProvider(provider.slug);
//                   closeModal();
//                 }}
//               >
//                 <ListItemButton>
//                   <ListItemIcon>
//                     <Image
//                       src={provider.icon}
//                       alt={`${provider.name} Logo`}
//                       width={25}
//                       height={25}
//                     />
//                   </ListItemIcon>
//                   <ListItemText primary={provider.name} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </Box>
//       </Drawer>
//     </div>
//   );
// }

const CrypoWalletModal = () => {

  return (
    <></>
  )
}

export default CrypoWalletModal;