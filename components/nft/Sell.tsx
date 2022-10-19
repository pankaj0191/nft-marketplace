import { Alert, Button, capitalize, CircularProgress, Collapse, FormControl, Grid, IconButton, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { FC, useEffect, useState } from "react";
import Image from 'next/image';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FaEthereum, FaInfinity } from "react-icons/fa";
import { IoMdPricetag, IoIosTimer } from "react-icons/io"
import { convertEthToDollar, listNftItem } from "services";
import { formatSolidityError, getNftMarketContract, subString } from "helpers";
import { CustomModal, ModalContent, ModalFooter, ModalHeader } from "components/miscellaneous/modal";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import Link from "next/link";
import moment from "moment";
import { Metamask, MetamaskContextResponse } from "context";
import { ethers } from "ethers";
import { DVCountDown } from "components/miscellaneous";
import { followStepError } from "helpers/web3";

interface SellProps {
    nft: any;
}

const defaultFormData = {
    type: "fixed_price",
    data: {
        price: ""
    },
    transaction: {}
}
const defaultOtherData = {
    serviceFee: {
        eth: 0,
        percentage: 1
    },
    price: {
        eth: 0,
        dollar: 0
    },
    total: {
        dollar: 0,
        eth: 0
    }
}

const defaultModalValue = {
    listing: {
        isLoader: false,
        isComplete: false,
        isError: false,
        errorMessage: ""
    },
    onOwnServer: {
        isLoader: false,
        isComplete: false,
        isError: false,
        errorMessage: ""
    }
}

