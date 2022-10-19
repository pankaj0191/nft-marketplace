import { useState, useEffect, FC } from "react";

import moment from "moment";
import Link from "next/link";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Button, capitalize, CircularProgress, FormControl, Grid, Typography, TextField } from "@mui/material";
import { MdCheckCircleOutline, MdOutlineCancel } from "react-icons/md";

import Buy from "./Buy";
import { SITE_TOKEN } from "utils";
import { followStepError } from "helpers/web3";
import { validateMakeAOfferData } from "schemas";
import { DVCountDown } from "components/miscellaneous";
import { Metamask, MetamaskContextResponse } from "context";
import { CustomModal, ModalContent, ModalFooter, ModalHeader } from "components/miscellaneous/modal";
import { acceptNftOffer, getNftAuctions, offerNft, placeABidForNft, transferNftItem } from "services";
import { formatSolidityError, getNftMarketContract, getTransactionOptions, IsJsonString, subString, toCaptalize } from "helpers";

import { UserWalletAddress } from "@types";

const defaultStateOptions = {
    isLoader: false,
    isComplete: false,
    isError: false,
    errorMessage: "",
    callback: ""
}

const defaultMarketplaceStates = {
    buying: {
        buy: {
            ...defaultStateOptions,
            callback: "buyNftItem"
        },
        onOwnServer: {
            ...defaultStateOptions,
            callback: "buyNftItemAPI"
        }
    },
    offering: {
        offer: {
            ...defaultStateOptions,
            callback: "makeAOfferForNft"
        },
        onOwnServer: {
            ...defaultStateOptions,
            callback: "offerNftItemAPI"
        }
    },
    auctioning: {
        auction: {
            ...defaultStateOptions,
            callback: "placeABid"
        },
        onOwnServer: {
            ...defaultStateOptions,
            callback: "placeABidAPI"
        }
    },
    acceptOffering: {
        acceptOffer: {
            ...defaultStateOptions,
            callback: "acceptOffer"
        },
        onOwnServer: {
            ...defaultStateOptions,
            callback: "acceptOfferNftAPI"
        }
    },
    transfering: {
        transfer: {
            ...defaultStateOptions,
            callback: "transferToAuctionWinner"
        },
        onOwnServer: {
            ...defaultStateOptions,
            callback: "tranferNftApi"
        }
    },
    active: "",
    others: {
        buy: {
            title: "Buy NFT",
            description: "Buy nft item"
        },
        offer: {
            title: "Make Offer",
            description: "Make a offer for the nft item"
        },
        auction: {
            title: "Bid For NFT",
            description: "Place a bid for nft item"
        },
        acceptOffer: {
            title: "Accepting Offer",
            description: "Accepting the nft item's offer."
        },
        transfer: {
            title: "Transfering NFT",
            description: "Transfer the nft item to slected wallet address."
        },
        onOwnServer: {
            title: "Sign message",
            description: "Sign message with nft item preferences"
        },
    }
}

type MarketplaceStates = typeof defaultMarketplaceStates;

interface MarketplaceProps {
    nft: any;
    useUpdate: [Boolean, Function];
}

interface MarketplaceComponentProps {
    nft: any;
    useStates: [any, Function];
    useModalOpen: [Boolean, Function];
    setError: Function;
    useUpdate: [Boolean, Function];
}

interface FormDataProps {
    price: string;
    startDate: Date;
    endDate: Date;
}

