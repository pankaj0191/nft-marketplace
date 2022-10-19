import React from 'react'
import Link from 'next/link'

import { NoDataFound } from "../miscellaneous";
import Auction from "../card/Auction";

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper";
import { getAllItems } from '../../services';

import "swiper/css/navigation";
import { NftDataProps } from '@types';



function TrendingAuctions() {

    const [nfts, setNfts] = useState<NftDataProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const results = await getAllItems({
                limit: 20,
                auction: true,
                trending: true
            });
            setNfts(results);
            setIsLoading(false);
        })();
    }, [])

    return (
        <section className="explore_section  trending-auction-card   lg:pb-0  md:pb-20  pb-20  lg:pt-10  md:pt-20  pt-0 lg:px-14 md:px-3 sm:px-2   dark:bg-[#09080d] bg-[#fff]" id="Trendingautcion_section">
            <div className="container-fluid mx-auto  ">
                <div className="lg:flex md-flex block flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-between mb-10 homepage_maintitle">
                    <h2
                        className="dark:text-white text-[#000] lg:text-4xl md:text-4xl text-2xl mb-3 font-semibold	text-center"
                        data-aos="zoom-in"
                        data-aos-duration="3000"
                    >Trending Auctions</h2>
                    <div
                        className="text-center mx-auto editprofile_submit_btn"
                        data-aos="zoom-in"
                        data-aos-duration="3000"
                    >
                        <Link href="/discover" passHref>
                            <button className=" hover:bg-blue-700 text-center mx-auto  dark:text-[#fff] text-[#fff] font-bold py-3 px-6 rounded-full bg-transparent">
                                See All
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="auction">

                    {isLoading ? (
                        <NoDataFound>Loading...</NoDataFound>
                    ) : nfts.length ? (
                        <div className="auction">

                            <Swiper
                                slidesPerView={4}
                                spaceBetween={0}
                                freeMode={true}
                                navigation={true}
                                autoplay={false}
                                loop={nfts.length > 4 ? true : false}
                                modules={[Navigation, FreeMode]}

                                className="mySwiper"
                                breakpoints={{
                                    767: {
                                        slidesPerView: 1,
                                        spaceBetween: 0,
                                    },
                                    768: {
                                        slidesPerView: 2,
                                        spaceBetween: 0,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        spaceBetween: 0,
                                    },
                                }}
                            >
                                {
                                    nfts.map((nft, key) => {
                                        return (
                                            <SwiperSlide key={key}>
                                                <Auction nft={nft} />
                                            </SwiperSlide>

                                        );
                                    })
                                }
                            </Swiper>
                        </div>
                    ) : (
                        <NoDataFound />
                    )}

                </div>
            </div>
        </section >
    )
}

export default TrendingAuctions