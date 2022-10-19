import React, { useState, useEffect, FC } from "react";
import Image from "next/image";
import { Tooltip, Button } from "@nextui-org/react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { HiBadgeCheck } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTwitter, FaEthereum } from "react-icons/fa";

import { MyNFT } from '../nft'
import { Metamask } from "context";
import { CollectionCard } from "../collections";
import { getAllItems, getCollections, getFollower, saveUserFollow, userUnfollow } from "services";
import { CommonFilter, DvAvatar, NoDataFound, TrimAndCopyText } from "../miscellaneous";
import 'react-tabs/style/react-tabs.css';

interface DetailsProps {
  creator: any;
  id: string;
}


const Details: FC<DetailsProps> = ({ creator, id }, props: any) => {
  const [viewMode, setViewMode] = useState<Boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState<any[]>([]);
  const [collected, setCollected] = useState<any[]>([]);
  const [collections, setCollections] = useState([]);
  const [users, setUsers] = useState([])
  const { user, isAuthenticated }: any = Metamask.useContext();


  useEffect(() => {
    (async () => {
      setIsLoading(true);
      if (creator.ownedNftCount) {
        // Get creator owned nfts
        const collectedNfts = await getAllItems({
          ownedBy: id,
          limit: 20
        });
        setCollected(collectedNfts);
      }

      if (creator.createdNftCount) {
        // Get creator created nfts
        const createdNfts = await getAllItems({
          createdBy: id,
          limit: 20
        });
        setNfts(createdNfts);
      }

      if (creator.collectionCount) {
        // Get creator created collections
        const creatorCollections = await getCollections({
          createdBy: id,
          limit: 20
        });
        setCollections(creatorCollections);
      }

      setIsLoading(false);
    })();

  }, [id, creator]);

  const handleToggle = (bool: Boolean) => {
    setViewMode(bool);
  }

  const [followed, setFollowed] = useState<Boolean>(creator.isFollowed);
  const [userFollow, setUserFollow] = useState<number>(parseInt(creator.followers));

  useEffect(() => {
    (async () => {
      const results = await getFollower(id);
      setFollowed(results.isFollowed)
    })();
  }, [id])

  const handleFollow = async (e: any) => {
    e.preventDefault();
    if (!followed) {
      const result = await saveUserFollow(id);
      if (result.status === "success") {
        setFollowed(true);
        setUserFollow(userFollow + 1);
      }
    } else {
      const result = await userUnfollow(id);
      if (result.status === "success") {
        setFollowed(false)
        setUserFollow(userFollow - 1)
      }
    }
  }
  return (
    <>
      <section className="collectionsingle">
        <div className="container-fluid mx-auto ">
          <div className="">
            <div
              className="basis-12/12  collectionsingle_banner_row"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="350"
              data-aos-duration="2000"
            >
              <div className="collectionsingle_banner">
                {
                  creator.banner ? (
                    <Image
                      src={creator.banner}
                      className="object-cover "
                      alt="my image"
                      height="300px"
                      width="1200px"
                    />
                  ) : (
                    <div className=" profile_dummybg">
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
      <section className="collectionsingle lg:px-14 md:px-5 px-0 pb-10 pt-4">
        <div className="container mx-auto ">
          <div className="lg:flex md:flex block collectionsingle_data_row">
            <div
              className="basis-3/12  collectionsingle_banner_row_data "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="350"
              data-aos-duration="2000"
            >
              <div className="collectionsingle_banner_row_data_box">
                <div className="collectionsingle_banner_smallimage">
                  <DvAvatar
                    imageAlt="Creator Profile"
                    imageSize={{
                      height: "200px",
                      width: "200px"
                    }}
                    imageUrl={creator.image}
                    size={200}
                    name={creator.name || "noname"}
                    colors={creator.colors}
                  />
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
                    {creator.name}
                    {
                      creator.isVarified && (
                        <Tooltip content={"Verified"} rounded color="primary" placement="rightEnd">
                          <Button auto flat>
                            <HiBadgeCheck />
                          </Button>
                        </Tooltip>
                      )
                    }
                  </h2>
                  <h6 className="collectiondetail_user dark:text-white text-[#000] text-sm "> @{creator.username} </h6>

                  <p className=" dark:text-[#707a83] text-[#707a83] text-md font-normal collectiondetail_text">{creator.description}</p>
                  <div className="collectiondetail_address_row flex items-center">
                    <div className="collectiondetail_addres">
                      <h6 className=" collectiondetail_address dark:text-white text-[#000] text-sm mt-2"> <TrimAndCopyText text={creator.address} /> </h6>
                    </div>
                    {
                      creator.id !== user.id && isAuthenticated && (
                        <div className="collectiondetail_address_follow ml-5">
                          {
                            <button className="nftcard_buttons text-[#fff] text-center" onClick={handleFollow}>{followed ? "FOLLOWED " : "FOLLOW "}</button>
                          }

                        </div>
                      )
                    }
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
              <div className="creatordetails_followers_list flex justify-end items-center">
                <div className="creatordetails_followers ">
                  <h6 className=" dark:text-[#fff] text-[#000] ml-2 text-xs font-normal "><b>{userFollow}</b> Followers</h6>
                </div>
                <div className="creatordetails_followers">
                  <h6 className=" dark:text-[#fff] text-[#000] ml-2 text-xs font-normal "><b>{creator.followings}</b> Following</h6>
                </div>
              </div>
              <div className="myprofile_onsale_column_box_end_btn mt-1 flex items-center">
                {
                  creator.socialLinks?.facebook && (
                    <div className="myprofile_onsale_column_box_socialicons ">
                      <a target="_blank" rel="noreferrer" href={creator.socialLinks.facebook}><FaFacebookF /></a>
                    </div>
                  )
                }
                {
                  creator.socialLinks?.instagram && (
                    <div className="myprofile_onsale_column_box_socialicons ">
                      <a target="_blank" rel="noreferrer" href={creator.socialLinks.instagram}><FaInstagram /></a>
                    </div>
                  )
                }
                {
                  creator.socialLinks?.twitter && (
                    <div className="myprofile_onsale_column_box_socialicons ">
                      <a target="_blank" rel="noreferrer" href={creator.socialLinks.twitter}><FaTwitter /></a>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1f8] dark:bg-[#030306] creatordetail_tabs_section">
        <div className="container  mx-auto creatordetail_tabs_section_container">
          <div className="">
            <div
              className="basis-12/12 myprofile_page_pr0file_row_image_content pt-10 pb-0"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <Tabs>
                <TabList>
                  <Tab>Created</Tab>
                  <Tab>Owned</Tab>
                  <Tab>Collections</Tab>
                </TabList>
                <TabPanel className="reatordetail_tabs  searchpage_tabs_panel">
                  <CommonFilter onToggle={handleToggle} />
                  <div className="container-fluid mx-auto  ">
                    {
                      !isLoading ? (
                        <>
                          {
                            nfts.length ? (
                              <>
                                {/* <div className={`grid grid-cols-${toggleViewMode ? '3' : '4'} gap-4 `}> */}
                                <div className={`grid grid-cols-${viewMode ? '4' : '3'} gap-4 `}>
                                  {
                                    nfts.map((nft, key) => {
                                      return (
                                        <MyNFT key={key} {...nft} />
                                      )
                                    })
                                  }
                                </div>
                              </>
                            ) : (
                              <NoDataFound />
                            )
                          }
                        </>
                      ) : (
                        <NoDataFound>Loading...</NoDataFound>
                      )
                    }

                  </div>
                </TabPanel>
                <TabPanel className="reatordetail_tabs searchpage_tabs_panel">
                  <CommonFilter onToggle={handleToggle} />
                  <div className="container-fluid mx-auto  ">
                    {
                      !isLoading ? (
                        <>
                          {
                            collected.length ? (
                              <>
                                {/* <div className={`grid grid-cols-${toggleViewMode ? '3' : '4'} gap-4 `}> */}

                                <div className={`grid grid-cols-${viewMode ? '4' : '3'} gap-4 `}>
                                  {
                                    collected.map((nft, key) => {

                                      return (
                                        <MyNFT key={key} {...nft} collected={true} />
                                      )
                                    })
                                  }
                                </div>
                              </>
                            ) : (
                              <NoDataFound />
                            )
                          }
                        </>
                      ) : (
                        <NoDataFound>Loading...</NoDataFound>
                      )
                    }
                  </div>
                </TabPanel>
                <TabPanel className="reatordetail_tabs searchpage_tabs_panel">
                  <CommonFilter onToggle={handleToggle} />
                  <div className="container-fluid mx-auto  ">
                    {/* <div className="flex flex-row space-x-4 justify-between items-center mb-5"></div> */}
                    {
                      !isLoading ? (
                        <>
                          {
                            collections.length ? (
                              <>
                                {/* <div className={`grid grid-cols-${toggleViewMode ? '3' : '4'} gap-4 `}> */}
                                <div className={`grid grid-cols-${viewMode ? '4' : '3'} gap-4 `}>
                                  {
                                    collections.map((collection: any, key) => {
                                      return (
                                        <CollectionCard key={key} collection={collection} id={collection.id} />
                                      )
                                    })
                                  }
                                </div>
                              </>
                            ) : (
                              <NoDataFound />
                            )
                          }
                        </>
                      ) : (
                        <NoDataFound>Loading...</NoDataFound>
                      )
                    }
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