const BuyerMarketPlaceComponent: FC<MarketplaceComponentProps> = ({ nft, useStates, useModalOpen, setError, useUpdate }) => {
    const [marketplaceStates, setMarketplaceStates] = useStates;
    const [updated, setUpdated] = useUpdate;
    const [open, setOpen] = useModalOpen;
    const { onMarketPlace, marketplace, id, tokenId, itemId }: any = nft;
    const marketplaceData = marketplace.data || {};
    const { login, isAuthenticated, user, loginUserSigner }: MetamaskContextResponse = Metamask.useContext();
    const [transaction, setTransaction] = useState<any>({});
    const [currentBidData, setCurrentBidData] = useState<any>({});
    const [modalData, setModalData] = useState<any>({
        open: false,
        title: "",
        slug: ""
    });
    const [formData, setFormData] = useState<FormDataProps>({
        price: "",
        startDate: new Date(moment().format("DD-MM-YYYY, 00:00:00")),
        endDate: new Date(moment().add(1, 'd').format("DD-MM-YYYY, 23:59:00"))
    });
    const [isValidError, setIsValidError] = useState({
        valid: true,
        message: ""
    });

    const defaultStates: any = defaultMarketplaceStates;
    const activeModal = marketplaceStates.active?.trim() || "";
    const modal: any = marketplaceStates[activeModal] || {};
    const router = useRouter();

    const isTryAgain = Object.values(modal).find((value: any) => value.isError) || false;
    const isNotCompleted = Object.values(modal).find((value: any) => !value.isComplete) || false;

    useEffect(() => {
        (async () => {
            if (marketplace.action === "timed_auction") {
                const actionData = await getNftAuctions(id, {
                    current: true,
                    response: "single"
                });
                setCurrentBidData(actionData)
            }
        })();
    }, [id, marketplace])

    const handleChange = (event: any) => {
        event.preventDefault();
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleModal = (slug: string = "") => {
        slug = slug.trim() ? slug.trim() : "bid";
        setModalData({
            open: true,
            title: slug === "bid" ? "Place a bid" : "Make a Offer",
            slug
        })
        setIsValidError({
            valid: true,
            message: ""
        })
        if (slug !== "bid") {
            setFormData({
                ...formData,
                endDate: new Date(moment().add(1, 'month').format('YYYY-MM-DD'))
            })
        }
    }

    const resetModal = () => {
        setModalData({
            open: false,
            title: "",
            slug: ""
        })
    }

    const handleSubmit = async (event: any) => {
        if (modalData.slug === "bid") {
            await handlePlaceAuctionBid(event)
        } else if (modalData.slug === "offer") {
            await handleMakeAOffer(event)
        }
    }

    const handlePlaceAuctionBid = async (event: any) => {
        event.preventDefault();
        try {
            const bidPrice = parseFloat(formData.price || "0");
            const maxBidPrice = parseFloat(currentBidData?.maxBidPrice.eth || "0");
            if (bidPrice > 0 && bidPrice > maxBidPrice) {
                setIsValidError({
                    valid: true,
                    message: ""
                });
                setOpen(true);
                await placeABid();
            } else {
                const message = bidPrice < maxBidPrice ?
                    "Bid price must be greater than higher bid"
                    : "Bid price must be greater than zero!";
                setIsValidError({
                    valid: true,
                    message: message
                });
            }
        } catch (error: any) {
            var parseJson: any = IsJsonString(error.message);
            if (!parseJson) {
                parseJson = {
                    slug: "auction",
                    message: error.message
                }
            }
            setError(parseJson.slug, parseJson.message);
        }
    }

    const placeABid = async () => {
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }
            setMarketplaceStates({
                ...defaultStates,
                active: "auctioning",
                auctioning: {
                    auction: {
                        ...defaultStateOptions,
                        isLoader: true
                    },
                    onOwnServer: defaultStateOptions
                }
            })

            const price = ethers.utils.parseUnits(formData.price.toString(), "ether");
            const nftMarketPlaceContract: any = await getNftMarketContract();
            const options: any = {
                value: price,
                from: user.address
            }
            const transactionOptions = await getTransactionOptions();
            if (transactionOptions) {
                options.gasPrice = transactionOptions.gasPrice;
                options.nonce = transactionOptions.nonce;
            }
            const marketPlaceTransaction = await nftMarketPlaceContract.bidPlace(
                parseInt(itemId),
                price,
                options
            );
            const bidTx = await marketPlaceTransaction.wait();
            if (bidTx) {
                setTransaction(bidTx)
                await placeABidAPI();
            } else {
                const message = "Something went wrong during bidding!"
                throw new Error(JSON.stringify({ slug: "auction", message }));
            }
        } catch (error: any) {
            const err = formatSolidityError(error.message);
            const message = err ? capitalize(err.message) : error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "auction",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }
    }

    const placeABidAPI = async () => {
        try {
            if (!isAuthenticated) {
                login();
                return;
            }
            setMarketplaceStates({
                ...defaultStates,
                active: "auctioning",
                auctioning: {
                    auction: {
                        ...defaultStateOptions,
                        isComplete: true
                    },
                    onOwnServer: {
                        ...defaultStateOptions,
                        isLoader: true
                    }
                }
            })
            const userSign = await loginUserSigner();
            if (!userSign.status) {
                throw new Error(JSON.stringify({ slug: "onOwnServer|auctioning", message: userSign.message }));
            }
            const result = await placeABidForNft(id, {
                transaction,
                price: formData.price,
                userSign: userSign.sign
            });
            if (result.status === "success") {
                setMarketplaceStates({
                    ...defaultStates,
                    active: "auctioning",
                    auctioning: {
                        auction: {
                            ...defaultStateOptions,
                            isComplete: true
                        },
                        onOwnServer: {
                            ...defaultStateOptions,
                            isComplete: true
                        }
                    }
                })
            } else {
                const message = result.message || "something went wrong"
                throw new Error(JSON.stringify({ slug: "onOwnServer|auctioning", message }));
            }
        } catch (error: any) {
            const message = error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "onOwnServer|auctioning",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }

    }

    const handleMakeAOffer = async (event: any) => {
        event.preventDefault();
        try {
            const result = await validateMakeAOfferData({
                expiredDate: formData.endDate,
                price: formData.price
            });
            if (result.status) {
                setOpen(true);
                await makeAOfferForNft();
            } else {
                setIsValidError({
                    valid: true,
                    message: result.errors.shift()
                })
            }
        } catch (error: any) {
            var parseJson: any = IsJsonString(error.message);
            if (!parseJson) {
                parseJson = {
                    slug: "offer",
                    message: error.message
                }
            }
            setError(parseJson.slug, parseJson.message);
        }
    }

    const makeAOfferForNft = async () => {
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }
            setMarketplaceStates({
                ...defaultStates,
                active: "offering",
                offering: {
                    offer: {
                        ...defaultStateOptions,
                        isLoader: true
                    },
                    onOwnServer: defaultStateOptions
                }
            })
            const price = ethers.utils.parseUnits(formData.price.toString(), "ether");
            const nftMarketPlaceContract: any = await getNftMarketContract();
            const endTime = moment(formData.endDate).format('YYYY-MM-DD 23:59:00');
            const options: any = {
                value: price,
                from: user.address
            }
            const transactionOptions = await getTransactionOptions();
            if (transactionOptions) {
                options.gasPrice = transactionOptions.gasPrice;
                options.nonce = transactionOptions.nonce;
            }
            const marketPlaceTransaction = await nftMarketPlaceContract.createOfferForItem(
                parseInt(itemId),
                price,
                moment().utc().add(1, 'hour').unix(),
                moment(endTime).utc().unix(),
                options
            );
            const offerTx = await marketPlaceTransaction.wait();
            if (offerTx) {
                setTransaction(offerTx)
                await offerNftItemAPI(offerTx);
            } else {
                const message = "Something went wrong during offering!"
                throw new Error(JSON.stringify({ slug: "offer", message }));
            }
        } catch (error: any) {
            const err = formatSolidityError(error?.data?.message || error.message);
            const message = err ? capitalize(err.message) : error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "offer",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }
    }

    const offerNftItemAPI = async (tx: any = {}) => {
        tx = Object.keys(tx).length ? tx : transaction;
        try {
            if (!isAuthenticated) {
                login();
                return;
            }
            setMarketplaceStates({
                ...defaultStates,
                active: "offering",
                offering: {
                    offer: {
                        ...defaultStateOptions,
                        isComplete: true
                    },
                    onOwnServer: {
                        ...defaultStateOptions,
                        isLoader: true
                    }
                }
            })
            const userSign = await loginUserSigner();
            if (!userSign.status) {
                throw new Error(JSON.stringify({ slug: "onOwnServer|offering", message: userSign.message }));
            }
            const result = await offerNft(id, {
                transaction: tx,
                price: formData.price,
                expiredDate: formData.endDate,
                userSign: userSign.sign
            });
            if (result.status === "success") {
                setMarketplaceStates({
                    ...defaultStates,
                    active: "offering",
                    offering: {
                        offer: {
                            ...defaultStateOptions,
                            isComplete: true
                        },
                        onOwnServer: {
                            ...defaultStateOptions,
                            isComplete: true
                        }
                    }
                })
            } else {
                const message = result.message || "something went wrong"
                throw new Error(JSON.stringify({ slug: "onOwnServer|offering", message }));
            }
        } catch (error: any) {
            const message = error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "onOwnServer|offering",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }

    }

    const tryAgainModal = async () => {
        try {
            Object.keys(modal).forEach(async (element) => {
                try {
                    const modalAsset = modal[element];
                    if (modalAsset.isError) {
                        if (eval(`typeof ${modalAsset.callback}`) === "function") {
                            await eval(`${modalAsset.callback}()`);
                        }
                    }
                } catch (error: any) {
                    var parseJson: any = IsJsonString(error.message);
                    if (!parseJson) {
                        parseJson = {
                            slug: activeModal?.slice(0, -3) || "",
                            message: error.message
                        }
                    }
                    setError(parseJson.slug, parseJson.message);
                }
            });
        } catch (error: any) {
            var parseJson: any = IsJsonString(error.message);
            if (!parseJson) {
                parseJson = {
                    slug: activeModal?.slice(0, -3) || "",
                    message: error.message
                }
            }
            setError(parseJson.slug, parseJson.message);
        }
    }

    const refreshPage = () => {
        setModalData({
            open: false,
            title: "",
            slug: ""
        })
        setOpen(false);
        setUpdated(!updated);
        // router.push(window.location.pathname)
    }

    const useUpdated = () => {
        return useUpdate;
    }

    return (
        <>
            <div>
                {
                    onMarketPlace ? (
                        <>
                            {(() => {
                                switch (marketplace.action) {
                                    case 'fixed_price':
                                        return <div className="fixed-price-owner-section dark:text-white py-3">
                                            <div className="w-full dark:text-white">Current Price</div>
                                            <div className="grid grid-cols-2 gap-2" >
                                                <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                                                    <p className="grid grid-cols-12 gap-2">
                                                        <span className="col-span-10 text-xl ml-2">
                                                            {parseFloat(parseFloat(nft.price.eth).toFixed(4))} {SITE_TOKEN}
                                                            <span className="text-xs ml-2">( ${parseFloat(nft.price.dollar).toFixed(2)} )</span>
                                                        </span>
                                                        <span className="text-xs"></span>
                                                    </p>
                                                </div>
                                                <div className="myprofile_onsale_column_box_creator_owned mt-2">
                                                    <Buy nft={nft} useUpdate={useUpdated} />
                                                </div>
                                            </div>
                                        </div>
                                    case 'open_for_bids':
                                        return <div className="open-for-bids-section dark:text-white py-3">
                                            <div className="w-full dark:text-white">Current Price</div>
                                            <div className="grid grid-cols-2 gap-2" >
                                                <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                                                    {
                                                        parseFloat(nft.price.eth) > 0 ? (
                                                            <p className="grid grid-cols-12 gap-2">
                                                                <span className="col-span-10 text-xl ml-2">
                                                                    {parseFloat(parseFloat(nft.price.eth).toFixed(4))} {SITE_TOKEN}
                                                                    <span className="text-xs ml-2">( ${parseFloat(nft.price.dollar).toFixed(2)} )</span>
                                                                </span>
                                                                <span className="text-xs"></span>
                                                            </p>
                                                        ) : "Not Set Yet"
                                                    }
                                                </div>
                                                <div className="myprofile_onsale_column_box_creator_owned text-right">
                                                    <button
                                                        className="hover:bg-[#571a81] dark:text-[#fff] text-[#000] hover:text-[#fff] text-sm font-normal py-2 px-6 rounded-full border-2 dark:border-[#fff] border:[#000] hover:border-[#571a81]"
                                                        onClick={() => handleModal("offer")}
                                                    >
                                                        Make a Offer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>


                                    case 'timed_auction':
                                        return <div className="timed-auction-section">
                                            <div className="nftdetail_countdown ">
                                                <DVCountDown
                                                    date={currentBidData.endDate}
                                                />
                                            </div>
                                            <div className=" my-5 nftdetail_bids  singlepage_owner_list flex ">
                                                <div className="nftdetail_bids_col">
                                                    <div className="ml-2 items-center">
                                                        <h6 className=" dark:text-[#fff] capitalize">Higher Bid:</h6>
                                                        <h5 className=" nftdetail_price_row_price  dark:text-[#fff] text-[#707a83] text-xs flex">
                                                            {currentBidData?.maxBidPrice?.eth || "0"} {SITE_TOKEN}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="nftdetail_bids_col">
                                                    <div className="ml-2 items-center">
                                                        <h6 className=" dark:text-[#fff] capitalize">Min Bid:</h6>
                                                        <h5 className=" nftdetail_price_row_price  dark:text-[#fff] text-[#707a83] text-xs flex">
                                                            {currentBidData?.initialBidPrice?.eth || "0"} {SITE_TOKEN}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <div className="nftdetail_bids_col">
                                                    <div className="ml-2 items-center">
                                                        <h6 className=" dark:text-[#fff] capitalize">Last Bidder:</h6>
                                                        <h5 className=" nftdetail_price_row_price  dark:text-[#fff] text-[#707a83] text-xs flex">
                                                            {
                                                                currentBidData?.winner?.id ? (
                                                                    <Link href={`creator/${currentBidData.winner.id}`} className="mr-1"><a>{currentBidData?.winner?.username || ""}</a></Link>
                                                                ) : (
                                                                    <span>No Bid Yet</span>
                                                                )
                                                            }
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                moment().isBefore(currentBidData.endDate) ? (
                                                    <div className="nftdetail_bidby  flex items-center justify-between">
                                                        <div className="myprofile_onsale_column_box_content_purchase_btn flex justify-left ">
                                                            <button
                                                                className="hover:bg-[#571a81] dark:text-[#fff] text-[#000] hover:text-[#fff] text-sm font-normal py-2 px-6 rounded-full border-2 dark:border-[#fff] border:[#000] hover:border-[#571a81] bg-transparent"
                                                                onClick={() => handleModal()}
                                                            >
                                                                Place Your Bid
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : ""
                                            }
                                        </div>
                                    default:
                                        return <div></div>
                                }
                            })()}
                        </>
                    ) : (
                        <div className="not-in-marketplace">
                            {
                                nft.price.eth > 0 ? (
                                    <div className="fixed-price-owner-section dark:text-white py-3">
                                        <div className="w-full dark:text-white">Current Price</div>
                                        <div className="grid grid-cols-2 gap-2" >
                                            <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                                                <p className="grid grid-cols-12 gap-2">
                                                    <span className="col-span-10 text-xl ml-2">
                                                        {parseFloat(parseFloat(nft.price.eth).toFixed(4))} {SITE_TOKEN}
                                                        <span className="text-xs ml-2">( ${parseFloat(nft.price.dollar).toFixed(2)} )</span>
                                                    </span>
                                                    <span className="text-xs"></span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : ""
                            }
                        </div>
                    )
                }
            </div>
            <CustomModal
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="collection-dialog"
                open={activeModal ? open : false}
                onClose={(_: any, reason: any) => {
                    if (reason !== "backdropClick") {
                        setOpen(false);
                    }
                }}
            >
                <ModalHeader onClose={() => setOpen(false)}>
                    <span className="font-bold">Follow steps</span>
                </ModalHeader>
                <ModalContent>
                    {
                        Object.keys(modal).length ?
                            (
                                <>
                                    {
                                        Object.keys(modal).map((value: string, key: number) => {
                                            return (
                                                <div key={key} className={`${key > 0 ? 'mt-3' : ""}`}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={2} md={2}>
                                                            {
                                                                modal[value]?.isLoader
                                                                    ? <CircularProgress size={30} color="secondary" />
                                                                    : modal[value]?.isError ? <MdOutlineCancel color="red" size={30} />
                                                                        : <MdCheckCircleOutline color={modal[value]?.isComplete ? "green" : "secondary"} size={30} />
                                                            }
                                                        </Grid>
                                                        <Grid item xs>
                                                            <h1 className="font-bold text-[#000] dark:text-[#fff]">{toCaptalize(defaultStates.others[value].title)}</h1>
                                                            <Typography>{defaultStates.others[value].description}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    {
                                                        modal[value]?.isError
                                                        && <Grid item>
                                                            <p style={{ color: "red", marginLeft: '17%' }}>{modal[value]?.errorMessage}</p>
                                                        </Grid>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            ) : ""
                    }
                </ModalContent>
                {
                    isTryAgain || !isNotCompleted ? (
                        <ModalFooter className="steps_popup_button">
                            {
                                !isNotCompleted
                                    ? <Button autoFocus variant="outlined" onClick={refreshPage}>Refresh Page</Button>
                                    : (
                                        isTryAgain
                                            ? <Button autoFocus variant="outlined" onClick={tryAgainModal}>Try again</Button>
                                            : ""
                                    )
                            }
                        </ModalFooter>
                    ) : ""
                }
            </CustomModal>

            {/* Place A Bid Modal by Buyer */}
            <CustomModal
                fullWidth={true}
                maxWidth="xs"
                aria-labelledby="collection-dialog"
                open={modalData.open}
                onClose={() => resetModal()}
            >
                <ModalHeader onClose={() => resetModal()}>
                    <span className="font-bold">{modalData.title}</span>
                </ModalHeader>
                <ModalContent>
                    {
                        isValidError.message && (
                            <div id="alert-2" className="flex p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200" role="alert">
                                <svg className="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                                <div className="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
                                    {isValidError.message}
                                </div>
                                <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-red-200 dark:text-red-600 dark:hover:bg-red-300" data-dismiss-target="#alert-2" aria-label="Close"
                                    onClick={() => setIsValidError({ ...isValidError, message: "" })}
                                >
                                    <span className="sr-only">Close</span>
                                    <MdOutlineCancel />
                                </button>
                            </div>
                        )
                    }
                    <div className="timed-auction-content">
                        <div className="grid grid-cols-1 mb-5">
                            <FormControl
                                className="mb-6 md:mb-0"
                            >
                                <label
                                    className="block text-[#363434] text-md mb-2"
                                    htmlFor="price"
                                ><b>Price ( {SITE_TOKEN} )</b></label>
                                <input
                                    className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight text-[#333333] dark:text-[#acacac] text-sm"
                                    onChange={handleChange}
                                    name="price"
                                    id="price"
                                    min={0}
                                    value={formData.price}
                                    type="number"
                                    placeholder="Enter Price"
                                />
                            </FormControl>
                        </div>
                        {
                            modalData.slug === "offer" ? (
                                <div className="grid grid-cols-1 gap-2 mb-5 date__main-wrap">
                                    {/* <FormControl
                                        className="icon_back start-date-field"
                                    >
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                label="Starting Date"
                                                value={new Date(formData.startDate)}
                                                minDate={new Date()}
                                                className="custom-datepicker"
                                                onChange={(value) => {
                                                    const startDate = value ? new Date(moment(value).format('YYYY-MM-DD 00:00:00')) : new Date(moment().format('YYYY-MM-DD 00:00:00'));
                                                    const endDate = new Date(moment(startDate).add(1, 'day').format("YYYY-MM-DD, 23:59:00"))
                                                    console.log({ startDate, endDate })
                                                    setFormData({
                                                        ...formData,
                                                        startDate,
                                                        endDate
                                                    });
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl> */}
                                    <FormControl
                                        className="icon_back start-date-field"
                                    >
                                        <label htmlFor="">Expiration Date</label>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                value={new Date(formData.endDate)}
                                                className="custom-datepicker"
                                                minDate={new Date(moment().add(1, 'month').format('YYYY-MM-DD'))}
                                                onChange={(newValue) => {
                                                    const endDate = newValue ? new Date(newValue) : new Date(moment(formData.startDate).add(1, 'd').format("DD-MM-YYYY, 23:59:00"))
                                                    setFormData({
                                                        ...formData,
                                                        endDate
                                                    });
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </div>
                            ) : ""
                        }
                    </div>
                </ModalContent>
                <ModalFooter className="steps_popup_button">
                    <Button color="secondary" autoFocus variant="outlined" onClick={handleSubmit}>{modalData.slug === "offer" ? "Make Offer" : "Place A Bid"}</Button>
                </ModalFooter>
            </CustomModal>
        </>
    )
}

const OwnerMarketPlaceComponent: FC<MarketplaceComponentProps> = ({ nft, useStates, useModalOpen, setError, useUpdate }) => {
    const [marketplaceStates, setMarketplaceStates] = useStates;
    const [updated, setUpdated] = useUpdate;
    const [open, setOpen] = useModalOpen;
    const { onMarketPlace, marketplace, id, tokenId, itemId, createdBy, ownedBy }: any = nft;
    const { login, isAuthenticated, user, loginUserSigner }: MetamaskContextResponse = Metamask.useContext();
    const [transaction, setTransaction] = useState<any>({});
    const defaultStates: any = defaultMarketplaceStates;
    const activeModal = marketplaceStates.active?.trim() || "";
    const modal = marketplaceStates[activeModal] || {};
    const isTryAgain = Object.values(modal).find((value: any) => value.isError) || false;
    const isNotCompleted = Object.values(modal).find((value: any) => !value.isComplete) || false;
    const router = useRouter();

    const [currentOffers, setCurrentOffers] = useState<any[]>([]);
    const [acceptingOfferId, setAcceptingOfferId] = useState<string>('');
    const [offererAddress, setOffererAddress] = useState<UserWalletAddress>('');
    const [currentAuction, setCurrentAuction] = useState<any>({});
    const marketPlaceAction = marketplace.action || "";

    useEffect(() => {
        (async () => {
            switch (marketPlaceAction) {
                case "open_for_bids":
                    const currentOffersRes = await offerNft(id, {
                        current: true
                    }, 'get');
                    setCurrentOffers(currentOffersRes);
                    break;
                case "timed_auction":
                    const auctions = await getNftAuctions(id, {
                        current: true,
                        response: 'single'
                    });
                    setCurrentAuction(auctions);
                    break;

                default:
                    break;
            }
        })();
    }, [marketPlaceAction, id]);

    const handleOffer = async (event: any, offerId: string, _offerer: UserWalletAddress) => {
        event.preventDefault();
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }
            setOpen(true);
            setAcceptingOfferId(offerId);
            setOffererAddress(_offerer);
            await acceptOffer(offerId, _offerer);
        } catch (error: any) {
            var parseJson: any = IsJsonString(error.message);
            if (!parseJson) {
                parseJson = {
                    slug: "acceptOffer",
                    message: error.message
                }
            }
            setError(parseJson.slug, parseJson.message);
        }
    }

    const acceptOffer = async (offerId = "", _offerer: UserWalletAddress = "") => {
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }
            setMarketplaceStates({
                ...defaultStates,
                active: "acceptOffering",
                acceptOffering: {
                    acceptOffer: {
                        ...defaultStateOptions,
                        isLoader: true
                    },
                    onOwnServer: defaultStateOptions
                }
            })
            _offerer = _offerer.trim() ? _offerer.trim() : offererAddress;
            offerId = offerId ? offerId : acceptingOfferId;
            const options: any = {
                from: user.address
            }
            const transactionOptions = await getTransactionOptions();
            if (transactionOptions) {
                options.gasPrice = transactionOptions.gasPrice;
                options.nonce = transactionOptions.nonce;
            }
            const nftMarketPlaceContract: any = await getNftMarketContract();
            const marketPlaceTransaction = await nftMarketPlaceContract.acceptOfferForItem(
                parseInt(itemId),
                _offerer,
                options
            );
            const tx = await marketPlaceTransaction.wait();
            if (tx) {
                setTransaction(tx)
                await acceptOfferNftAPI(offerId, _offerer, tx);
            } else {
                const message = "Something went wrong during accepting offer!"
                throw new Error(JSON.stringify({ slug: "acceptOffer", message }));
            }
        } catch (error: any) {
            const err = formatSolidityError(error.message);
            const message = err ? capitalize(err.message) : error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "acceptOffer",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }
    }

    const acceptOfferNftAPI = async (offerId = "", _offerer = "", tx: any = {}) => {
        try {
            if (!isAuthenticated) {
                login();
                return;
            }
            setMarketplaceStates({
                ...defaultStates,
                active: "acceptOffering",
                acceptOffering: {
                    acceptOffer: {
                        ...defaultStateOptions,
                        isComplete: true
                    },
                    onOwnServer: {
                        ...defaultStateOptions,
                        isLoader: true
                    }
                }
            })
            const userSign = await loginUserSigner();
            if (!userSign.status) {
                throw new Error(JSON.stringify({ slug: "onOwnServer|acceptOffering", message: userSign.message }));
            }
            offerId = offerId ? offerId : acceptingOfferId;
            _offerer = _offerer.trim() ? _offerer.trim() : offererAddress;
            tx = Object.keys(tx).length ? tx : transaction;
            const result = await acceptNftOffer(id, {
                transaction: tx,
                offerId: offerId,
                offerer: _offerer,
                userSign: userSign.sign
            });
            if (result.status === "success") {
                setMarketplaceStates({
                    ...defaultStates,
                    active: "acceptOffering",
                    acceptOffering: {
                        acceptOffer: {
                            ...defaultStateOptions,
                            isComplete: true
                        },
                        onOwnServer: {
                            ...defaultStateOptions,
                            isComplete: true
                        }
                    }
                })
            } else {
                const message = result.message || "something went wrong"
                throw new Error(JSON.stringify({ slug: "onOwnServer|acceptOffering", message }));
            }
        } catch (error: any) {
            const message = error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "onOwnServer|acceptOffering",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }

    }

    const handleTransferNft = async (event: any) => {
        event.preventDefault();
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }
            setOpen(true);
            await transferToAuctionWinner();
        } catch (error: any) {
            var parseJson: any = IsJsonString(error.message);
            if (!parseJson) {
                parseJson = {
                    slug: "transfer",
                    message: error.message
                }
            }
            setError(parseJson.slug, parseJson.message);
        }
    }

    const transferToAuctionWinner = async () => {
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }
            setMarketplaceStates({
                ...defaultStates,
                active: "transfering",
                transfering: {
                    transfer: {
                        ...defaultStateOptions,
                        isLoader: true
                    },
                    onOwnServer: defaultStateOptions
                }
            })

            const nftMarketPlaceContract: any = await getNftMarketContract();
            const marketPlaceTransaction = await nftMarketPlaceContract.transferItemAuction(
                parseInt(itemId)
            );
            const tx = await marketPlaceTransaction.wait();
            if (tx) {
                setTransaction(tx)
                await tranferNftApi(tx);
            } else {
                const message = "Something went wrong during accepting offer!"
                throw new Error(JSON.stringify({ slug: "transfer", message }));
            }
        } catch (error: any) {
            const err = formatSolidityError(error.message);
            const message = err ? capitalize(err.message) : error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "transfer",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }
    }

    const tranferNftApi = async (tx: any = {}) => {
        tx = Object.keys(tx).length ? tx : transaction;
        try {
            if (!isAuthenticated) {
                login();
                return;
            }
            setMarketplaceStates({
                ...defaultStates,
                active: "transfering",
                transfering: {
                    transfer: {
                        ...defaultStateOptions,
                        isComplete: true
                    },
                    onOwnServer: {
                        ...defaultStateOptions,
                        isLoader: true
                    }
                }
            })
            const userSign = await loginUserSigner();
            if (!userSign.status) {
                throw new Error(JSON.stringify({ slug: "onOwnServer|transfering", message: userSign.message }));
            }
            const result = await transferNftItem(id, {
                transaction: tx,
                userSign: userSign.sign
            });
            if (result.status === "success") {
                setMarketplaceStates({
                    ...defaultStates,
                    active: "transfering",
                    transfering: {
                        transfer: {
                            ...defaultStateOptions,
                            isComplete: true
                        },
                        onOwnServer: {
                            ...defaultStateOptions,
                            isComplete: true
                        }
                    }
                })
            } else {
                const message = result.message || "something went wrong"
                throw new Error(JSON.stringify({ slug: "onOwnServer|transfering", message }));
            }
        } catch (error: any) {
            const message = error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "onOwnServer|transfering",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }

    }

    const tryAgainModal = async () => {
        try {
            Object.keys(modal).forEach(async (element) => {
                try {
                    const modalAsset = modal[element];
                    if (modalAsset.isError) {
                        if (eval(`typeof ${modalAsset.callback}`) === "function") {
                            await eval(`${modalAsset.callback}()`);
                        }
                    }
                } catch (error: any) {
                    var parseJson: any = IsJsonString(error.message);
                    if (!parseJson) {
                        parseJson = {
                            slug: activeModal?.slice(0, -3) || "",
                            message: error.message
                        }
                    }
                    setError(parseJson.slug, parseJson.message);
                }
            });
        } catch (error: any) {
            var parseJson: any = IsJsonString(error.message);
            if (!parseJson) {
                parseJson = {
                    slug: activeModal?.slice(0, -3) || "",
                    message: error.message
                }
            }
            setError(parseJson.slug, parseJson.message);
        }
    }

    const refreshPage = () => {
        setOpen(false);
        setUpdated(!updated);
        // router.push(window.location.pathname)
    }

    return (
        <>
            <div>
                {
                    onMarketPlace ? (
                        <>
                            {(() => {
                                switch (marketplace.action) {
                                    case 'fixed_price':
                                        return <div className="fixed-price-owner-section dark:text-white py-3">
                                            <div className="w-full dark:text-white">Current Price</div>
                                            <div className="grid grid-cols-2 gap-2" >
                                                <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                                                    <p className="grid grid-cols-12 gap-2">
                                                        <span className="col-span-10 text-xl ml-2">
                                                            {parseFloat(parseFloat(nft.price.eth).toFixed(4))} {SITE_TOKEN}
                                                            <span className="text-xs ml-2">( ${parseFloat(nft.price.dollar).toFixed(2)} )</span>
                                                        </span>
                                                        <span className="text-xs"></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    case 'open_for_bids':
                                        return <div className="open-for-bids-owner-section dark:text-white py-3">
                                            <h3>Item Offer Listing</h3>
                                            <div className="mt-4 -mb-3">
                                                <div className="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25">
                                                    <div style={{
                                                        backgroundPosition: "10px 10px"
                                                    }} className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                                                    <div className="relative rounded-xl overflow-auto">
                                                        <table className="border-collapse table-fixed w-full text-sm">
                                                            <thead>
                                                                <tr>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Price</th>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">USD Price</th>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Expiration</th>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">From</th>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white dark:bg-slate-800">
                                                                {
                                                                    currentOffers.length ? (
                                                                        currentOffers.map((offer: any, key: number) => {
                                                                            const isYou = offer.offerer === user?.id;
                                                                            const offerer = isYou ? "you" : `@${subString(offer.offerer?.username)}`;
                                                                            const _offerer = offer.offerer?.address || "";
                                                                            // const url = `/creators/${offer.offerer.id}`
                                                                            return (
                                                                                <tr key={key}>
                                                                                    <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400">{offer.offerPrice.eth} {SITE_TOKEN}</td>
                                                                                    <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400">${offer.offerPrice.dollar}</td>
                                                                                    <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400">{offer.expiration}</td>
                                                                                    <td className="border-b border-slate-200 dark:border-slate-600 py-4 px-2 text-slate-500 dark:text-slate-400">{offerer}</td>
                                                                                    <td className="border-b border-slate-200 dark:border-slate-600 py-4 px-2 text-slate-500 dark:text-slate-400">
                                                                                        {
                                                                                            isAuthenticated && user?.id === ownedBy.id ? (
                                                                                                <Button size="small" variant="outlined" onClick={(e) => handleOffer(e, offer.id, _offerer)}>Accept</Button>
                                                                                            ) : ""
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan={5} className="text-center text-base py-2">No Data Found</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
                                                </div>
                                            </div>
                                        </div>
                                    case 'timed_auction':
                                        return <div className="timed-auction-section timed-auction-owner-section dark:text-white py-3">
                                            <div className="">
                                                <div className="nftdetail_countdown ">
                                                    <DVCountDown
                                                        date={currentAuction.endDate}
                                                    />
                                                </div>
                                                <div className=" my-5 nftdetail_bids  singlepage_owner_list flex" style={{ border: 'none' }}>
                                                    <div className="nftdetail_bids_col">
                                                        <div className="ml-2 items-center">
                                                            <h6 className=" dark:text-[#fff] capitalize">Higher Bid:</h6>
                                                            <h5 className=" nftdetail_price_row_price  dark:text-[#fff] text-[#707a83] text-xs flex">
                                                                {currentAuction?.maxBidPrice?.eth || "0"} {SITE_TOKEN}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div className="nftdetail_bids_col">
                                                        <div className="ml-2 items-center">
                                                            <h6 className=" dark:text-[#fff] capitalize">Min Bid:</h6>
                                                            <h5 className=" nftdetail_price_row_price  dark:text-[#fff] text-[#707a83] text-xs flex">
                                                                {currentAuction?.initialBidPrice?.eth || "0"} {SITE_TOKEN}
                                                            </h5>
                                                        </div>
                                                    </div>
                                                    <div className="nftdetail_bids_col">
                                                        <div className="ml-2 items-center">
                                                            <h6 className=" dark:text-[#fff] capitalize">Winner:</h6>
                                                            <h5 className=" nftdetail_price_row_price  dark:text-[#fff] text-[#707a83] text-xs flex">
                                                                {
                                                                    currentAuction.winner?.id ? (
                                                                        <Link href={`creator/${currentAuction.winner.id}`} className="mr-1"><a>{currentAuction.winner.username || ""}</a></Link>
                                                                    ) : (
                                                                        <span>No Bid Yet</span>
                                                                    )
                                                                }
                                                            </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    moment().isAfter(currentAuction.endDate) ? (
                                                        <div className="nftdetail_bidby  flex items-center justify-between">
                                                            <div className="myprofile_onsale_column_box_content_purchase_btn flex justify-left ">
                                                                <button
                                                                    className="hover:bg-[#571a81] dark:text-[#fff] text-[#000] hover:text-[#fff] text-sm font-normal py-2 px-6 rounded-full border-2 dark:border-[#fff] border:[#000] hover:border-[#571a81] bg-transparent"
                                                                    onClick={handleTransferNft}
                                                                >
                                                                    Transfer Nft To Winner
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : ""
                                                }
                                                <div className="not-prose relative bg-slate-50 rounded-xl overflow-hidden dark:bg-slate-800/25 my-3">
                                                    <div style={{
                                                        backgroundPosition: "10px 10px"
                                                    }} className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                                                    <div className="relative rounded-xl overflow-auto">
                                                        <table className="border-collapse table-fixed w-full text-sm">
                                                            <thead>
                                                                <tr>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Initial Price</th>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Min Price</th>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Max Price</th>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">From</th>
                                                                    <th className="border-b dark:border-slate-600 font-medium py-4 px-2 text-slate-400 dark:text-slate-200 text-left">Created At</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white dark:bg-slate-800">
                                                                {
                                                                    currentAuction?.auctionHistories?.length ? (
                                                                        currentAuction.auctionHistories.map((auctionHistory: any, key: number) => {
                                                                            const isYou = auctionHistory.createdBy.id === user?.id;
                                                                            const createdBy = isYou ? "you" : `@${subString(auctionHistory.createdBy?.username)}`;
                                                                            const url = `/creators/${auctionHistory.createdBy.id}`
                                                                            return (
                                                                                <tr key={key}>
                                                                                    <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400">
                                                                                        <div>
                                                                                            <span>{auctionHistory.initialBidPrice.eth}</span><br />
                                                                                            {/* <span className="pt-2">${auctionHistory.initialBidPrice.dollar}</span> */}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400">
                                                                                        <div>
                                                                                            <span>{auctionHistory.minBidPrice.eth}</span><br />
                                                                                            {/* <span>${auctionHistory.minBidPrice.dollar}</span> */}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="border-b border-slate-100 dark:border-slate-700 py-4 px-2 text-slate-500 dark:text-slate-400">
                                                                                        <div>
                                                                                            <span>{auctionHistory.maxBidPrice.eth}</span><br />
                                                                                            {/* <span>${auctionHistory.maxBidPrice.dollar}</span> */}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="border-b border-slate-200 dark:border-slate-600 py-4 px-2 text-slate-500 dark:text-slate-400">
                                                                                        <Link href={url}><a className="text-[#571a81]">{createdBy}</a></Link>
                                                                                    </td>
                                                                                    <td className="border-b border-slate-200 dark:border-slate-600 py-4 px-2 text-slate-500 dark:text-slate-400">{moment(auctionHistory.createdAt).fromNow()}</td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    ) : (
                                                                        <tr>
                                                                            <td colSpan={5} className="text-center text-base py-2">No Data Found</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl dark:border-white/5"></div>
                                                </div>
                                            </div>
                                        </div>
                                    default:
                                        return <div>
                                            No OnSale Action Found
                                        </div>
                                }
                            })()}
                        </>
                    )
                        : (
                            <div className="fixed-price-owner-section dark:text-white py-3">
                                {
                                    nft.price.eth > 0 ? (
                                        <>
                                            <div className="w-full dark:text-white">Current Price</div>
                                            <div className="grid grid-cols-2 gap-2" >
                                                <div className="view-proof-authenticity-section dark:text-[#fff] text-[#000] text-xs font-bold flex">
                                                    <p className="grid grid-cols-12 gap-2">
                                                        <span className="col-span-10">{parseFloat(nft.price.eth).toFixed(4)} {SITE_TOKEN}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    ) : ""
                                }
                            </div>
                        )
                }
            </div>
            <CustomModal
                aria-labelledby="collection-dialog"
                open={activeModal ? open : false}
                onClose={(_: any, reason: any) => {
                    if (reason !== "backdropClick") {
                        setOpen(false);
                    }
                }}
            >
                <ModalHeader onClose={() => setOpen(false)}>
                    <span className="font-bold">Follow steps</span>
                </ModalHeader>
                <ModalContent>
                    {
                        Object.keys(modal).length ?
                            (
                                <>
                                    {
                                        Object.keys(modal).map((value: string, key: number) => {
                                            return (
                                                <div key={key} className={`${key > 0 ? 'mt-3' : ""}`}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={2} md={2}>
                                                            {
                                                                modal[value]?.isLoader
                                                                    ? <CircularProgress size={30} color="secondary" />
                                                                    : modal[value]?.isError ? <MdOutlineCancel color="red" size={30} />
                                                                        : <MdCheckCircleOutline color={modal[value]?.isComplete ? "green" : "secondary"} size={30} />
                                                            }
                                                        </Grid>
                                                        <Grid item xs>
                                                            <h1 className="font-bold text-[#000] dark:text-[#fff]">{toCaptalize(defaultStates.others[value].title)}</h1>
                                                            <Typography>{defaultStates.others[value].description}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                    {
                                                        modal[value]?.isError
                                                        && <Grid item>
                                                            <p style={{ color: "red", marginLeft: '17%' }}>{modal[value]?.errorMessage}</p>
                                                        </Grid>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </>
                            ) : ""
                    }
                </ModalContent>
                {
                    isTryAgain || !isNotCompleted ? (
                        <ModalFooter className="steps_popup_button">
                            {
                                !isNotCompleted
                                    ? <Button autoFocus variant="outlined" onClick={refreshPage}>Refresh Page</Button>
                                    : (
                                        isTryAgain
                                            ? <Button autoFocus variant="outlined" onClick={tryAgainModal}>Try again</Button>
                                            : ""
                                    )
                            }
                        </ModalFooter>
                    ) : ""
                }
            </CustomModal>
        </>
    )
}

const Marketplace: FC<MarketplaceProps> = ({ nft, useUpdate }) => {
    const [updated, setUpdated] = useUpdate;
    const { ownedBy, createdBy } = nft;
    const [open, setOpen] = useState<Boolean>(false);
    const [marketplaceStates, setMarketplaceStates]: [any, Function] = useState<MarketplaceStates>(defaultMarketplaceStates);
    const { user, isAuthenticated }: MetamaskContextResponse = Metamask.useContext();
    const ownerId = ownedBy?.id || createdBy.id;

    const IsNftItemOwner = isAuthenticated && ownerId === user.id;
    const defaultStates: any = defaultMarketplaceStates;

    const setFollowStepError = (slug: string, message: string) => {
        var [newSlug, parentSlug] = slug?.trim()?.split('|');
        newSlug = newSlug?.trim() || "";
        parentSlug = parentSlug?.trim() ? parentSlug.trim() : `${newSlug}ing`;
        var newModalValue: any = defaultStates?.[parentSlug] || {};

        if (!newModalValue || !Object.keys(newModalValue).length) return;
        const newModal = followStepError(newSlug, message, newModalValue);

        setMarketplaceStates({
            ...defaultStates,
            [parentSlug]: newModal,
            active: parentSlug
        });
    }

    return (
        <>
            <div>
                {IsNftItemOwner
                    ? <OwnerMarketPlaceComponent
                        nft={nft}
                        useStates={[marketplaceStates, setMarketplaceStates]}
                        useModalOpen={[open, setOpen]}
                        setError={setFollowStepError}
                        useUpdate={[updated, setUpdated]}
                    />
                    : <BuyerMarketPlaceComponent
                        nft={nft}
                        useStates={[marketplaceStates, setMarketplaceStates]}
                        useModalOpen={[open, setOpen]}
                        setError={setFollowStepError}
                        useUpdate={[updated, setUpdated]}
                    />}
            </div>
        </>
    )
}

export default Marketplace;