const Sell: FC<SellProps> = ({ nft }) => {
    const [open, setOpen] = useState<Boolean>(false);
    const [formData, setFormData] = useState<any>(defaultFormData);
    const [otherData, setOtherData] = useState<any>(defaultOtherData);
    const [redirectNftItemUrl, setRedirectNftItemUrl] = useState<string>("");
    const [modal, setModal] = useState(defaultModalValue);
    const [isActive, setActive] = useState(false);
    const [isError, setIsError] = useState({
        status: false,
        message: ""
    });
    const { user, isAuthenticated, loginUserSigner }: MetamaskContextResponse = Metamask.useContext();
    const [isLoading, setIsLoading] = useState(false);
    const [serviceFeePer, setServiceFeePer] = useState<number>(0);

    useEffect(() => {
        (async () => {
            const contract: any = await getNftMarketContract();
            let marketServiceFee = await contract.getmarketplaceServiceFee();
            marketServiceFee = marketServiceFee.toNumber() || 0;
            setServiceFeePer(marketServiceFee);
        })();
    })

    const handleSaleType = (type: string) => {
        setFormData({
            type,
            data: type === "timed_auction" ? {
                minBid: "",
                startDate: new Date(moment().format("YYYY-MM-DD hh:mm:ss")),
                endDate: new Date(moment().add(1, 'day').format("YYYY-MM-DD 23:59:00"))
            } : type === "fixed_price" ? {
                price: ""
            } : {}
        });
        setFixedPriceValues("0")
        setTimedAuctionValue("0")
    }

    const handleChange = async (e: any) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            data: {
                ...formData.data,
                [name]: value
            }
        });
        if (name === "price") {
            await setFixedPriceValues(value.toString());
        }
        if (name === "minBid") {
            await setTimedAuctionValue(value.toString());
        }
    }

    const setFixedPriceValues = async (price: string) => {
        const newOtherData = otherData;
        const intPrice = (Number.isNaN(parseFloat(price)) ? 0 : parseFloat(price));
        var ethVal = 0;
        if (intPrice > 0) {
            ethVal = (intPrice * serviceFeePer) / 100;
            ethVal = Number.isNaN(ethVal) ? 0 : ethVal;
        }
        newOtherData.serviceFee.eth = ethVal;
        setOtherData({
            ...newOtherData,
            total: {
                dollar: await convertEthToDollar((intPrice - ethVal).toString()),
                eth: intPrice - ethVal
            },
            price: {
                eth: intPrice,
                dollar: await convertEthToDollar(intPrice.toString())
            }
        });
    }

    const setTimedAuctionValue = async (price: string) => {
        setOtherData({
            ...defaultOtherData,
            price: {
                eth: (Number.isNaN(parseFloat(price)) ? 0 : parseFloat(price)),
                dollar: await convertEthToDollar(price)
            }
        });
    }

    const setFollowStepError = (slug: string, message: string) => {
        const newModal = followStepError(slug, message, defaultModalValue);
        setModal({ ...newModal });
    }

    const tryAgainModal = async () => {
        try {
            let newModal: any = modal;
            ["listing", "onOwnServer"].forEach(async (element) => {
                try {
                    const modalAsset = newModal[element];
                    if (modalAsset.isError) {
                        if (element === "listing") {
                            await handleSubmit();
                        } else if (element === "onOwnServer") {
                            await updateListingNftItem();
                        }
                    }
                } catch (error: any) {
                    var parseJson: any = IsJsonString(error.message);
                    if (!parseJson) {
                        parseJson = {
                            slug: "listing",
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
                    slug: "onOwnServer",
                    message: error.message
                }
            }
            setFollowStepError(parseJson.slug, parseJson.message);
        }
    }

    function IsJsonString(str: string) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return false;
        }
    }

    const validateForm = () => {
        let newFormData = formData;
        if (newFormData.type === "fixed_price" && !newFormData.data?.price) {
            setIsError({
                status: true,
                message: "Price must be required!"
            })
            return;
        } else if (newFormData.type === "timed_auction") {
            var message = "";
            const startDate = moment(newFormData.data.startDate).format("YYYY-MM-DD hh:mm:ss");
            const endDate = moment(newFormData.data.endDate).format("YYYY-MM-DD 23:59:00");
            if (parseFloat(newFormData.data?.minBid || "0") <= 0) {
                message = "Minimum bid must be required!"
            } else if (!startDate) {
                message = "Start date must be required!"
            } else if (!endDate) {
                message = "End date must be required!"
            } else if (!moment(endDate).isAfter(startDate)) {
                message = "End date must be greater than start date!"
            }
            if (message) {
                setIsError({
                    status: true,
                    message: message
                })
                return false;
            }
            newFormData.data.startDate = new Date(startDate);
            newFormData.data.endDate = new Date(endDate);
            setFormData({
                ...newFormData
            })
        }
        return true;

    }

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            if (!isAuthenticated) {
                setIsError({
                    status: true,
                    message: "Wallet not connected!"
                })
                return false;
            }
            const isValidated = validateForm();
            if (!isValidated) return;
            setOpen(true);
            setModal({
                ...{
                    listing: {
                        isLoader: true,
                        isComplete: false,
                        isError: false,
                        errorMessage: ""
                    },
                    onOwnServer: {
                        isLoader: false,
                        isComplete: false,
                        isError: false,
                        errorMessage: ""
                    }
                }
            })

            const actionType = formData.type;
            var price = "0";
            var startTime: any = moment();
            var endTime: any = moment();
            if (actionType === "fixed_price") {
                price = formData.data?.price || "0";
            } else if (actionType === "timed_auction") {
                price = formData.data.minBid;
                startTime = moment(formData.data.startDate);
                endTime = moment(formData.data.endDate);
            }

            const listItemPrice = ethers.utils.parseUnits((price).toString(), "ether");

            const nftMarketPlaceContract: any = await getNftMarketContract();
            const listTransaction = await nftMarketPlaceContract.listItem(
                parseInt(nft.itemId),
                listItemPrice,
                formData.type,
                startTime.utc().unix(),
                endTime.utc().unix()
            );
            const listItemTx = await listTransaction.wait();
            if (listItemTx) {
                setFormData({
                    ...formData,
                    transaction: listItemTx
                })
                await updateListingNftItem();
            } else {
                throw new Error(JSON.stringify({ slug: "listing", message: "Something went wrong during listing!" }));
            }
        } catch (error: any) {
            const err = formatSolidityError(error.message);
            const message = err ? capitalize(err.message) : error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "listing",
                    message: message
                }
            }
            setFollowStepError(parseJson.slug, parseJson.message);
        }
    }

    const updateListingNftItem = async () => {
        try {
            setModal({
                ...{
                    listing: {
                        isLoader: false,
                        isComplete: true,
                        isError: false,
                        errorMessage: ""
                    },
                    onOwnServer: {
                        isLoader: true,
                        isComplete: false,
                        isError: false,
                        errorMessage: ""
                    }
                }
            })
            const userSign = await loginUserSigner();
            if (!userSign.status) {
                throw new Error(JSON.stringify({ slug: "onOwnServer", message: userSign.message }));
            }
            const result = await listNftItem(nft.id, {
                transactions: formData.transaction,
                marketplace: {
                    onMarketplace: true,
                    data: {
                        type: formData.type,
                        ...formData.data
                    }
                },
                userSign: userSign.sign,
                token: nft.collection.symbol
            })

            if (result.status === "success") {
                setRedirectNftItemUrl(`/discover/${nft.id}`);
                setModal({
                    ...{
                        listing: {
                            isLoader: false,
                            isComplete: true,
                            isError: false,
                            errorMessage: ""
                        },
                        onOwnServer: {
                            isLoader: false,
                            isComplete: true,
                            isError: false,
                            errorMessage: ""
                        }
                    }
                })
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

    return (
        <section className="createpage_section my-5">
            <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={2}>
                    <Grid item md={5}>
                        <h2 className="salehead">List item for sale</h2>
                        <Collapse in={isError.message ? true : false}>
                            <Alert
                                {
                                ...{
                                    severity: isError.status ? "error" : "success"
                                }
                                }
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setIsError({
                                                ...isError,
                                                message: ""
                                            });
                                        }}
                                    >
                                        <AiOutlineClose />
                                    </IconButton>
                                }
                                sx={{ mb: 2 }}
                            >
                                {isError.message}
                            </Alert>
                        </Collapse>
                        <label className="block dark:text-[#fff] text-[#363434] text-md mb-2"><b>Type</b></label>
                        <div className="grid grid-cols-3 p-0 property-items type__wrap_box mb-5">
                            <div className={`item-property cursor-pointer  ${formData.type === "fixed_price" ? "active-sale-type" : ""} rounded px-3 py-5 `} onClick={() => handleSaleType("fixed_price")}>
                                <div className="property-trait_type text-center capitalize text-sm text-[#571a81]"><IoMdPricetag /></div>
                                <div className="property-value text-center capitalize text-lg">Fixed Price</div>
                            </div>
                            <div className={`item-property cursor-pointer ${formData.type === "open_for_bids" ? "active-sale-type" : ""} rounded px-3 py-5 `} onClick={() => handleSaleType("open_for_bids")}>
                                <div className="property-trait_type text-center capitalize text-sm text-[#571a81]"><FaInfinity /></div>
                                <div className="property-value text-center capitalize text-lg">Open for Offers</div>
                            </div>
                            <div className={`item-property cursor-pointer  ${formData.type === "timed_auction" ? "active-sale-type" : ""} rounded px-3 py-5 `} onClick={() => handleSaleType("timed_auction")}>
                                <div className="property-trait_type text-center capitalize text-sm text-[#571a81]"><IoIosTimer /></div>
                                <div className="property-value text-center capitalize text-lg">Timed auction</div>
                            </div>
                        </div>
                        <div className="content-section">
                            {
                                formData.type === "fixed_price" ? (
                                    <div className="fixed-price-content">
                                        <p className="pb-2">You can put the item on sale with fixed price and buyer can purchase this item directly.</p>
                                        <div className="grid grid-cols-1 mb-5">
                                            <FormControl
                                                className="mb-6 md:mb-0"
                                            >
                                                <label
                                                    className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                    htmlFor="price"
                                                ><b>Price</b></label>
                                                <input
                                                    className="shadow mb-2 appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-[#969696] text-sm"
                                                    onChange={handleChange}
                                                    name="price"
                                                    id="price"
                                                    min={0}
                                                    value={formData.data.price || ""}
                                                    type="number"
                                                    placeholder="Enter price for one piece"
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="service_receive_wrap">
                                            <ListItem className="service__border px-0">
                                                <ListItemText id="switch-list-label-wifi" primary="Service Fee" />

                                                <div className="service_size">
                                                    {
                                                        otherData.serviceFee.eth > 0 ? (
                                                            <span className="text-slate-400">{parseFloat(otherData.serviceFee.eth.toFixed(4))} ETH </span>
                                                        ) : ""
                                                    }
                                                    <span> {parseFloat(serviceFeePer.toFixed(1))}%</span>

                                                </div>
                                            </ListItem>
                                            <ListItem className="px-0">
                                                <ListItemText id="switch-list-label-wifi" primary="You will receive" />

                                                <div className="service_size">
                                                    {
                                                        otherData.total.dollar > 0 ? (
                                                            <span className="text-slate-400">${parseFloat(otherData.total.dollar.toFixed(2))} </span>
                                                        ) : ""
                                                    }
                                                    <span> {parseFloat(otherData.total.eth.toFixed(4))} ETH</span>

                                                </div>
                                            </ListItem>
                                        </div>
                                    </div>
                                ) : formData.type === "timed_auction" ? (
                                    <div className="timed-auction-content">
                                        <p className="pb-2">You can put the item on sale with minimum bid on auction.</p>
                                        <div className="grid grid-cols-1 mb-5">
                                            <FormControl
                                                className="mb-6 md:mb-0"
                                            >
                                                <label
                                                    className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                    htmlFor="minBid"
                                                ><b>Minimum Bid Price (ETH)</b></label>
                                                <input
                                                    className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-[#969696] text-sm"
                                                    onChange={handleChange}
                                                    name="minBid"
                                                    id="minBid"
                                                    min={0}
                                                    value={formData.data.minBid || ""}
                                                    type="number"
                                                    placeholder="Enter minimum bid"
                                                />
                                            </FormControl>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mb-5 date__main-wrap">
                                            <FormControl
                                                className="icon_back start-date-field"
                                            >
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        label="Starting Date"
                                                        value={new Date(formData.data.startDate)}
                                                        minDate={new Date()}
                                                        className="custom-datepicker"
                                                        onChange={(value) => {
                                                            const newValue: any = value ? value : "";
                                                            const endDate = new Date(moment(newValue).add(1, 'day').format('YYYY-MM-DD 23:59:00'));
                                                            setFormData({
                                                                ...formData,
                                                                data: {
                                                                    minBid: formData.data.minBid,
                                                                    startDate: newValue,
                                                                    endDate,
                                                                }
                                                            });
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                            <FormControl
                                                className="icon_back start-date-field"
                                            >
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        label="Expiration Date"
                                                        value={new Date(formData.data.endDate)}
                                                        className="custom-datepicker"
                                                        minDate={new Date(formData.data.startDate)}
                                                        onChange={(newValue) => {
                                                            setFormData({
                                                                ...formData,
                                                                data: {
                                                                    minBid: formData.data.minBid,
                                                                    startDate: formData.data.startDate,
                                                                    endDate: newValue,
                                                                }
                                                            });
                                                        }}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </FormControl>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p>
                                            When you put the item on sale with this type then buyer can offer the amount for this item to you.
                                            And then you can accept any one offer on your choice.
                                        </p>
                                    </>
                                )
                            }
                        </div>
                    </Grid>
                    <Grid item md={3}>
                        <h1><b>Preview</b></h1>
                        <div className="myprofile_onsale_column_box m-1 p-2  border-2 dark:border-[#16151a] rounded-lg dark:bg-[#16151a] bg-[#fff] cursor-pointer">

                            <div className="explore_section_column_box_image right_image-box">
                                {
                                    nft.asset.type === "image" ? (
                                        <Image
                                            src={nft.asset.file}
                                            alt="Picture of the item"
                                            className="rounded mt-4"
                                            width={600}
                                            height={600}
                                        />
                                    ) : (
                                        <video
                                            style={{ width: '350px', height: '180px' }}
                                            controls
                                            controlsList="nodownload"
                                            preload="auto"
                                            className="form-label inline-block mb-2 text-gray-700"
                                        >
                                            <source src={nft.asset.file} />
                                        </video>
                                    )
                                }
                            </div>
                            <div className="myprofile_onsale_column_box_content sell-nft-card text-center py-3 px-3">
                                <div className="myprofile_onsale_column_box_creator flex items-center justify-between border-t-1 border-[#707a83] pt-4">
                                    <div className="myprofile_onsale_column_box_creator_price text-left">
                                        <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs font-normal uppercase" title={nft.collection.name}>{subString(nft.collection.name, 20)}</h6>
                                        <div className="dark:text-[#fff] text-[#000] font-semibold text-xs flex sell-card-tag"  >{formData.type.replace('_', " ").replace('_', " ").toUpperCase()} </div>
                                    </div>
                                    {
                                        formData.type === "open_for_bids" ? (
                                            <div className="myprofile_onsale_column_box_creator_price text-left">
                                                <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs font-normal uppercase">Highest Bid</h6>
                                                <div className="dark:text-[#fff] text-[#000] font-semibold text-xs flex text-center sell-card-tag" >No Bids</div>
                                            </div>
                                        ) : (
                                            <div className="myprofile_onsale_column_box_creator_price text-left">
                                                <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs font-normal uppercase">{formData.type === "fixed_price" ? "Current Price" : "Highest Bid"}</h6>
                                                <div className="dark:text-[#fff] text-[#000] font-semibold text-xs flex sell-card-tag" ><FaEthereum style={{ marginTop: "2px", marginRight: "2px" }} /> {parseFloat(parseFloat(otherData.price.eth).toFixed(4))} <small className="ml-2" style={{ color: "#c38ce9" }}>${parseFloat(parseFloat(otherData.price.dollar).toFixed(2))}</small></div>
                                            </div>
                                        )
                                    }
                                </div>
                                {
                                    formData.type === "timed_auction" ? (
                                        <DVCountDown
                                            date={formData.data.endDate}
                                        />
                                    ) : ""
                                }
                            </div>
                        </div>
                    </Grid>
                    <Grid item md={8} className="mb-3 complete_listing">
                        <Button variant="contained" color="primary" size="large" onClick={handleSubmit}>Complete Listing</Button>
                    </Grid>
                </Grid>
            </Grid>
            <CustomModal
                aria-labelledby="collection-dialog"
                open={open} className={isActive ? "dark_createform_popup" : "createform_popup"}
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
                    <Grid container spacing={2}>
                        <Grid item xs={2} md={2}>
                            {
                                modal.listing.isLoader
                                    ? <CircularProgress size={30} color="secondary" />
                                    : (modal.listing.isComplete ? <AiOutlineCheck color='green' size={30} /> : modal.listing.isError ? <AiOutlineClose color="red" size={30} /> : <AiOutlineCheck color='secondary' size={30} />)
                            }
                        </Grid>
                        <Grid item xs={10} md={10}>
                            <h1 className="font-bold text-[#000] dark:text-[#fff]">Put on sale </h1>
                            <p>Listing your NFT item on ethereum chain</p>
                        </Grid>
                        {modal.listing.isError
                            && <Grid item>
                                <p style={{ color: "red", marginLeft: '17%' }}>{modal.listing.errorMessage}</p>
                            </Grid>}
                    </Grid>
                    <Grid className="pt-5" container spacing={2}>
                        <Grid item xs={2} md={2}>
                            {
                                modal.onOwnServer.isLoader
                                    ? <CircularProgress size={30} color="secondary" />
                                    : (modal.onOwnServer.isComplete ? <AiOutlineCheck color='green' size={30} /> : modal.onOwnServer.isError ? <AiOutlineClose color="red" size={30} /> : <AiOutlineCheck color='secondary' size={30} />)
                            }
                        </Grid>
                        <Grid item xs={10} md={10}>
                            <h1 className="font-bold text-[#000] dark:text-[#fff]">Sign message</h1>
                            <p>Sign message with new nft item preferences</p>
                        </Grid>
                        {modal.onOwnServer.isError
                            && <Grid item>
                                <p style={{ color: "red", marginLeft: '17%' }}>{modal.onOwnServer.errorMessage}</p>
                            </Grid>}
                    </Grid>
                </ModalContent>
                {
                    modal.onOwnServer.isComplete || modal.listing.isError || modal.onOwnServer.isError ? (
                        <ModalFooter className="steps_popup_button">
                            {
                                modal.onOwnServer.isComplete
                                    ? <Link href={redirectNftItemUrl} passHref>
                                        <Button autoFocus variant="outlined">VIEW NFT ITEM</Button>
                                    </Link>
                                    : (
                                        modal.listing.isError || modal.onOwnServer.isError
                                            ? <Button autoFocus variant="outlined" onClick={tryAgainModal}>Try again</Button>
                                            : ""
                                    )
                            }
                        </ModalFooter>
                    ) : ""
                }
            </CustomModal>
        </section>
    )
}

export default Sell;