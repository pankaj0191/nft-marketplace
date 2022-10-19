import React, { useEffect, useState } from "react";
import moment from "moment";
import Link from "next/link";
import Image from "next/image";
import Avatar from "boring-avatars";
import { useRouter } from "next/router";
import { Tooltip, Button } from "@nextui-org/react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { BsGlobe } from 'react-icons/bs';
import { FiActivity } from 'react-icons/fi';
import { BsGrid3X3 } from "react-icons/bs";
import { HiBadgeCheck } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTwitter, FaDiscord, FaEthereum, FaEdit } from "react-icons/fa";

import { MyNFT } from "../nft";
import { getColors, toCaptalize } from "../../helpers";
import { Metamask, MetamaskContextResponse } from "context";
import { getAllItems, getCollectionDetails } from "../../services";
import { CommonFilter, NoDataFound, TrimAndCopyText } from "../miscellaneous";

import { CollectionDataProps } from '../../@types'

import 'react-tabs/style/react-tabs.css';

interface DetailProps {
  collection: CollectionDataProps;
  id: string;
}

function Details({ collection, id }: DetailProps) {
  const [toggleViewMode, setToggleViewMode] = useState<Boolean>(false);
  const { isAuthenticated, user }: MetamaskContextResponse = Metamask.useContext();
  const [isLoading, setIsLoading] = useState(false);
  const [floorPrice, setFloorPrice] = useState("0.00");
  const [volumeUsed, setVolumeUsed] = useState("0");
  const [nfts, setNfts] = useState<any[]>([]);
  const [collectionDetails, setCollectionDetails] = useState({
    nfts: [],
    owners: [],
    activities: [],
  });
  const router = useRouter();

  const icons: any = {
    twitter: <FaTwitter />,
    facebook: <FaFacebookF />,
    instagram: <FaInstagram />,
    discord: <FaDiscord />,
    website: <BsGlobe />
  }

  const socialLinkKeys = Object.keys(collection.socialLinks || {});
  const socialLinks = socialLinkKeys.map(link => {
    const socialIcons: any = collection.socialLinks;
    if (socialIcons[link]) {
      return {
        label: toCaptalize(link),
        value: socialIcons[link],
        url: socialIcons[link],
        icon: icons[link]
      }
    }
    return "";
  }).filter(link => link);

  useEffect(() => {
    if (!id) {
      router.push('/');
      return;
    }
    (async () => {
      setIsLoading(true);
      const results = await getCollectionDetails(id, {
        floorPrice: true,
      });
      const items = await getAllItems({
        skip: 0,
        limit: 20,
        collection: id,
        creator: true,
        owner: true,
        view: true,
        like: true,
      });
      setNfts(items);
      const floorPriceData = results.floor_price.length ? results.floor_price.shift().averageQuantity : "0.00";
      setFloorPrice(floorPriceData);
      setIsLoading(false);
    })();
  }, [id, router]);

  const handleToggle = (bool: Boolean) => {
    setToggleViewMode(bool)
  }

  return (
    <>
      <section className="collectionsingle">
        <div className="container-fluid mx-auto ">
          <div className="">
            <div
              className="basis-12/12  collectionsingle_banner_row "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="350"
              data-aos-duration="2000"
            >
              <div className="collectionsingle_banner">

                {
                  collection.banner ? (
                    <Image
                      src={collection.banner}
                      className="object-cover "
                      alt="my image"
                      height="300px"
                      width="1200px"
                    />
                  ) : (
                    <div className="profile_dummybg">
                    </div>
                  )}

              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="collectionsingle ">
        <div className="container-fluid mx-auto ">
          <div className="">
            <div
              className="basis-12/12  collectionsingle_banner_row "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="350"
              data-aos-duration="2000"
            >
            </div>
          </div>
        </div>
      </section>

      {/*********************/}
      <section className="collectionsingle lg:px-14 md:px-5 px-0 pb-5 pt-4">
        <div className="container mx-auto ">
          <div className="lg:flex md:flex block collectionsingle_data_row">
            <div
              className="basis-3/12  collectionsingle_banner_row_data  "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="350"
              data-aos-duration="2000"
            >
              <div className="collectionsingle_banner_row_data_box">

                <div className="collectionsingle_banner_smallimage">
                  {
                    collection.image ? (
                      <Image
                        src={collection.image}
                        className="rounded-lg  w-24 h-24  border border-3 border-[#fff]"
                        alt="my image"
                        height="200px"
                        width="200px"
                      />
                    ) : (
                      <Avatar
                        size={200}
                        name={"noname"}
                        variant="marble"
                        colors={getColors(4)}
                      />
                    )
                  }
                </div>
              </div>


            </div>

            <div
              className="basis-6/12 "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="350"
              data-aos-duration="2000"
            >
              <div className="">


                <div className="single creator_leftbox">
                  <h2 className="dark:text-white text-[#000] font-semibold	text-lg	home-collection_heading_badge flex items-center">
                    {toCaptalize(collection.name)}
                    {
                      collection.isVarified ? (
                        <Tooltip content={"Verified"} rounded color="primary" placement="rightEnd">
                          <Button auto flat>
                            <HiBadgeCheck />
                          </Button>
                        </Tooltip>
                      ) : ""
                    }

                  </h2>


                  <div className="collectionsingle_createdrow flex items-center">
                    <div className="collectionsingle_created">
                      {/* <h6 className="collectiondetail_user dark:text-white text-[#000] text-sm ">Demo title</h6> */}
                      <h6 className="collectiondetail_user dark:text-white text-[#000] text-sm "> <Link href={`/collectors/${collection.creator?.id}`}>
                        <a>@{collection.creator?.username}</a>
                      </Link></h6>
                      {/* <p className="dark:text-[#707a83] text-[#707a83] text-sm"><b className="text-[#000] dark:text-[#fff] font-semibold"> CREATED BY  </b>:    <Link href={`/collectors/${collection?.creator?.id}`}>
                        <a>@{collection?.creator?.username}</a>
                      </Link></p> */}
                    </div>
                  </div>
                  <div className="collectionsingle_createdrow flex  items-center mt-3">
                    <div className="collectionsingle_created">
                      {collection?.createdAt ? (
                        <p className="dark:text-[#707a83] text-[#707a83] text-sm"> <b className="text-[#000] dark:text-[#fff] font-semibold">CREATED DATE  </b> : {moment(collection.createdAt).format('Do MMMM, YYYY')}</p>
                      ) : ""}
                    </div>
                  </div>

                  <div className="collectionsingle_genre_row mt-4">
                    <div className="collectionsingle_createdrow mt-3">
                      <div className="collectionsingle_created">
                        {collection?.category.name ? (
                          <p className="dark:text-[#707a83] text-[#707a83] text-sm mb-2 mr-2"> <b className="text-[#000] dark:text-[#fff] font-semibold">CATEGORY  </b> : {collection.category.name}</p>
                        ) : ""}
                        {collection?.genre.name ? (
                          <p className="dark:text-[#707a83] text-[#707a83] text-sm mb-2 mr-2"> <b className="text-[#000] dark:text-[#fff] font-semibold">GENRE  </b> : {collection.genre.name}</p>
                        ) : ""}
                        {collection?.contractAddress ? (
                          <p className="dark:text-[#707a83] text-[#707a83] text-sm mb-2 mr-2">
                            <TrimAndCopyText text={collection.contractAddress} />
                          </p>
                        ) : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div
              className="basis-3/12  collectionsingle_banner_row  collectionsingle_right"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="350"
              data-aos-duration="2000"
            >
              <div className="flex items-center justify-end" >
                {
                  socialLinks.length ? socialLinks.map((socialLink: any, key) => {
                    return <div className="myprofile_onsale_column_box_socialicons" key={key}>
                      <a target="_blank" rel="noreferrer" title={socialLink.label} href={socialLink.url}>{socialLink.icon}</a>
                    </div>
                  }) : "  "
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="collectionsingle">
        <div className="container-fluid mx-auto ">
          <div className="flex justify-center items-center " >
            <div className="collectionsingle_items_row">
              <div className="collectionsingle_items_row_col flex justify-center  lg:mt-10 md:mt-10 mt-0 flex-wrap " >

                <div
                  className=" collectionsingle_items_col "
                >
                  <div className="text-center">
                    <h6 className=" dark:text-[#707a83] text-3xl">{collection.nftCount}</h6>
                    <span className="dark:text-[#707a83] text-[#707a83] text-lg flex items-center lg:justify-center  md:justify-flex-start  mt-1 -ml-1 mb-3 mx-auto ">Items</span>
                  </div>

                </div>

                {/* <div
                  className=" collectionsingle_items_col "
                >
                  <div className="text-center">
                    <h6 className=" dark:text-[#707a83] text-3xl	 ">{collectionDetails?.owners.length}</h6>
                    <span className="dark:text-[#707a83] text-[#707a83] text-lg flex items-center lg:justify-center  md:justify-flex-start  mt-1 -ml-1 mb-3 mx-auto">Owners</span>
                  </div>

                </div> */}

                <div
                  className=" collectionsingle_items_col "
                >
                  <div className="text-center">
                    <h6 className=" dark:text-[#707a83] text-3xl	 "><FaEthereum size={22} style={{
                      display: "inline-block",
                      marginTop: "-5px"
                    }} />{parseFloat(floorPrice).toFixed(4)}</h6>
                    <span className="dark:text-[#707a83] text-[#707a83] text-lg flex items-center lg:justify-center  md:justify-flex-start  mt-1 -ml-1 mb-3 mx-auto">Floor price</span>
                  </div>

                </div>

                <div
                  className=" collectionsingle_items_col "
                >
                  <div className="text-center">
                    <h6 className=" dark:text-[#707a83] text-3xl	 ">{volumeUsed}</h6>
                    <span className="dark:text-[#707a83] text-[#707a83] text-lg flex items-center lg:justify-center  md:justify-flex-start  mt-1 -ml-1 mb-3 mx-auto">Volume traded</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center flex-wrap mb-10">
                <p className="text-center mt-5 container dark:text-[#707a83]">
                  {collection?.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#f5f1f8] dark:bg-[#09080d] creatordetail_tabs_section">
        <div className="container mx-auto creatordetail_tabs_section_container">
          <div className="">
            <div

              className="basis-12/12  myprofile_page_pr0file_row_image_content mt-10"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >

              <Tabs>
                <TabList>
                  <Tab>
                    <BsGrid3X3 style={{
                      display: "inline-block",
                      marginRight: "10px",
                      marginTop: "-5px"
                    }} /> Items</Tab>
                  <Tab>
                    <FiActivity style={{
                      display: "inline-block",
                      marginRight: "10px",
                      marginTop: "-5px"
                    }} /> Activity</Tab>
                </TabList>

                <TabPanel className="reatordetail_tabs  searchpage_tabs_panel">
                  <CommonFilter onToggle={handleToggle} />
                  <div className="dark:text-[#fff]">
                    {isLoading ? (
                      <NoDataFound>Loading...</NoDataFound>
                    ) :
                      (nfts?.length ?
                        nfts.map((nft: any, key: number) => {
                          return (
                            <div key={key} className={`grid grid-cols-${toggleViewMode ? '3' : '4'} gap-4 `}>
                              <MyNFT key={key} {...nft} />
                            </div>
                          )
                        }) : (
                          <NoDataFound>No Item Found</NoDataFound>
                        )
                      )}
                  </div>
                </TabPanel>
                <TabPanel className="reatordetail_tabs  searchpage_tabs_panel">
                  <CommonFilter onToggle={handleToggle} />
                  <div className="dark:text-[#fff]">
                    {isLoading ? (
                      <NoDataFound>Loading...</NoDataFound>
                    ) :
                      (collectionDetails?.activities?.length ?
                        collectionDetails.activities.map((activity: any, key: number) => {
                          return (
                            <div key={key} className={`grid grid-cols-${toggleViewMode ? '3' : '4'} gap-4 `}>
                              <div key={key}>activity {key + 1}</div>
                            </div>
                          )
                        }) : (
                          <NoDataFound>No Activity Found</NoDataFound>
                        )
                      )}
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>

        </div>
      </section>

    </>
  );
}

export default Details;
