import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BsInstagram, BsTwitter, BsFacebook, BsDiscord, BsGlobe } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md';
import SocialIcons from '../../data/social-icons.json';
import { getWeb3Provider, toCaptalize } from '../../helpers';
import { validateCollectionForm } from '../../schemas/form';
import { Categories, Genries } from '../miscellaneous';
import { NFT_BYTECODE, NFT_ABI, uploadOnIPFSServer, getContract, NFT_MARKET_PLACE_ADDRESS } from '../../utils';
import { UserWalletAddress } from '../../@types';
import { saveCollection } from '../../services';
import { CustomModal, ModalContent, ModalFooter, ModalHeader } from '../../components/miscellaneous/modal';
import { Alert, Box, Button, CircularProgress, Collapse, Grid, IconButton, Typography } from '@mui/material';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { Metamask } from '../../context';
import Link from 'next/link';
import { followStepError, getIPFSBaseUrl } from 'helpers/web3';


export interface CollectionInputProps {
    name: string;
    description: string;
    symbol: string;
    socialLinks: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        discord?: string;
        website?: string;
    }
    contractAddress: UserWalletAddress;
    transactions: any;
    approvalTransaction: any;
    banner: string;
    image: string;
    feature: string;
    fileType: string;
    category: string,
    genre: string,
    blockchain: string,
    collaborators: string[];
    creatorEarning: string;
    creatorEarningAddress: string;
    explicitSensitiveContent: Boolean;
}

const defaultModalValue = {
    assets: {
        isLoader: false,
        isComplete: false,
        isError: false,
        errorMessage: ""
    },
    contractDeploy: {
        isLoader: false,
        isComplete: false,
        isError: false,
        errorMessage: ""
    },
    completed: {
        isLoader: false,
        isComplete: false,
        isError: false,
        errorMessage: ""
    }
}

