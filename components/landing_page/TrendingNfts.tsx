import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper";

import { NoDataFound } from "../miscellaneous";
import { NFTCard } from "../nft";
import { getAllItems } from "../../services";

import "swiper/css/navigation";

const TrendingNfts = () => {
    const [nfts, setNfts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [updated, setUpdated] = useState(false);




    useEffect(() => {
        (async () => {
            const results = await getAllItems({
                limit: 20,
                sort: { "createdAt": -1 },
                status: "publish,on_sale"
            });
            setNfts(results);
            setIsLoading(false);
        })();
    }, [])

    return (
        <>
            <section className="explore_section trending-auction-card lg:pb-10  md:pb-10  pb-10  lg:pt-20  md:pt-20  lg:px-14 md:px-3 sm:px-2  pt-10 dark:bg-[#09080d] bg-[#fff]">
                <div className="container-fluid mx-auto  ">
                    <div className="lg:flex md-flex block flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-between mb-10">
                        <h2
                            className="dark:text-white text-[#000] lg:text-4xl md:text-4xl text-2xl mb-3 font-semibold	text-center homepage_maintitle"
                            data-aos="zoom-in"
                            data-aos-duration="3000"
                        >
                            New NFTs
                        </h2>
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
                    <div className="trending-nfts">
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
                                                    <NFTCard {...nft} useUpdate={() => [updated, setUpdated]} />
                                                </SwiperSlide>
                                            );
                                        })
                                    }
                                </Swiper>                            </div>
                        ) : (
                            <NoDataFound />
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default TrendingNfts;