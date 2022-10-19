import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ethers } from "ethers";
import { useRouter } from "next/router";

import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import { Button, capitalize, CircularProgress, Grid } from "@mui/material";

import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai"

import { Metamask } from 'context'
import { validateNftForm } from "schemas/form";
import { getCollectionById, saveNft } from "services";
import { formatSolidityError, getNftContract, getNftMarketContract } from "helpers";
import PropertyModal, { ProperyValueProps } from "./PropertyModal";
import { Genries, Categories, Collections } from "../miscellaneous";
import { NFT_MARKET_PLACE_ADDRESS, uploadOnIPFSServer } from "utils";
import { CustomModal, ModalContent, ModalFooter, ModalHeader } from "components/miscellaneous/modal";
import { followStepError, getIPFSBaseUrl } from "helpers/web3";


export interface NftInputProps {
  title: string,
  description: string,
  image: string;
  banner: string;
  fileType: string;
  category: string,
  genre: string,
  collection: string,
  externalLink: string,
  properties: ProperyValueProps[],
  explicitSensitiveContent: Boolean;
}

const defaultModalValue = {
  assets: {
    isLoader: false,
    isComplete: false,
    isError: false,
    errorMessage: ""
  },
  minting: {
    isLoader: false,
    isComplete: false,
    isError: false,
    errorMessage: ""
  },
  approve: {
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

function Form() {
  const [open, setOpen] = useState<Boolean>(false);
  const [redirectNftItemUrl, setRedirectNftItemUrl] = useState<string>("");
  const imageInputRef = useRef<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isError, setIsError] = useState({
    status: false,
    message: ""
  });
  const [modal, setModal] = useState(defaultModalValue);
  const [isActive, setActive] = useState(false);
  const [file, setFile] = useState("");
  const { login, user, isAuthenticated, loginUserSigner }: any = Metamask.useContext();

  const defaultData = {
    title: "",
    genre: "",
    category: "",
    description: "",
    image: "",
    banner: "",
    metadata: "",
    transactions: {},
    tokenId: "",
    fileType: "image",
    collection: "",
    externalLink: "",
    properties: [],
    explicitSensitiveContent: false,
  }
  const [formData, setFormData] = useState<NftInputProps>(defaultData);
  const [asset, setAsset] = useState<any[]>([]);
  const [assets, setAssets] = useState({
    image: "",
    banner: ""
  });

  async function onFileChange(e: any) {
    setIsFileUploading(true);
    try {
      const newFormData: any = formData;
      const data = e.target.files[0] || "";
      const name = e.target.name;
      if (data) {
        newFormData.fileType = checkFileIs(data);
        setFile(URL.createObjectURL(data));
        setAsset(data);
        setFormData({ ...newFormData });
      }

    } catch (error) {
      console.log(error);
    }
    setIsFileUploading(false);
  }

  function checkFileIs(file: any) {
    return file && file['type'].split('/').shift() || "";
  }

  function removeAsset() {
    const newFormData = formData;
    newFormData.fileType = "";
    newFormData.image = "";
    setAsset([]);
    setFile("");
    setFormData({ ...newFormData });
    setIsLoading(false);
  }


  function removeCover() {
    const newFormData = formData;
    newFormData.fileType = "";
    newFormData.banner = "";
    setAsset([]);
    setFile("");
    setFormData({ ...newFormData });
    setIsLoading(false);
  }

  const handleChange = (event: any) => {
    event.preventDefault();
    const { name, value, checked } = event.target;
    const checkedArray = ["explicitAndSensitiveContent"];
    if (checkedArray.includes(name)) {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setIsLoading(false);
  };

  const handleSubmitProperties = (properties: any) => {
    setFormData({ ...formData, properties });
    setIsLoading(false);
  }

  const handleInputChange = (option: any, { name }: any) => {
    const { value = "" } = option || {};
    const newFormData: any = formData;
    setFormData({ ...newFormData, [name]: value });
    setIsLoading(false);
  }

  const setFollowStepError = (slug: string, message: string) => {
    const newModal = followStepError(slug, message, defaultModalValue);
    setModal({ ...newModal });
  }

  const tryAgainModal = async () => {
    try {
      let newModal: any = modal;
      ["assets", "minting", "approve", "onOwnServer"].forEach(async (element) => {
        try {
          const modalAsset = newModal[element];
          if (modalAsset.isError) {
            if (element === "assets") {
              await uploadAssetsOnIPFS();
            } else if (element === "minting") {
              await nftMinting();
            } else if (element === "approve") {
              await approveNftForMarketplace();
            } else if (element === "onOwnServer") {
              await submitNftItem();
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const newFormData: any = formData;
      const result = await validateNftForm({
        ...newFormData,
        image: file
      });
      if (result.status) {
        setOpen(true);
        await uploadAssetsOnIPFS();
      } else {
        setIsError({
          status: true,
          message: result.errors.shift()
        })
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
    setIsLoading(false);
  }

  // Save nft assets on IPFS Server
  const uploadAssetsOnIPFS = async () => {
    const slug = "assets";
    try {
      if (!isAuthenticated) {
        login();
        return;
      }
      setModal({
        ...{
          assets: {
            isLoader: true,
            isComplete: false,
            isError: false,
            errorMessage: ""
          },
          minting: {
            isLoader: false,
            isComplete: false,
            isError: false,
            errorMessage: ""
          },
          approve: {
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
      })
      const newFormData: any = formData;
      const { title, description, properties, externalLink } = newFormData;
      // upload assets on IPFS Server
      if (asset) {
        // const nftImage = "QmbCTrFZbdCxcCZiuakCagWQQiFU6ivH4R9WnU7cAe1MMA";
        const nftImage = await uploadOnIPFSServer(asset);
        // setMetadata
        const metadata = {
          name: title,
          description,
          attributes: properties,
          external_url: externalLink,
          image: getIPFSBaseUrl(nftImage),
        };
        setFile(getIPFSBaseUrl(nftImage))
        newFormData.image = nftImage;
        // newFormData.metadata = "QmQtux5fWV751uYQEy5abyHNSLKjdaFmfdbg8UkrJWMEQ8";
        newFormData.metadata = await uploadOnIPFSServer(JSON.stringify(metadata));
        setFormData({ ...newFormData });
        await nftMinting()
      } else {
        const message = "Image must be required";
        throw new Error(JSON.stringify({ slug, message }));
      }
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

  const nftMinting = async () => {
    try {
      if (!isAuthenticated) {
        login();
        return;
      }
      setModal({
        ...{
          assets: {
            isLoader: false,
            isComplete: true,
            isError: false,
            errorMessage: ""
          },
          minting: {
            isLoader: true,
            isComplete: false,
            isError: false,
            errorMessage: ""
          },
          approve: {
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
      })
      const newFormData: any = formData;
      const collectionId = newFormData.collection ? newFormData.collection : "diamond_verse";
      const collectionData: any = await getCollectionById(collectionId);

      const nftMarketPlaceContract: any = await getNftMarketContract();
      const marketPlaceTransaction = await nftMarketPlaceContract.createItem(
        collectionData.contractAddress, getIPFSBaseUrl(newFormData.metadata), newFormData.category, newFormData.genre
      );
      const itemTx = await marketPlaceTransaction.wait();
      if (itemTx) {
        let event = itemTx.events.find((e: any) => e.args);
        if (event?.args) {
          const itemTokenId = event.args["tokenId"].toString();
          newFormData.itemId = event.args["itemId"].toString();
          newFormData.tokenId = itemTokenId;
          newFormData.transactions = itemTx;
          setFormData({ ...newFormData })
          await approveNftForMarketplace();
        } else {
          const message = "Something went wrong during minting!"
          throw new Error(JSON.stringify({ slug: "minting", message }));
        }
      } else {
        const message = "Something went wrong during minting!"
        throw new Error(JSON.stringify({ slug: "minting", message }));
      }
    } catch (error: any) {
      const err = formatSolidityError(error.message);
      const message = err ? capitalize(err.message) : error.message || "something went wrong";
      var parseJson: any = IsJsonString(message);
      if (!parseJson) {
        parseJson = {
          slug: "minting",
          message: message
        }
      }
      throw new Error(JSON.stringify(parseJson));
    }
  }

  const approveNftForMarketplace = async () => {
    try {
      if (!isAuthenticated) {
        login();
        return;
      }
      setModal({
        ...{
          assets: {
            isLoader: false,
            isComplete: true,
            isError: false,
            errorMessage: ""
          },
          minting: {
            isLoader: false,
            isComplete: true,
            isError: false,
            errorMessage: ""
          },
          approve: {
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
      const newFormData: any = formData;
      const collectionId = newFormData.collection ? newFormData.collection : "diamond_verse";
      const collectionData: any = await getCollectionById(collectionId);

      const contract: any = await getNftContract(collectionData.contractAddress);
      const contractTx = await contract.approve(NFT_MARKET_PLACE_ADDRESS, newFormData.tokenId);
      const tx = await contractTx.wait();
      if (tx) {
        newFormData.approveTokenTransaction = tx;
        setFormData({ ...newFormData });
        await submitNftItem();
      } else {
        const message = "Item not approve for the marketplace!"
        throw new Error(JSON.stringify({ slug: "approve", message }));
      }
    } catch (error: any) {
      const message = error.message || "something went wrong";
      var parseJson: any = IsJsonString(message);
      if (!parseJson) {
        parseJson = {
          slug: "approve",
          message: message
        }
      }
      throw new Error(JSON.stringify(parseJson));
    }
  }


  const submitNftItem = async () => {
    try {
      if (!isAuthenticated) {
        login();
        return;
      }
      setModal({
        ...{
          assets: {
            isLoader: false,
            isComplete: true,
            isError: false,
            errorMessage: ""
          },
          minting: {
            isLoader: false,
            isComplete: true,
            isError: false,
            errorMessage: ""
          },
          approve: {
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
      const userSign = await loginUserSigner()
      if (!userSign.status) {
        throw new Error(JSON.stringify({ slug: "onOwnServer", message: userSign.message }));
      }
      const result = await saveNft(formData);
      if (result.status === "success") {
        setRedirectNftItemUrl(`/discover/${result.data._id}`)
        setModal({
          ...{
            assets: {
              isLoader: false,
              isComplete: true,
              isError: false,
              errorMessage: ""
            },
            minting: {
              isLoader: false,
              isComplete: true,
              isError: false,
              errorMessage: ""
            },
            approve: {
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
    <>
      <section className="createpage_section ">
        <div className="container-fluid mx-auto ">
          <div className="lg:flex  md:flex block ">

            <div
              className="basis-4/12 createpage_left_side dark:bg-[#16151a] bg-[#571a810f]  pb-20 pt-20 text-center"
              data-aos="fade-right"
              data-aos-duration="3000"
            >
              <div className="w-100 mb-5 createpage_left_side_column_input">
                <h2 className="dark:text-white text-[#000] font-bold	text-lg	pr-10">
                  Upload file
                </h2>
                <p className="text-[#acacac] text-base	mb-3">
                  Image, Video or Audio
                </p>
              </div>
              <div className="mb-3 w-100 createpage_left_side_column">
                {
                  isFileUploading ? (
                    <label
                      className="form-label inline-block mb-2 text-gray-700 dark:text-[#fff] "
                    >
                      Loading...
                    </label>
                  ) : (
                    <>
                      {
                        file ? (
                          <>
                            <span onClick={removeAsset} className="remove-image dark:text-[#fff]">X</span>
                            {
                              formData.fileType === "image" ? (
                                <Image
                                  src={file}
                                  alt="Picture of the item"
                                  className="rounded mt-4"
                                  width={270}
                                  height={230}
                                />
                              ) : (
                                <video
                                  loop
                                  style={{ width: '350px', height: '180px' }}
                                  controls
                                  preload="auto"
                                  controlsList="nodownload"
                                  className="form-label inline-block mb-2 text-gray-700"
                                >
                                  <source src={file} />
                                </video>
                              )
                            }

                          </>
                        ) : (
                          <label
                            htmlFor="formFileSm"
                            className="form-label inline-block mb-2 text-gray-700 dark:text-[#acacac]"
                          >
                            <p>
                              File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 10 MB
                            </p>
                          </label>
                        )
                      }
                    </>
                  )
                }

                <input
                  className="form-control w-full hidden px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  onChange={onFileChange}
                  accept="image/*,video/*,audio/*,.glb,.gltf"
                  type="file"
                  ref={imageInputRef}
                  id="formFileSm"
                  name="image"
                />

              </div>

              <div className="mb-3 w-100 createpage_left_side_column">
                {
                  isFileUploading ? (
                    <label
                      className="form-label inline-block mb-2 text-gray-700 dark:text-[#fff] "
                    >
                      Loading...
                    </label>
                  ) : (
                    <>
                      {
                        formData.fileType === 'audio' &&
                        <div className="profile_edit_left_col_bannerimg text-center mx-auto mb-8">
                          <h2 className="dark:text-white text-[#000] text-lg font-semibold aos-init aos-animate mb-3" data-aos="zoom-in" data-aos-duration="3000">Upload Cover</h2>
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
                                formData.banner ? (
                                  <>
                                    <div className="cancle" onClick={removeCover}>X</div>
                                    <Image
                                      src={formData.banner}
                                      alt='Profile Bg Image'
                                      className='rounded-lg object-cover'
                                      height="200px"
                                      width="450px"
                                    />

                                  </>
                                ) : (
                                  <p>
                                    File types supported: JPG, PNG, GIF, SVG. Max size: 10 MB
                                  </p>
                                )
                              }


                            </label>
                            <input
                              type="file"
                              name='banner'
                              id="banner"
                              className="hidden"
                              onChange={onFileChange}
                              accept="image/*"
                              ref={imageInputRef}
                            />
                          </div>
                        </div>
                      }
                    </>
                  )
                }
              </div>
            </div>

            <div
              className="basis-8/12  createpage_right_side"
              data-aos="fade-left"
              data-aos-duration="3000"
            >
              <div className="create_form dark:bg-[#09080d] lg:p-5 md:p-5 p-0 rounded-lg ">
                <div className="mb-5">
                  <h1 className="font-bold text-3xl dark:text-[#fff]">Create New NFT Item</h1>
                </div>
                <form className="w-full mb-10">

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
                  <div className="grid grid-cols-1 mb-5">
                    <FormControl
                      className="mb-6 md:mb-0"
                    >
                      <label
                        className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                        htmlFor="title"
                      >Name</label>
                      <input
                        className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm"
                        onChange={handleChange}
                        name="title"
                        id="title"
                        value={formData.title}
                        type="text"
                        placeholder="Item Name"
                      />
                    </FormControl>
                  </div>
                  <div className="grid grid-cols-1 mb-5">
                    <FormControl
                      className="mb-6 md:mb-0"
                    >
                      <label
                        className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                        htmlFor="externalLink"
                      >
                        External link
                        {/* <p className="text-xs">DiamondVerse will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.</p> */}
                      </label>
                      <input
                        className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac]  text-sm"
                        onChange={handleChange}
                        name="externalLink"
                        id="externalLink"
                        value={formData.externalLink}
                        type="text"
                        placeholder="https://yoursite.io/item/123"
                      />
                    </FormControl>
                  </div>
                  <Categories value={formData.category} handleChange={handleInputChange} />
                  <Genries value={formData.genre} handleChange={handleInputChange} />
                  <div className="grid grid-cols-1 lg:mb-5 md:mb-5 mb-0 form_textarea">
                    <FormControl
                      className="mb-6 md:mb-0"
                    >
                      <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" >Description</label>
                      <textarea className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm" name='description' value={formData.description} placeholder="Enter Description..." onChange={handleChange}></textarea>
                    </FormControl>
                  </div>
                  <Collections value={formData.collection} handleChange={handleInputChange} />
                  <PropertyModal onComplete={handleSubmitProperties} />
                  {/* <div className="grid grid-cols-12 px-3 pb-3 mb-5 border-b dark:border-[#ffffff14] nftcreate_form_puton ">
                    <div className="pt-1 col-span-1">
                      <AiOutlineWarning size={22} />
                    </div>
                    <div className="col-span-6 place-self-start">
                      <h5 className='dark:text-[#fff]'>Explicit & Sensitive Content</h5>
                      <p className="dark:text-[#fff]" >Set this item as explicit and sensitive content</p>
                    </div>
                    <div className="">
                      <Switch
                        name="explicitAndSensitiveContent"
                        focusVisibleClassName=".Mui-focusVisible"
                        sx={{ m: 1 }}
                        checked={formData.explicitSensitiveContent ? true : false}
                        onChange={handleChange}
                      />
                    </div>
                  </div> */}
                  <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1 mb-5 editprofile_submit_btn">
                    {!isLoading ? (
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 rounded-full text-white font-bold py-3 px-6"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="bg-blue-500 rounded-full text-white font-bold py-3 px-6 cursor-not-allowed"
                      >
                        Loading...
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <CustomModal
          fullWidth={true}
          maxWidth="md"
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
          <ModalContent className="uploadasset_form">
            <Grid className="pt-2" container spacing={2}>
              <Grid item xs={2} md={2}>
                {
                  modal.assets.isLoader
                    ? <CircularProgress size={30} color="secondary" />
                    : (modal.assets.isComplete ? <AiOutlineCheck color='green' size={30} /> : <AiOutlineCheck className='dark:text-[#fff]' size={30} />)
                }
              </Grid>
              <Grid item xs={10} md={10}>
                <h1 className="font-bold text-[#000] dark:text-[#fff]">Upload Asset </h1>
                <p>Upload asset on IPFS</p>
              </Grid>
              {modal.assets.isError
                && <Grid item>
                  <p style={{ color: "red", marginLeft: '17%' }}>{modal.assets.errorMessage}</p>
                </Grid>}
            </Grid>
            <Grid className="pt-5" container spacing={2}>
              <Grid item xs={2} md={2}>
                {
                  modal.minting.isLoader
                    ? <CircularProgress size={30} color="secondary" />
                    : (modal.minting.isComplete ? <AiOutlineCheck color='green' size={30} /> : <AiOutlineCheck className='dark:text-[#fff]' size={30} />)
                }
              </Grid>
              <Grid item xs={10} md={10}>
                <h1 className="font-bold text-[#000] dark:text-[#fff]">Minting</h1>
                <p>Mint your NFT on ethereum Blockchain</p>
              </Grid>
              {modal.minting.isError
                && <Grid item>
                  <p style={{ color: "red", marginLeft: '17%' }}>{modal.minting.errorMessage}</p>
                </Grid>}
            </Grid>
            <Grid className="pt-5" container spacing={2}>
              <Grid item xs={2} md={2}>
                {
                  modal.approve.isLoader
                    ? <CircularProgress size={30} color="secondary" />
                    : (modal.approve.isComplete ? <AiOutlineCheck color='green' size={30} /> : <AiOutlineCheck className='dark:text-[#fff]' size={30} />)
                }
              </Grid>
              <Grid item xs={10} md={10}>
                <h1 className="font-bold text-[#000] dark:text-[#fff]">Approve Item</h1>
                <p>Approve item for marketplace</p>
              </Grid>
              {modal.approve.isError
                && <Grid item>
                  <p style={{ color: "red", marginLeft: '17%' }}>{modal.approve.errorMessage}</p>
                </Grid>}
            </Grid>
            <Grid className="pt-5" container spacing={2}>
              <Grid item xs={2} md={2}>
                {
                  modal.onOwnServer.isLoader
                    ? <CircularProgress size={30} color="secondary" />
                    : (modal.onOwnServer.isComplete ? <AiOutlineCheck color='green' size={30} /> : <AiOutlineCheck className='dark:text-[#fff]' size={30} />)
                }
              </Grid>
              <Grid item xs={10} md={10}>
                <h1 className="font-bold text-[#000] dark:text-[#fff]">Sign message</h1>
                <p>Sign message with new collection preferences</p>
              </Grid>
              {modal.onOwnServer.isError
                && <Grid item>
                  <p style={{ color: "red", marginLeft: '17%' }}>{modal.onOwnServer.errorMessage}</p>
                </Grid>}
            </Grid>
          </ModalContent>
          {
            modal.onOwnServer.isComplete || modal.assets.isError || modal.minting.isError || modal.onOwnServer.isError ? (
              <ModalFooter className="steps_popup_button">
                {
                  modal.onOwnServer.isComplete
                    ? <Link href={redirectNftItemUrl} passHref>
                      <Button autoFocus variant="outlined" >VIEW NFT ITEM</Button>
                    </Link>
                    : (
                      modal.assets.isError || modal.minting.isError || modal.onOwnServer.isError
                        ? <Button autoFocus variant="outlined" onClick={tryAgainModal}>Try again</Button>
                        : ""
                    )
                }
              </ModalFooter>
            ) : ""
          }
        </CustomModal>
      </section>

    </>
  );
}

export default Form;