function CollectionForm(props: any) {
    const [open, setOpen] = useState<Boolean>(false);
    const [redirectCollectionUrl, setRedirectCollectionUrl] = useState<string>("");
    const [isValidError, setIsValidError] = useState({
        valid: true,
        message: ""
    });
    const imageInputRef = useRef<any>();
    const [asset, setAsset] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modal, setModal] = useState(defaultModalValue);
    const { user, isAuthenticated, loginUserSigner, login }: any = Metamask.useContext();
    const userAddress: string = user.address || "";

    const id = props.id || "";

    const defaultData = {
        name: props.name || "",
        symbol: props.symbol || "",
        genre: props.genre || "",
        category: props.category || "",
        description: props.description || "",
        blockchain: props.blockchain || "rinkeby",
        socialLinks: {
            instagram: props.socialLinks?.instagram || "",
            facebook: props.socialLinks?.facebook || "",
            twitter: props.socialLinks?.twitter || "",
            discord: props.socialLinks?.discord || "",
            website: props.socialLinks?.website || "",
        },
        contractAddress: props.contractAddress || "",
        transactions: props.transactions || {},
        approvalTransaction: props.approvalTransaction || {},
        banner: props.banner || "",
        image: props.image || "",
        fileType: props.fileType || "",
        feature: props.feature || "",
        collaborators: props.collaborators || [],
        creatorEarning: props.creatorEarning || "",
        creatorEarningAddress: props.creatorEarningAddress || "",
        explicitSensitiveContent: props.explicitSensitiveContent || false,
    }

    const [formData, setFormData] = useState<CollectionInputProps>(defaultData);
    const [assets, setAssets] = useState({
        image: "",
        feature: "",
        banner: ""
    });
    const [images, setImages] = useState({
        image: "",
        feature: "",
        banner: ""
    });
    const [isSaving, setSaving] = useState<Boolean>(false);

    const icons: any = {
        twitter: <BsTwitter size={28} />,
        facebook: <BsFacebook size={28} />,
        instagram: <BsInstagram size={28} />,
        discord: <BsDiscord size={28} />,
        website: <BsGlobe size={28} />,
    }

    const socialIcons = SocialIcons.map(socialIcon => {
        return {
            label: socialIcon.name,
            value: socialIcon.slug,
            url: socialIcon.url,
            icon: icons[socialIcon.slug]
        }
    });

    const handleSelectChange = (value: any, others: any) => {
        setFormData({
            ...formData,
            [others.name]: value.value || "",
        });
    }

    const handleChange = (event: any) => {
        let { name, value, checked } = event.target;
        let [newName, childName] = name.split('|');
        newName = typeof newName === "string" && newName ? newName.trim() : newName;
        var newFormData: any = formData;
        setIsValidError({
            valid: true,
            message: ""
        });

        if (newName == "explicitSensitiveContent") {
            value = checked;
        } else if (childName) {
            let social_links = newFormData[newName] || {};
            social_links[childName] = value;
            value = social_links;
        }
        if (newName == "creatorEarning") {
            const earning = parseInt(value || "0");
            if (earning < 0 && earning > 10) {
                setIsValidError({
                    ...isValidError,
                    valid: false,
                    message: "Creator earning should be greater than zero and less than 10"
                });
            }
            value = earning.toString();
            newFormData.creatorEarningAddress = value > 0 ? userAddress : "";
        }
        if (newName == "creatorEarningAddress") {
            if (!ethers.utils.isAddress(value)) {
                setIsValidError({
                    ...isValidError,
                    valid: false,
                    message: "Invalid wallet address"
                });
            }
        }

        if (newName === "symbol") {
            value = value.trim().toLocaleUpperCase();
        }
        newFormData[newName] = value;
        setFormData({ ...formData, ...newFormData });
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const newFormData: any = formData;
            newFormData.creatorEarning = newFormData.creatorEarning > 0 ? newFormData.creatorEarning : "0";
            const result = await validateCollectionForm({
                ...newFormData,
                ...images
            });

            if (result.status) {
                setOpen(true)
                if (id) {
                    await handleUpdate();
                } else {
                    await uploadAssetsOnIPFS();
                }
            } else {
                setIsValidError({
                    valid: false,
                    message: result.errors.shift()
                });
            }
        } catch (error: any) {
            var parseJson: any = IsJsonString(error.message);
            if (!parseJson) {
                parseJson = {
                    slug: "assets",
                    message: error.message
                }
            }
            setFollowStepError(parseJson.slug, parseJson.message);
        }

    }


    const uploadAssetsOnIPFS = async () => {
        try {
            setModal({
                assets: {
                    isLoader: true,
                    isComplete: false,
                    isError: false,
                    errorMessage: ""
                },
                contractDeploy: {
                    isLoader: false,
                    isComplete: false,
                    isError: false,
                    errorMessage: ""
                },
                completed: {
                    isLoader: false,
                    isComplete: false,
                    isError: false,
                    errorMessage: ""
                }
            })
            const newFormData: any = formData;
            // upload assets on IPFS Server
            // newFormData.image = "QmZuMv2aZj9rNHJThUT4BHXkhEZ72HnmZv6DY6TekZVabf";
            // newFormData.feature = "QmVnwwvW6CNP87BSj8ErJKSGPtmzs8xreqHDAujq35S9Rg";
            // newFormData.banner = "QmY1Kxj5GAVTnGP5xM8cdPUr44FDCxNe3bK7ZmjFApX8rT";
            newFormData.image = await uploadOnIPFSServer(assets.image[0]);
            newFormData.feature = await uploadOnIPFSServer(assets.feature[0]);
            newFormData.banner = await uploadOnIPFSServer(assets.banner[0]);
            setImages({
                image: getIPFSBaseUrl(newFormData.image),
                feature: getIPFSBaseUrl(newFormData.feature),
                banner: getIPFSBaseUrl(newFormData.banner)
            })
            setFormData({ ...newFormData });
            await deployContract();
        } catch (error: any) {
            const message = error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "assets",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }
    }

    const deployContract = async () => {
        try {
            setModal({
                assets: {
                    isLoader: false,
                    isComplete: true,
                    isError: false,
                    errorMessage: ""
                },
                contractDeploy: {
                    isLoader: true,
                    isComplete: false,
                    isError: false,
                    errorMessage: ""
                },
                completed: {
                    isLoader: false,
                    isComplete: false,
                    isError: false,
                    errorMessage: ""
                }
            })
            const newFormData = formData;
            const provider = await getWeb3Provider();
            //sign the transaction
            const signer = provider.getSigner();
            // The factory we use for deploying contracts
            const factory = new ethers.ContractFactory(NFT_ABI, NFT_BYTECODE, signer)
            // Deploy an instance of the contract
            const creatorEarning = parseFloat(newFormData.creatorEarning) > 0 ? parseFloat(newFormData.creatorEarning) : 0;
            const royalityRecipent = newFormData.creatorEarningAddress ? newFormData.creatorEarningAddress : userAddress;
            const contract = await factory.deploy(
                toCaptalize(newFormData.name),
                newFormData.symbol.toLocaleUpperCase(),
                creatorEarning,
                royalityRecipent
            );
            const tx = await contract.deployTransaction.wait();
            if (tx) {
                newFormData.contractAddress = contract.address;
                newFormData.transactions = tx;
                setFormData({
                    ...newFormData
                })
                await saveOnOwnServer();
            } else {
                throw new Error(JSON.stringify({
                    slug: "contractDeploy",
                    message: "Something went wrong!"
                }));
            }
        } catch (error: any) {
            const message = error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "contractDeploy",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }
    }

    // const approvalMarketplaceContract = async () => {
    //     try {
    //         if (!isAuthenticated) {
    //             await login();
    //             return;
    //         }
    //         setModal({
    //             assets: {
    //                 isLoader: false,
    //                 isComplete: true,
    //                 isError: false,
    //                 errorMessage: ""
    //             },
    //             contractDeploy: {
    //                 isLoader: false,
    //                 isComplete: true,
    //                 isError: false,
    //                 errorMessage: ""
    //             },
    //             completed: {
    //                 isLoader: false,
    //                 isComplete: false,
    //                 isError: false,
    //                 errorMessage: ""
    //             }
    //         })
    //         const newFormData = formData;
    //         const contract = await getContract(newFormData.contractAddress, NFT_ABI);
    //         if (contract) {
    //             const approvalMarketplace = await contract.setApprovalForAll(NFT_MARKET_PLACE_ADDRESS, true);
    //             const tx = await approvalMarketplace.wait();
    //             if (tx) {
    //                 newFormData.approvalTransaction = tx;
    //                 setFormData({
    //                     ...newFormData
    //                 })
    //                 await saveOnOwnServer();
    //             } else {
    //                 throw new Error(JSON.stringify({
    //                     slug: "approval",
    //                     message: "Something went wrong!"
    //                 }));
    //             }
    //         }
    //     } catch (error: any) {
    //         const message = error.message || "something went wrong";
    //         var parseJson: any = IsJsonString(message);
    //         if (!parseJson) {
    //             parseJson = {
    //                 slug: "approval",
    //                 message: message
    //             }
    //         }
    //         throw new Error(JSON.stringify(parseJson));
    //     }
    // }

    const saveOnOwnServer = async () => {
        try {
            setModal({
                assets: {
                    isLoader: false,
                    isComplete: true,
                    isError: false,
                    errorMessage: ""
                },
                contractDeploy: {
                    isLoader: false,
                    isComplete: true,
                    isError: false,
                    errorMessage: ""
                },
                completed: {
                    isLoader: true,
                    isComplete: false,
                    isError: false,
                    errorMessage: ""
                }
            })
            const userSign = await loginUserSigner()
            if (!userSign.status) {
                throw new Error(JSON.stringify({ slug: "completed", message: userSign.message }));
            }
            const result = await saveCollection(formData);
            if (result.status === "success") {
                setRedirectCollectionUrl(`/collections/${result.data._id}`);
                setModal({
                    assets: {
                        isLoader: false,
                        isComplete: true,
                        isError: false,
                        errorMessage: ""
                    },
                    contractDeploy: {
                        isLoader: false,
                        isComplete: true,
                        isError: false,
                        errorMessage: ""
                    },
                    completed: {
                        isLoader: false,
                        isComplete: true,
                        isError: false,
                        errorMessage: ""
                    }
                })
            } else {
                throw new Error(JSON.stringify({
                    slug: "completed",
                    message: result.message
                }));
            }
        } catch (error: any) {
            const message = error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "completed",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }

    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newImages: any = images;
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            const name = event.target.name;
            setAssets({
                ...assets,
                [name]: event.target.files
            })
            newImages[name] = URL.createObjectURL(i);
        }
        setImages({ ...newImages });
    }

    const handleUpdate = async () => {

    }

    const [isActive, setActive] = useState(false);



    const setFollowStepError = (slug: string, message: string) => {
        const newModal = followStepError(slug, message, defaultModalValue);
        setModal(newModal);
    }

    const tryAgainModal = async () => {
        try {
            let newModal: any = modal;
            ["assets", "contractDeploy", "completed"].forEach(async (element) => {
                try {
                    const modalAsset = newModal[element];
                    if (modalAsset.isError) {
                        if (element === "assets") {
                            await uploadAssetsOnIPFS();
                        } else if (element === "contractDeploy") {
                            await deployContract();
                        } else if (element === "completed") {
                            await saveOnOwnServer();
                        }
                    }
                } catch (error: any) {
                    var parseJson: any = IsJsonString(error.message);
                    if (!parseJson) {
                        parseJson = {
                            slug: "assets",
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
                    slug: "assets",
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

    /**
     * Remove Logo Image 
     */

    function removeImage() {
        const newFormData = formData;
        imageInputRef.current.value = "";
        newFormData.image = "";
        setAsset([]);
        setFormData({ ...newFormData });
        setIsLoading(false);
    }

    /**
     * Remove Feature Image
     */

    function removeFeature() {
        const newFormData = formData;
        imageInputRef.current.value = "";
        newFormData.feature = "";
        setAsset([]);
        setFormData({ ...newFormData });
        setIsLoading(false);
    }

    /**
     * Remove Banner Image
     */

    function removeBanner() {
        const newFormData = formData;
        imageInputRef.current.value = "";
        newFormData.banner = "";
        setAsset([]);
        setFormData({ ...newFormData });
        setIsLoading(false);
    }


    return (
        <div className="lg:flex md:flex block flex-row">
            <div className="basis-4/12  profile_edit_left_col px-10 pt-10 lg:pb-0  md:pb-0  pb-10 dark:bg-[#16151a] bg-[#571a810f]" data-aos="fade-right" data-aos-duration="3000">
                <div className="dark:bg-[#16151a]  border-rounded-lg md:p-0 p-0">
                    <div className="profile_edit_left_col_imagebg">

                        <div className="profile_edit_left_col_image text-center mx-auto mt-0 mb-8 profile_logo_box">
                            {
                                images.image &&
                                <div className="cancle " onClick={removeImage}>X</div>
                            }
                            <h2 className="dark:text-white text-[#000] text-lg font-semibold aos-init aos-animate mb-3" data-aos="zoom-in" data-aos-duration="3000">
                                Logo image
                                {/* <span>This image will also be used for navigation. 350 x 350 recommended.</span> */}
                            </h2>
                            <div className="mb-3 w-100 createpage_left_side_column logobox">

                                <label
                                    htmlFor="image"
                                    className="form-label inline-block mb-2 text-gray-700"
                                    style={{
                                        height: "200px",
                                        width: "200px",
                                        marginTop: "10px",
                                        marginBottom: "50px"
                                    }}
                                >

                                    {
                                        images.image ? (
                                            <Image
                                                src={images.image}
                                                alt='Profile Bg Image'
                                                className='rounded-lg object-cover logo__image'
                                                height="300px"
                                                width="300px"
                                            />
                                        ) : (
                                            <p>
                                                File types supported: JPG, PNG, GIF, SVG. Max size: 10 MB
                                            </p>
                                        )
                                    }
                                </label>
                                <input type="file" name='image' id="image" className="hidden" onChange={handleFileChange} accept="image/*" ref={imageInputRef} />

                            </div>
                        </div>
                        <div className="featured_image_container text-center mx-auto mb-8">
                            {
                                images.feature &&

                                <div onClick={removeFeature} className="cancle">X</div>
                            }
                            <h2 className="dark:text-white text-[#000] text-lg font-semibold aos-init aos-animate mb-3" data-aos="zoom-in" data-aos-duration="3000">
                                Featured image
                                {/* This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of OpenSea. 600 x 400 recommended. */}
                            </h2>
                            <div className="mb-3 w-100 createpage_left_side_column">

                                <label
                                    htmlFor="feature"
                                    className="form-label inline-block mb-2 text-gray-700"
                                    style={{
                                        height: "200px",
                                        width: "320px",
                                        marginTop: "10px",
                                        marginBottom: "50px"
                                    }}
                                >

                                    {
                                        images.feature ? (
                                            <Image
                                                src={images.feature}
                                                alt='Profile Bg Image'
                                                className=''
                                                height="400px"
                                                width="600px"
                                            />
                                        ) : (
                                            <p>
                                                File types supported: JPG, PNG, GIF, SVG. Max size: 10 MB
                                            </p>
                                        )
                                    }
                                </label>
                                <input type="file" name='feature' id="feature" className="hidden" onChange={handleFileChange} accept="image/*" ref={imageInputRef} />

                            </div>
                        </div>
                        <div className="profile_edit_left_col_bannerimg text-center mx-auto mb-8">
                            {
                                images.banner &&

                                <div className="cancle" onClick={removeBanner}>X</div>
                            }
                            <h2 className="dark:text-white text-[#000] text-lg font-semibold aos-init aos-animate mb-3" data-aos="zoom-in" data-aos-duration="3000">Banner Image</h2>
                            <div className="mb-3 w-100 createpage_left_side_column">

                                <label
                                    htmlFor="banner"
                                    className="form-label inline-block mb-2 text-gray-700"
                                    style={{
                                        height: "180px",
                                        width: "400px",
                                        marginTop: "10px",
                                        marginBottom: "50px"
                                    }}
                                >

                                    {
                                        images.banner ? (
                                            <Image
                                                src={images.banner}
                                                alt='Profile Bg Image'
                                                className='rounded-lg object-cover'
                                                height="200px"
                                                width="450px"
                                            />
                                        ) : (
                                            <p>
                                                File types supported: JPG, PNG, GIF, SVG. Max size: 10 MB
                                            </p>
                                        )
                                    }
                                </label>
                                <input type="file" name='banner' id="banner" className="hidden" onChange={handleFileChange} accept="image/*" ref={imageInputRef} />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="basis-8/12  profile_edit_right_col lg:mt-0 md:mt-0 mt-10 dark:bg-[#09080d]  bg-[#fff] border-rounded-lg lg:p-10 md:p-10 p-0" data-aos="fade-left" data-aos-duration="3000">
                <div className="profile_edit_right_col_form_column " >
                    <div className="profile_edit_right_col_form_column_form create_form ">
                        <h3 className='px-0 text-xl dark:text-white'>Create New Collection</h3>
                        <form className="w-full mb-10 mt-8 " data-aos="zoom-in" data-aos-duration="3000">
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
                            <div className=" mb-6">
                                <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="grid-city">Name</label>
                                <input className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-sm text-white" type="text" name='name' value={formData.name} placeholder="Enter Name..." onChange={handleChange} />
                            </div>
                            <div className=" mb-6">
                                <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="grid-city">Symbol</label>
                                <input className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-sm text-white" type="text" name='symbol' value={formData.symbol} placeholder="e.g. DVT" onChange={handleChange} />
                            </div>
                            <Categories value={formData.category} handleChange={handleSelectChange} />
                            <Genries value={formData.genre} handleChange={handleSelectChange} />
                            <div className="grid grid-cols-1 lg:mb-5 md:mb-5 mb-0 form_textarea">
                                <div className=" mb-6 md:mb-0">
                                    <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" >Description</label>
                                    <textarea className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-sm text-white" name='description' value={formData.description} placeholder="Enter Description..." onChange={handleChange}></textarea>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 collection_form_socalicons">
                                {
                                    socialIcons.map((social, key) => {
                                        const newSocialLinks: any = formData.socialLinks;
                                        const value = newSocialLinks[social.value] || "";
                                        return (
                                            <div className="flex flex-row lg:mb-2 md:mb-2 mb-0 items-center" key={key}>
                                                <div className="px-3 mb-6 md:mb-0">
                                                    {social.icon}
                                                </div>
                                                <div className="  mb-6 px-3 md:mb-0 collection_sociallinks">
                                                    <input className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-sm text-white"
                                                        type="text" name={`socialLinks|${social.value}`} placeholder={`Enter ${toCaptalize(social.value)} URL...`} value={value} onChange={handleChange} />
                                                </div>
                                            </div>

                                        )
                                    })
                                }
                            </div>


                            <div className="grid grid-cols-1 mt-3 lg:mb-5 md:mb-5 mb-0">
                                <div className=" px-3 mb-6 md:mb-0">
                                    <label className="block dark:text-[#fff] text-[#363434] text-md mb-2">
                                        Creator Earnings
                                    </label>
                                    <input className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-sm text-white" type="number" step="1" min="0" max="10" name='creatorEarning' value={formData.creatorEarning !== "" ? formData.creatorEarning : ""} onChange={handleChange} placeholder="e.g. 1%" />
                                </div>
                            </div>
                            {
                                parseInt(formData.creatorEarning) > 0 && (
                                    <div className="grid grid-cols-1 lg:mb-5 md:mb-5 mb-0">
                                        <div className=" px-3 mb-6 md:mb-0">
                                            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2">
                                                User Address
                                            </label>
                                            <input className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-sm text-white" type="text" name='creatorEarningAddress' value={formData.creatorEarningAddress} onChange={handleChange} placeholder="Enter Wallet Address...">
                                            </input>
                                        </div>
                                    </div>
                                )
                            }



                            {/* <div className="flex flex-row lg:mb-5 md:mb-5 mb-0">
                                <div className='basis-10/12 px-3 mb-6 md:mb-0'>Explicit & sensitive content</div>
                                <div className="basis-2/12 items-end justify-center w-full mb-12">
                                    <label htmlFor="toggleB" className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" id="toggleB" value={formData.explicitSensitiveContent} className="sr-only" name='explicitSensitiveContent' onChange={handleChange} />
                                            <div className="block dark:bg-[#16151a]  bg-[#e3e1e4] w-14 h-8 rounded-full"></div>
                                            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                                        </div>
                                    </label>
                                </div>

                            </div> */}

                            {
                                isSaving ? (
                                    <div className="grid mb-5 grid-cols-3 editprofile_submit_btn" >
                                        <button className="bg-blue-500 hover:bg-blue-700 rounded-full text-white font-bold py-3 px-6" >Loading...</button>
                                    </div>
                                ) : (

                                    <div className="grid mb-5 grid-cols-3 editprofile_submit_btn" >
                                        <button className="bg-blue-500 hover:bg-blue-700 rounded-full text-white font-bold py-3 px-6" onClick={handleSubmit}>Submit</button>
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>

            <CustomModal
                fullWidth={true}
                maxWidth="sm"
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
                    <Grid className="pt-5" container spacing={2}>
                        <Grid item xs={2} md={2}>
                            {
                                modal.assets.isLoader
                                    ? <CircularProgress size={30} color="secondary" />
                                    : (modal.assets.isComplete ? <AiOutlineCheck color='green' size={30} /> : <AiOutlineCheck className='dark:text-[#fff]' size={30} />)
                            }
                        </Grid>
                        <Grid item xs={10} md={10}>
                            <h1 className="font-bold text-[#000] dark:text-[#fff]">Upload images </h1>
                            <p>Upload images on IPFS</p>
                        </Grid>
                        {modal.assets.isError
                            && <Grid item>
                                <p style={{ color: "red", marginLeft: '17%' }}>{modal.assets.errorMessage}</p>
                            </Grid>}
                    </Grid>
                    <Grid className="pt-5" container spacing={2}>
                        <Grid item xs={2} md={2}>
                            {
                                modal.contractDeploy.isLoader
                                    ? <CircularProgress size={30} color="secondary" />
                                    : (modal.contractDeploy.isComplete ? <AiOutlineCheck color='green' size={30} /> : <AiOutlineCheck className='dark:text-[#fff]' size={30} />)
                            }
                        </Grid>
                        <Grid item xs={10} md={10}>
                            <h1 className="font-bold text-[#000] dark:text-[#fff]">Deploy contract</h1>
                            <p>Deploy code for the new collection smart contract</p>
                        </Grid>
                        {modal.contractDeploy.isError
                            && <Grid item>
                                <p style={{ color: "red", marginLeft: '17%' }}>{modal.contractDeploy.errorMessage}</p>
                            </Grid>}
                    </Grid>
                    <Grid className="pt-5" container spacing={2}>
                        <Grid item xs={2} md={2}>
                            {
                                modal.completed.isLoader
                                    ? <CircularProgress size={30} color="secondary" />
                                    : (modal.completed.isComplete ? <AiOutlineCheck color='green' size={30} /> : <AiOutlineCheck className='dark:text-[#fff]' size={30} />)
                            }
                        </Grid>
                        <Grid item xs={10} md={10}>
                            <h1 className="font-bold text-[#000] dark:text-[#fff]">Sign message</h1>
                            <p>Sign message with new collection preferences</p>
                        </Grid>
                        {modal.completed.isError
                            && <Grid item>
                                <p style={{ color: "red", marginLeft: '17%' }}>{modal.completed.errorMessage}</p>
                            </Grid>}
                    </Grid>
                </ModalContent>
                {
                    modal.completed.isComplete || modal.assets.isError || modal.contractDeploy.isError || modal.completed.isError ? (
                        <ModalFooter className="steps_popup_button">
                            {
                                modal.completed.isComplete
                                    ? <Link href={redirectCollectionUrl} passHref>
                                        <Button autoFocus variant="outlined">VIEW COLLECTION</Button>
                                    </Link>
                                    : (
                                        modal.assets.isError || modal.contractDeploy.isError || modal.completed.isError
                                            ? <Button autoFocus variant="outlined" onClick={tryAgainModal}>Try again</Button>
                                            : ""
                                    )
                            }
                        </ModalFooter>
                    ) : ""
                }
            </CustomModal>
        </div>
    )
}

export default CollectionForm