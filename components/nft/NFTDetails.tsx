import { useState, useEffect, FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";
import { Box, Button, capitalize, CircularProgress, Grid, Typography } from "@mui/material";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AiFillHeart, AiFillEye, AiOutlineHeart, AiOutlineCheck } from "react-icons/ai";
import { BsBoxArrowInUpRight, BsCollectionFill } from "react-icons/bs";
import { GiToken } from "react-icons/gi"
import { getNftMarketContract, IsJsonString, getTransactionOptions, formatSolidityError, subString } from "../../helpers";
import { getNftHistory, getNftListing, offerNft, removeFromSale, saveNftLike, saveNftViews, unLikeNft } from "services";
import { DvAvatar, NoDataFound } from "../miscellaneous";
import Marketplace from "./Marketplace";
import { ETHERSCAN_BASE_URL, NFT, SITE_TOKEN } from "utils";
import { Metamask } from "context";
import 'react-tabs/style/react-tabs.css';
import { BiCategory } from "react-icons/bi";
import { FaEthereum } from "react-icons/fa";
import moment from "moment";
import { styled } from '@mui/material/styles';
import NftOwnerOrCreator from "./NftOwnerOrCreator";
import { CustomModal, ModalContent, ModalFooter, ModalHeader } from "components/miscellaneous/modal";


import { ButtonProps } from '@mui/material/Button';

interface DetailProps {
  details: any;
  useUpdate: [Boolean, Function];
}

const defaultStateOptions = {
  isLoader: false,
  isComplete: false,
  isError: false,
  errorMessage: "",
  callback: "",
  title: "",
  description: ""
}

const defaultCancelStates = {
  removeFromSale: {
    ...defaultStateOptions,
    callback: "cancelInBlockchainSale",
    title: "Cancel Open For Bids Sale",
    description: "Cancel item from open for bids sale"
  },
  onOwnServer: {
    ...defaultStateOptions,
    callback: "cancelInAPI",
    title: "Sign message",
    description: "Sign message with nft item preferences"
  }
}

const defaultLoadingObj = {
  offers: false,
  history: false,
  properties: false,
  listing: false,
};

interface LoadingObjectProps {
  offers: Boolean;
  history: Boolean;
  properties: Boolean;
  listing: Boolean;
}

type DefaultCancelProps = typeof defaultCancelStates;

