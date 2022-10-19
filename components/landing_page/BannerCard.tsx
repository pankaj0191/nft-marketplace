import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillEye, AiFillHeart } from "react-icons/ai";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from 'swiper';

// import required modules
import { EffectCards } from "swiper";

import { subString } from "../../helpers";
import { getAllItems } from "../../services";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/lazy";

export default function BannerCard() {
    const [nfts, setNfts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    SwiperCore.use([Autoplay])

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const results = await getAllItems({
                limit: 4
            });
            setNfts(results);
            setIsLoading(false);
        })();
    }, [])

    return (
        <>
            <Swiper
                effect={"cards"}
                autoplay={true}
                grabCursor={true}
                loop={nfts.length > 1 ? true : false}
                lazy={true}
                modules={[EffectCards]}
                className="mySwiper"
            >
                {
                    isLoading ? (
                        <div className="swiper-lazy-preloader ">
                            <Image
                                src="/banner-img4.png"
                                className=" "
                                alt="my image"
                                height="400px"
                                width="400px"
                            />
                        </div>
                    ) : (
                        nfts.length ? (nfts.map((nft, key) => {
                            const title = nft.title;
                            const image = nft.image || "/images/banner03.jpg";
                            const views = nft.viewCount || 0;
                            const likes = nft.likeCount || 0;
                            const ownedBy = nft.ownedBy.username ? nft.ownedBy.username : nft.createdBy.username;
                            return <SwiperSlide key={key}>
                                <Link href={`/discover/${nft.id}`} passHref>
                                    <div className="banner">
                                        <Image
                                            src={image}
                                            className=""
                                            alt="my image"
                                            height="500px"
                                            width="500px"
                                        />
                                        <div className="banner_content">
                                            <div className="banner_content_box">
                                                <div className="banner_content_title">
                                                    <h2 className="dark:text-white text-[#000] font-semibold text-lg	">{subString(title, 40)}</h2>
                                                </div>
                                                <div className="banner_content_user flex justify-between" >
                                                    <h5 className=" text-[#fff] dark:text-white text-xs font-normal"> @{subString(ownedBy, 15)} </h5>
                                                    <div className=" flex items-center ml-5">
                                                        <div>
                                                            <p className=" dark:text-[#fff] text-[#fff] ml-4 text-xs "><AiFillEye /> {views} </p>
                                                        </div>
                                                        <div>
                                                            <p className=" dark:text-[#fff] text-[#fff] text-xs "><AiFillHeart /> {likes} </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        })) : (
                            <SwiperSlide>
                                <div className="banner">
                                    <Image
                                        src="/images/banner03.jpg"
                                        className=""
                                        alt="my image"
                                        height="500px"
                                        width="500px"
                                    />
                                    <div className="banner_content">
                                        <div className="banner_content_box">
                                            <div className="banner_content_title">
                                                <h2 className="dark:text-white text-[#000] font-semibold text-lg	">
                                                    Dummy Nft
                                                </h2>
                                            </div>
                                            <div className="banner_content_user flex justify-between " >
                                                <h5 className=" dark:text-[#000] text-xs font-normal"> @noel_meon.. </h5>
                                                <div className=" flex items-center ml-5">
                                                    <div>
                                                        <p className=" dark:text-[#fff] text-[#fff] ml-4 text-xs "><AiFillEye /> 26 </p>
                                                    </div>
                                                    <div>
                                                        <p className=" dark:text-[#fff] text-[#fff] text-xs "><AiFillHeart /> 26 </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        )
                    )
                }
            </Swiper >
        </>
    );
}
