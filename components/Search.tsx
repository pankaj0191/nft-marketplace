import React, { useEffect, useState } from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { HiBadgeCheck } from "react-icons/hi";
import { Tooltip, Button } from "@nextui-org/react";
import Link from 'next/link'
import Image from "next/image";
import { FaUsers } from "react-icons/fa";
import { MdOutlineCollections } from "react-icons/md";

import { BsList } from "react-icons/bs";
import { getAllSearch } from '../services';
import { useRouter } from 'next/router';
import { NoDataFound } from './miscellaneous';
import { CollectionCard } from './collections';
import { NFTCard } from './nft';
import { CommonFilter } from './miscellaneous';


function Search() {
    const [viewMode, setViewMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [collections, setCollections] = useState([])
    const [nfts, setNfts] = useState([])
    const [users, setUsers] = useState([])

    const router = useRouter()
    const { keyword } = router.query;

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const results = await getAllSearch({
                keyword
            });
            setCollections(results.collections || []);
            setNfts(results.nfts || []);
            setUsers(results.users || []);
            setIsLoading(false);
        })();

    }, [keyword])

    const handleToggle = (bool: any) => {
        setViewMode(bool);
    }

    return (
        <div className="dark:bg-[#09080d] bg-[#fff]">
            <section className="pb-10 pt-14 lg:px-14 md:px-3 sm:px-2 searchpage_section" >
                <div className="container-fluid mx-auto">
                    <div className="lg:flex md-flex block flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-center mb-5">
                        <h2 className="dark:text-white text-[#000] text-4xl font-semibold text-center aos-init aos-animate" data-aos="zoom-in" data-aos-duration="3000">{`Search results for ${keyword ? `"${keyword}"` : "..."}`}  </h2>
                    </div>
                    <div className="">
                        <div
                            className="basis-12/12  myprofile_page_pr0file_row_image_content pt-10"
                            data-aos="fade-up"
                            data-aos-anchor-placement="top-bottom"
                            data-aos-delay="300"
                            data-aos-duration="2000"
                        >

                            <Tabs className="searchpage_tabs">
                                <TabList>
                                    <Tab><MdOutlineCollections />Collections</Tab>
                                    <Tab><BsList />Items</Tab>
                                    <Tab><FaUsers />Creators</Tab>
                                </TabList>

                                <TabPanel className="searchpage_tabs_panel">
                                    <CommonFilter onToggle={handleToggle} />
                                    <div className="container-fluid mx-auto  ">
                                        {
                                            !isLoading ? (
                                                <>
                                                    {
                                                        collections.length ? (
                                                            <>
                                                                <div className={`grid grid-cols-${viewMode ? '4' : '3'} gap-4 `}>
                                                                    {
                                                                        collections.map((collection: any, key: number) => {
                                                                            return (
                                                                                <Link href={`/collections/${collection.id}`} key={key} passHref>
                                                                                    <CollectionCard collection={collection} id={collection.id} />
                                                                                </Link>
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
                                <TabPanel className="searchpage_tabs_panel">
                                    <CommonFilter onToggle={handleToggle} />
                                    <div className="container-fluid mx-auto  ">
                                        {
                                            !isLoading ? (
                                                <>
                                                    {
                                                        nfts.length ? (
                                                            <>
                                                                <div className={`grid grid-cols-${viewMode ? '4' : '3'} gap-4 `}>
                                                                    {
                                                                        nfts.map((nft: any, key: number) => {
                                                                            return <NFTCard key={key} {...nft} />
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



                                <TabPanel className="searchpage_tabs_panel">
                                    <CommonFilter onToggle={handleToggle} />
                                    <div className="container-fluid mx-auto  ">
                                        {
                                            !isLoading ? (
                                                <>
                                                    {
                                                        users.length ? (
                                                            <div className={`grid grid-cols-${viewMode ? '4' : '3'} gap-4 `}>
                                                                {
                                                                    users.map((user: any, key: number) => {
                                                                        return (
                                                                            <Link href="#" passHref key={key}>
                                                                                <div
                                                                                    className=" broadband_section_col"
                                                                                    data-aos="fade-up"
                                                                                    data-aos-anchor-placement="top-bottom"
                                                                                    data-aos-delay="300"
                                                                                    data-aos-duration="2000"
                                                                                >
                                                                                    <div className="broadband_section_column_box  border dark:border-gray-800 dark:border-[#16151a] border-[#6b6e6f33] bg-[#fff] dark:bg-[#16151a] border-2 rounded-xl	 cursor-pointer transition ease-in-out px-5 py-5 ">
                                                                                        <div className="broadband_section_column_box_image">
                                                                                            <div className="broadband_section_column_box_bannerimage">
                                                                                                <Image
                                                                                                    src={user.banner || "/images/client-1.png"}
                                                                                                    className=" "
                                                                                                    alt="my image"
                                                                                                    height="400px"
                                                                                                    width="400px"
                                                                                                />
                                                                                            </div>

                                                                                            <div className="broadband_section_column_box_smallimage">
                                                                                                <Image
                                                                                                    src={user.image || "/images/client-1.png"}
                                                                                                    className="rounded-lg  w-24 h-24  border border-[#fff] border-3 border-[#fff]"
                                                                                                    alt="my image"
                                                                                                    height="70px"
                                                                                                    width="70px"
                                                                                                />
                                                                                            </div >

                                                                                        </div >

                                                                                        <div className="broadband_section_column_box_content  pt-5 px-3 flex-col flex align-center justify-center w-full	">
                                                                                            <h2 className="dark:text-white text-[#000] font-semibold	text-lg	home-collection_heading_badge flex items-center">
                                                                                                {user.name ?? "Demo User"}
                                                                                                <Tooltip content={"Verified"} rounded color="primary" placement="rightEnd">
                                                                                                    <Button auto flat>

                                                                                                        <HiBadgeCheck />
                                                                                                    </Button>
                                                                                                </Tooltip>


                                                                                            </h2>
                                                                                            <h6 className=" dark:text-white text-[#000] text-sm ">
                                                                                                <Link href=""><a>{user.username ?? "demo123"}</a></Link>
                                                                                            </h6>
                                                                                            <div className=" broadband_section_column_box_followers flex  items-center justify-between border-t-1 border-[#707a83] py-4">
                                                                                                <div className=" text-left">
                                                                                                    <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs "><strong>Vol. </strong>7.3400 </h6>

                                                                                                </div>


                                                                                                <div className=" text-left">
                                                                                                    <h6 className=" dark:text-[#707a83] text-[#571a81] text-xs font-bold"> +0.00% </h6>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div >
                                                                                </div >

                                                                            </Link>
                                                                        )
                                                                    })
                                                                }
                                                            </div>

                                                        ) : (
                                                            <NoDataFound />
                                                        )
                                                    }
                                                </>
                                            ) : (
                                                <NoDataFound>Loading...</NoDataFound>
                                            )
                                        }
                                    </div >
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>

                </div>
            </section >
        </div >
    )
}

export default Search