const NFTDetail: FC<DetailProps> = ({ details, useUpdate }) => {
  const [updated, setUpdated] = useUpdate;
  const {
    likeCount, viewCount, id, ownedBy, createdBy, asset, tokenId, collection, status,
    metadata, properties, transaction, category, genre, isLiked, marketplace, itemId
  } = details;

  const [isLoadingObject, setIsLoadingObject] = useState<LoadingObjectProps>(defaultLoadingObj);
  const [favourite, setFavourite] = useState<Boolean>(isLiked);
  const [nftLikes, setNftLikes] = useState<number>(parseInt(likeCount));
  const [nftViews, setNftViews] = useState<number>(parseInt(viewCount));
  const [states, setStates]: [any, Function] = useState<DefaultCancelProps>(defaultCancelStates);
  const [open, setOpen] = useState<Boolean>(false);
  const [cancelTransaction, setCancelTransaction] = useState<any>({});
  
  const [offers, setOffers] = useState<any[]>([]);
  const [histories, setHistories] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);

  const { user, isAuthenticated, login }: any = Metamask.useContext();
  const currentUserId = user?.id || "";

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText("#571a81"),
    backgroundColor: "#571a81",
    '&:hover': {
      backgroundColor: "#571a81",
    },
  }));

  // Nft views

  useEffect(() => {
    (async () => {
      const result = await saveNftViews(id)
      if (result.status === "success") {
        setNftViews((view) => view + 1);
      }
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      setIsLoadingObject({
        ...defaultLoadingObj,
        offers: true
      })
      const res = await offerNft(id, {}, 'get');
      if (res.length) {
        setOffers(res);
      }
      setIsLoadingObject({
        ...defaultLoadingObj,
        offers: false
      })
    })();
  }, [id]);

  /**
   * Get Nft losting
   */

  useEffect(() => {
    (async () => {
      setIsLoadingObject({
        ...defaultLoadingObj,
        listing: true
      })
      const results = await getNftListing(id);
      setListings(results || []);
      setIsLoadingObject({
        ...defaultLoadingObj,
        listing: false
      })
    })();
  }, [id])

  /**
   * 
   * Get Nft History
   */

  useEffect(() => {
    (async () => {
      setIsLoadingObject({
        ...defaultLoadingObj,
        history: true
      })
      const results = await getNftHistory(id);
      setHistories(results.slice(0, 10));
      setIsLoadingObject({
        ...defaultLoadingObj,
        history: false
      })
    })();

  }, [id])


  // useEffect(() => {
  //   (async () => {
  //     setIsLoading(true);
  //     var items = await getAllItems({
  //       limit: 5,
  //       collection,
  //       owner: true,
  //       creator: true,
  //       like: true,
  //       view: true,
  //     });
  //     if (Object.keys(items).length) {
  //       items = items.filter(i => i.id !== id);
  //       setNfts(items);
  //     }
  //     setIsLoading(false);
  //   })();
  // }, [collection, id])


  const saleSectionStyle: any = {
    position: "absolute",
    top: "15px",
    right: "100px",
  }



  const handleLike = async (e: any) => {
    e.preventDefault();
    if (!favourite) {
      const result = await saveNftLike(id);
      if (result.status === "success") {
        setFavourite(true);
        setNftLikes(nftLikes + 1);
      }
    } else {
      const result = await unLikeNft(id);
      if (result.status === "success") {
        setFavourite(false)
        setNftLikes(nftLikes - 1)
      }
    }
  }


  const setFollowStepError = (slug: string, message: string) => {
    var checkPrev = true;
    const newStates: any = states;
    Object.keys(states).forEach((value: string) => {
      const modalValue = newStates[value];
      const object = {
        ...defaultStateOptions,
        callback: modalValue.callback,
        isError: true,
        errorMessage: message || "Something went wrong!"
      }
      if (slug === value) {
        checkPrev = false;
        newStates[value] = object
      }
      if (checkPrev) {
        newStates[value] = {
          ...defaultStateOptions,
          callback: modalValue.callback,
          isComplete: true
        }
      }
    })

    setStates({
      ...newStates
    });
  }

  const handleRemoveFromSale = async (event: any) => {
    event.preventDefault();
    try {
      if (!isAuthenticated) {
        await login();
        return;
      }
      setOpen(true);
      await cancelInBlockchainSale();
    } catch (error: any) {
      var parseJson: any = IsJsonString(error.message);
      if (!parseJson) {
        parseJson = {
          slug: "buy",
          message: error.message
        }
      }
      setFollowStepError(parseJson.slug, parseJson.message);
    }
    return false;
  }

  const cancelInBlockchainSale = async () => {
    try {
      if (!isAuthenticated) {
        await login();
        return;
      }
      setStates({
        ...{
          removeFromSale: {
            isLoader: true,
            isComplete: false,
            isError: false,
            errorMessage: "",
            callback: "cancelInBlockchainSale"
          },
          onOwnServer: {
            isLoader: false,
            isComplete: false,
            isError: false,
            errorMessage: "",
            callback: "cancelInAPI"
          }
        }
      });

      const nftMarketPlaceContract: any = await getNftMarketContract();
      const options: any = {
        from: user.address
      }
      const transactionOptions = await getTransactionOptions();
      if (transactionOptions) {
        options.gasPrice = transactionOptions.gasPrice;
        options.nonce = transactionOptions.nonce;
      }
      const action = marketplace.action || "";
      var marketPlaceTransaction: any;
      if (action === "fixed_price") {
        marketPlaceTransaction = await nftMarketPlaceContract.cancelListedItem(itemId, options);
      } else if (action === "open_for_bids") {
        marketPlaceTransaction = await nftMarketPlaceContract.cancelItemFromOffer(itemId, options);
      } else {
        marketPlaceTransaction = await nftMarketPlaceContract.cancelAuction(itemId, options);
      }
      const cancelTx = await marketPlaceTransaction.wait();
      if (cancelTx) {
        setCancelTransaction({
          ...cancelTx
        });
        await cancelInAPI(cancelTx);
      } else {
        const message = "Something went wrong during item remove from sale!"
        throw new Error(JSON.stringify({ slug: "removeFromSale", message }));
      }
    } catch (error: any) {
      const err = formatSolidityError(error.message);
      const message = err ? capitalize(err.message) : error.message || "something went wrong";
      var parseJson: any = IsJsonString(message);
      if (!parseJson) {
        parseJson = {
          slug: "removeFromSale",
          message: message
        }
      }
      throw new Error(JSON.stringify(parseJson));
    }
  }

  const cancelInAPI = async (tx: any = {}) => {
    tx = Object.keys(tx).length ? tx : cancelTransaction;
    try {
      if (!isAuthenticated) {
        await login();
        return;
      }
      setStates({
        ...{
          removeFromSale: {
            isLoader: false,
            isComplete: true,
            isError: false,
            errorMessage: "",
            callback: "cancelInBlockchainSale"
          },
          onOwnServer: {
            isLoader: true,
            isComplete: false,
            isError: false,
            errorMessage: "",
            callback: "cancelInAPI"
          }
        }
      });
      const result = await removeFromSale(id, { transaction: tx });
      if (result.status === true) {
        setUpdated(!updated);
        setStates({
          ...{
            removeFromSale: {
              isLoader: false,
              isComplete: true,
              isError: false,
              errorMessage: "",
              callback: "cancelInBlockchainSale"
            },
            onOwnServer: {
              isLoader: false,
              isComplete: true,
              isError: false,
              errorMessage: "",
              callback: "cancelInAPI"
            }
          }
        });
      } else {
        const message = result.message || "something went wrong"
        throw new Error(JSON.stringify({ slug: "onOwnServer", message }));
      }
    } catch (error: any) {
      const message = error.message || "something went wrong";
      var parseJson: any = IsJsonString(message);
      if (!parseJson) {
        parseJson = {
          slug: "onOwnServer",
          message: message
        }
      }
      throw new Error(JSON.stringify(parseJson));
    }
  }

  const tryAgainModal = async () => {
    try {
      const newStates: any = states;
      Object.keys(newStates).forEach(async (element) => {
        try {
          const modalAsset = newStates[element];
          if (modalAsset.isError) {
            if (eval(`typeof ${modalAsset.callback}`) === "function") {
              await eval(`${modalAsset.callback}()`);
            }
          }
        } catch (error: any) {
          var parseJson: any = IsJsonString(error.message);
          if (!parseJson) {
            parseJson = {
              slug: "removeFromSale",
              message: error.message
            }
          }
          setFollowStepError(parseJson.slug, parseJson.message);
        }
      });
    } catch (error: any) {
      var parseJson: any = IsJsonString(error.message);
      if (!parseJson) {
        parseJson = {
          slug: "removeFromSale",
          message: error.message
        }
      }
      setFollowStepError(parseJson.slug, parseJson.message);
    }
  }

  return (
    <div className="dark:bg-[#09080d] bg-[#fff]">
      <section className="productdetail_section lg:px-14 sm:px-3 lg:pb-0 md:pb-0 pb-0 pt-20">
        <div className="sale-section remove-from_bids" style={saleSectionStyle}>
          {(() => {
            if (isAuthenticated && currentUserId === ownedBy.id) {
              const action = marketplace?.action || "";
              return action
                ? <Button onClick={handleRemoveFromSale} variant="contained" size="large">Remove from Sale</Button>
                : (
                  <Link href={`/discover/${id}/sell`} passHref>
                    <Button color="secondary" autoFocus variant="outlined" size="large">Put On Sale</Button>
                  </Link>
                )
            }
            return '';
          })()}
        </div>
        <div className="container-fluid mx-auto">
          <div className="lg:flex md:block block ">
            <div
              className="basis-6/12 productdetail_section_image_col"
              data-aos="fade-right"
              data-aos-duration="3000"
            >
              <div className="m-1 p-2 productdetail_section_image rounded-lg">
                {
                  asset.type === "image" ? (
                    <Image
                      src={asset.file}
                      alt="Picture of the item"
                      className="rounded mt-4"
                      width={600}
                      height={600}
                      priority={true}
                    />
                  ) : (
                    <video
                      style={{ width: '350px', height: '180px' }}
                      controls
                      preload="auto"
                      controlsList="nodownload"
                      className="form-label inline-block mb-2 text-gray-700"
                    >
                      <source src={asset.file} />
                    </video>
                  )
                }
              </div>
              <div className="flex itens-center productdetail_section_folowrsrow">
                <div className=" flex items-center productdetail_section_likes cursor-pointer" onClick={handleLike} >
                  {favourite ? <AiFillHeart /> : <AiOutlineHeart />}
                  <h6 className=" dark:text-[#707a83] text-[#707a83] text-sm   ml-2 ">{nftLikes} Likes</h6>
                </div>
                <div className=" flex items-center productdetail_section_followers ml-2">
                  <AiFillEye />
                  <h6 className=" dark:text-[#707a83] text-[#707a83] text-sm  ml-2  ">{nftViews} Views </h6>
                </div>
              </div>
            </div>

            <div
              className="basis-6/12 lg:pl-10 md:pl-0 pl-0 nftdetail_right_col"
              data-aos="fade-left"
              data-aos-duration="3000"
            >

              <div className="productdetail_section__col_content_box m-1  p-2]">
                <div className="productdetail_section_col_content_box py-3 px-3">
                  <div className="">
                    <h2 className="dark:text-white text-[#000] font-bold text-4xl capitalize">
                      {details.title}
                    </h2>
                  </div>
                  <div className=" flex items-center nftdetail_owners_list">
                    <NftOwnerOrCreator creatorOrOwner={ownedBy} text="OWNED BY" />
                    <NftOwnerOrCreator creatorOrOwner={createdBy} />
                  </div>
                  <div className="mt-5 singleproduct_viewproof">
                    <div className="grid grid-cols-2 gap-2" >
                      <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                        <p className="grid grid-cols-12 gap-2">
                          <span className="col-span-1">
                            <GiToken />
                          </span>
                          <span className="col-span-4 text-black dark:text-white">Token Id : </span>
                          <span className="col-span-7 text-[#571a81]"><a href={metadata} target="_blank" rel="noreferrer">#{tokenId}</a></span>
                        </p>
                      </div>
                      <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                        <p className="grid grid-cols-12 gap-2">
                          <span className="col-span-1">
                            <BsCollectionFill />
                          </span>
                          <span className="col-span-4 text-black dark:text-white">Collection : </span>
                          <span className="col-span-7 text-[#571a81]"><Link href={`/collections/${collection.id}`} passHref>{collection.name}</Link></span>
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2" >
                      <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                        <p className="grid grid-cols-12 gap-2">
                          <span className="col-span-1">
                            <BiCategory />
                          </span>
                          <span className="col-span-4 text-black dark:text-white">Category : </span>
                          <span className="col-span-7 text-gray-400">{category.name}</span>
                        </p>
                      </div>
                      <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                        <p className="grid grid-cols-12 gap-2">
                          <span className="col-span-1">
                            <BiCategory />
                          </span>
                          <span className="col-span-4 text-black dark:text-white">Genre : </span>
                          <span className="col-span-7 text-gray-400">{genre.name}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <Marketplace nft={details} useUpdate={[updated, setUpdated]} />
                  <div className="mt-3 singleproduct_viewproof">
                    {/* <div className="view-proof-authenticity"> */}
                    <div className="w-full dark:text-white">View Proof of Authenticity</div>
                    <div className="grid grid-cols-2 gap-2" >
                      {
                        transaction?.transactionHash ? (
                          <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                            <a href={`${ETHERSCAN_BASE_URL}/tx/${transaction.transactionHash}`} target="_blank" rel="noreferrer" className="w-full">
                              <p className="grid grid-cols-12 gap-2">
                                <Image
                                  src="/images/etherscan.png"
                                  alt="NFT Image"
                                  className="rounded-full border border-gray-100 shadow-sm pr-3"
                                  height={20}
                                  width={20}
                                />
                                <span className="col-span-10">  View On Etherscan </span>
                                <span className="text-right"><BsBoxArrowInUpRight /></span>
                              </p>
                            </a>
                          </div>
                        ) : ""
                      }
                      {
                        metadata && (
                          <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                            <a href={metadata} target="_blank" rel="noreferrer" className="w-full">
                              <p className="grid grid-cols-12 gap-2">
                                <Image
                                  src="/images/ipfc.png"
                                  alt="NFT Image"
                                  className="rounded-full border border-gray-100 shadow-sm pr-3"
                                  height={20}
                                  width={20}
                                />
                                <span className="col-span-10">  View On IPFS </span>
                                <span className="text-right"><BsBoxArrowInUpRight /></span>
                              </p>
                            </a>
                          </div>
                        )
                      }
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div >
          </div >
        </div >
      </section >

      <section className="lg:px-14 sm:px-3 lg:pb-0 md:pb-0 pb-0 pt-10 nftdetail_right_col mb-5">
        <div className="container mx-auto">
          <div className="px-13 ">
            <Tabs className="py-3 px-3">
              <TabList>
                <Tab>Description</Tab>
                <Tab>History</Tab>
                <Tab>Properties</Tab>
                <Tab>Listing</Tab>
                <Tab>Offers</Tab>
              </TabList>

              <TabPanel>
                <p className="dark:text-[#707a83]">{details.description}</p>
              </TabPanel>
              <TabPanel>
                <div className="mt-4 -mb-3">

                  <div className="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">

                    <div style={{
                      backgroundPosition: "10px 10px"
                    }} className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                    <div className="relative rounded-xl overflow-auto">
                      {
                        !isLoadingObject.history ? (
                          <>
                            <table className="border-collapse table-fixed w-full text-sm">
                              <thead>
                                <tr>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Image</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Type</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Price</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">USD Price</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Created On</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Owned By</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-slate-800">
                                {
                                  histories?.length ? (
                                    histories.map((history: any, key: number) => {
                                      return (
                                        <tr key={key}>
                                          <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
                                            <Image
                                              src={history.owner.image || "/images/client-1.png"}
                                              alt="NFT Image"
                                              className="rounded-full border border-gray-100 shadow-sm"
                                              height={40}
                                              width={40}
                                            />
                                          </td>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400">{capitalize(history.type.replaceAll('_', " "))}</td>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400"><FaEthereum style={{ display: "inline-block", marginTop: "-4px"}} /> {history.price.eth} ETH</td>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400">$ {history.price.dollar}</td>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400">{(moment(history.createdAt).fromNow())}</td>
                                          <td className="border-b border-slate-200 dark:border-slate-600 py-4 px-2 text-slate-500 dark:text-slate-400">@{subString(history.owner?.username)}</td>

                                        </tr>
                                      )
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan={6} className="text-center py-2 text-lg">No Data Found</td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <NoDataFound>Loading...</NoDataFound>
                        )
                      }
                    </div>
                    <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
                  </div>

                </div>

              </TabPanel >

              <TabPanel>
                <div className="flex properties_row flex-row flex-wrap">
                  {
                    properties?.length ? (
                      properties.map((property: any, key: number) => {

                        return (
                          <div key={key} className="lg:basis-3/12 md:basis-4/12 basis-6/12 properties_col">
                            <div className=" ml-2 text-center properties_col_content" >
                              <h6 className=" dark:text-[#fff] font-semibold">{property.trait_type}</h6>
                              <h6 className=" dark:text-[#fff] mt-2 text-[#707a83] text-xs ">{property.value}</h6>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <NoDataFound />
                    )
                  }
                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-4 -mb-3">

                  {
                    !isLoadingObject.listing ? (
                      <>
                        <div className="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
                          <div style={{
                            backgroundPosition: "10px 10px"
                          }} className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                          <div className="relative rounded-xl overflow-auto">
                            <table className="border-collapse table-fixed w-full text-sm">
                              <thead>
                                <tr>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-4 text-slate-400 dark:text-slate-200 text-left">Price</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-4 text-slate-400 dark:text-slate-200 text-left">USD Price</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-4 text-slate-400 dark:text-slate-200 text-left">Expiration</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-4 text-slate-400 dark:text-slate-200 text-left">From</th>
                                  {/* <th className="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left">Action</th> */}
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-slate-800">
                                {
                                  listings?.length ? (
                                    listings.map((listing: any, key: number) => {
                                      const isYou = listing.creator.id === user?.id;
                                      const from = isYou ? "you" : `@${subString(listing.creator?.username)}`;
                                      // const url = `/creators/${listing.creator.id}`
                                      return (
                                        <tr key={key}>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-4 text-slate-500 dark:text-slate-400">{listing.price.eth} {SITE_TOKEN}</td>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-4 text-slate-500 dark:text-slate-400">${listing.price.dollar}</td>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-4 text-slate-500 dark:text-slate-400">{listing.expiration}</td>
                                          <td className="border-b border-slate-200 dark:border-slate-600 py-4 px-4 text-slate-500 dark:text-slate-400">{from}</td>
                                          {/* <td className="border-b border-slate-200 dark:border-slate-600 py-4 px-2 text-slate-500 dark:text-slate-400">
                                            {
                                              isAuthenticated && user.id === ownedBy.id ? (
                                                <Button size="small" variant="outlined" onClick={(e) => handleOffer(e, offer.id)}>Accept</Button>
                                              ) : ""
                                            }
                                          </td> */}
                                        </tr>
                                      )
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="text-center py-2 text-lg">No Data Found</td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </table>
                          </div>
                          <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
                        </div>
                      </>
                    ) : (
                      <NoDataFound>Loading...</NoDataFound>
                    )
                  }

                </div>
              </TabPanel>
              <TabPanel>
                <div className="mt-4 -mb-3">

                  {
                    !isLoadingObject.offers ? (
                      <>
                        <div className="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
                          <div style={{
                            backgroundPosition: "10px 10px"
                          }} className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                          <div className="relative rounded-xl overflow-auto">
                            <table className="border-collapse table-fixed w-full text-sm">
                              <thead>
                                <tr>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-4 text-slate-400 dark:text-slate-200 text-left">Price</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-4 text-slate-400 dark:text-slate-200 text-left">USD Price</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-4 text-slate-400 dark:text-slate-200 text-left">Expiration</th>
                                  <th className="border-b dark:border-slate-600 font-medium py-4 px-4 text-slate-400 dark:text-slate-200 text-left">From</th>
                                  {/* <th className="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-3 pb-3 text-slate-400 dark:text-slate-200 text-left">Action</th> */}
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-slate-800">
                                {
                                  offers?.length ? (
                                    offers.map((offer: any, key: number) => {
                                      const isYou = offer.offerer === user?.id;
                                      const offerer = isYou ? "you" : `@${subString(offer.offerer?.username)}`;
                                      // const url = `/creators/${offer.offerer.id}`
                                      return (
                                        <tr key={key}>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-4 text-slate-500 dark:text-slate-400"> {offer.offerPrice.eth} {SITE_TOKEN}</td>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-4 text-slate-500 dark:text-slate-400"> ${offer.offerPrice.dollar}</td>
                                          <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-4 text-slate-500 dark:text-slate-400">{offer.expiration}</td>
                                          <td className="border-b border-slate-200 dark:border-slate-600 py-4 px-4 text-slate-500 dark:text-slate-400">{offerer}</td>
                                          {/* <td className="border-b border-slate-200 dark:border-slate-600 py-4 px-2 text-slate-500 dark:text-slate-400">
                                            {
                                              isAuthenticated && createdBy.id === ownedBy.id ? (
                                                <Button size="small" variant="outlined" onClick={(e) => handleOffer(e, offer.id)}>Accept</Button>
                                              ) : ""
                                            }
                                          </td> */}
                                        </tr>
                                      )
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="text-center py-2 text-lg">No Data Found</td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </table>
                          </div>
                          <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
                        </div>
                      </>
                    ) : (
                      <NoDataFound>Loading...</NoDataFound>
                    )
                  }

                </div>
              </TabPanel>
            </Tabs >
          </div>
        </div>
      </section>

      <CustomModal
        aria-labelledby="collection-dialog"
        open={open}
        onClose={(_: any, reason: any) => {
          if (reason !== "backdropClick") {
            setOpen(false);
          }
        }}
        className="nft-card-buy-section"
      >
        <ModalHeader onClose={() => setOpen(false)}>
          <span className="font-bold">Follow steps</span>
        </ModalHeader>
        <ModalContent>
          <Box sx={{
            pb: 2,
            mx: 'auto',
          }}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item>
                {
                  states.removeFromSale.isLoader
                    ? <CircularProgress size={30} color="secondary" />
                    : <AiOutlineCheck color={states.removeFromSale.isComplete ? "green" : "secondary"} size={30} />
                }
              </Grid>
              <Grid item xs>
                <h1 className="font-bold text-[#000] dark:text-[#fff]">Remove Item</h1>
                <Typography>Removing nft item from Sale</Typography>
              </Grid>
            </Grid>
            {states.removeFromSale.isError
              && <Grid item>
                <p style={{ color: "red", marginLeft: '17%' }}>{states.removeFromSale.errorMessage}</p>
              </Grid>
            }
            <Grid container wrap="nowrap" spacing={2} sx={{
              'mt': 1
            }}>
              <Grid item>
                {
                  states.onOwnServer.isLoader
                    ? <CircularProgress size={30} color="secondary" />
                    : <AiOutlineCheck color={states.onOwnServer.isComplete ? "green" : "secondary"} size={30} />
                }
              </Grid>
              <Grid item xs>
                <h1 className="font-bold text-[#000] dark:text-[#fff]">Sign Message</h1>
                <Typography>Sign message with nft item preferences</Typography>
              </Grid>
            </Grid>
            {states.onOwnServer.isError
              && <Grid item>
                <p style={{ color: "red", marginLeft: '17%' }}>{states.onOwnServer.errorMessage}</p>
              </Grid>
            }
          </Box>
        </ModalContent>
        {
          states.onOwnServer.isComplete || states.removeFromSale.isError || states.onOwnServer.isError ? (
            <ModalFooter className="steps_popup_button">
              {
                states.onOwnServer.isComplete
                  ? <Link href={window.location.pathname} passHref>
                    <Button autoFocus variant="outlined">Refresh Page</Button>
                  </Link>
                  : (
                    states.removeFromSale.isError || states.onOwnServer.isError
                      ? <Button autoFocus variant="outlined" onClick={tryAgainModal}>Try again</Button>
                      : ""
                  )
              }
            </ModalFooter>
          ) : ""
        }
      </CustomModal>


      {/* <section className="explore_section  pb-20 pt-20 lg:px-14 md:px-14 px-5 ">
        <div className="container-fluid mx-auto">
          <div className="flex flex-row space-x-2 pb-10 ">
            <h2
              className="dark:text-white text-[#000] text-4xl font-semibold	text-center"
              data-aos="zoom-in"
              data-aos-duration="3000"
            >
              Related Products
            </h2>
          </div>
          <div className="lg:flex md:flex block md:flex-wrap lg:flex-nowrap flex-row lg:space-x-4 md:space-x-0  space-x-0  lg:space-y-0 md:space-y-0 space-y-3 	">
            {
              isLoading ? (
                <NoDataFound isLoading={true} />
              ) : (
                <>
                  {
                    nfts.length ? (
                      nfts.map((nft, key) => <NFTCard key={key} {...nft} />)
                    ) : (
                      <NoDataFound />
                    )
                  }
                </>
              )
            }
          </div>
        </div>
      </section> */}
    </div >
  );
}

export default NFTDetail;