
import { DvAvatar, DVCountDown } from "components/miscellaneous";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import Countdown from "react-countdown";
import { AiFillHeart, AiFillEye, AiOutlineHeart } from "react-icons/ai";
import { FaEthereum } from "react-icons/fa";
import Tooltip from "@material-ui/core/Tooltip";
import { saveNftLike, unLikeNft } from "services";
import { subString, trimString } from "helpers";
import { SITE_TOKEN } from "utils";

interface AuctionProps {
    nft: any;
}

const Auction: FC<AuctionProps> = ({ nft }) => {
    const {
        image = "/images/portfolio-04.jpg",
        title,
        price = {
            eth: "0.00",
            dollar: "0.00"
        },
        id = "",
        likeCount = 0,
        viewCount = 0,
        ownedBy = false,
        createdBy = {},
        collection = {},
        category = {},
        isLiked = false,
        marketplace
    } = nft;

    const [favourite, setFavourite] = useState<Boolean>(isLiked);
    const [nftLikes, setNftLikes] = useState<number>(parseInt(likeCount));

    const handleLike = async (e: any) => {
        e.preventDefault();
        if (!favourite) {
            const result = await saveNftLike(id);
            if (result.status === "success") {
                setFavourite(true);
                setNftLikes(nftLikes + 1);
            }
        } else {
            const result = await unLikeNft(id);
            if (result.status === "success") {
                setFavourite(false)
                setNftLikes(nftLikes - 1)
            }
        }
    }

    return (
        <Link href={`/discover/${nft.id}`}>
            <a
                className=" myprofile_onsale_col mb-5"
                data-aos="flip-left"
                data-aos-anchor-placement="top-bottom"
                data-aos-delay="300"
                data-aos-duration="2000"
            >
                <div className="myprofile_onsale_column_box m-1 p-2  border-2 dark:border-[#16151a] rounded-lg 	 dark:bg-[#16151a] bg-[#fff] cursor-pointer">
                    <div className="explore_section_column_box_image">
                        <Image
                            src={image}
                            className=" object-cover w-full rounded-lg	hover:rounded-3xl"
                            alt="my image"
                            height="300px"
                            width="300px"
                        />

                        <div className="myprofile_onsale_column_box_creator_name flex items-center justify-center my-2">
                            <div className="relative w-8 h-8">
                                <DvAvatar
                                    imageAlt="My Image"
                                    imageUrl={ownedBy.image}
                                    name={ownedBy.name}
                                    colors={ownedBy.colors}
                                />
                            </div>

                            <h6 className="ml-2 text-[#000] font-normal text-sm">	@{trimString(ownedBy.username)} </h6>
                        </div>
                    </div>
                    <div className="myprofile_onsale_column_box_content  text-center py-3 px-3">
                        <div className="myprofile_onsale_column_box_content_headingrow flex  items-center justify-between ">
                            <Tooltip title={title}>
                                <h2 className="dark:text-white text-[#000] font-normal	lg:text-lg md:text-sm sm:text-sm  mt-6">
                                    {subString(title)}
                                </h2>
                            </Tooltip>
                            <Tooltip title="Category">
                                <h2 className="dark:text-white text-[#000] font-normal	lg:text-lg md:text-sm sm:text-sm  mt-6">
                                    ({category.name})
                                </h2>
                            </Tooltip>
                        </div>
                        <div className="myprofile_onsale_column_box_creator  border-t-1 border-[#707a83] pt-4">


                            <div className="flex  items-center justify-between ">
                                <div className="myprofile_onsale_column_box_creator_price text-left">
                                    <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs font-normal">CURRENT BID </h6>
                                    <span className="dark:text-[#fff] text-[#000] font-semibold text-xs flex "  >{parseFloat(marketplace.data.minBid.eth)} {SITE_TOKEN}</span>
                                </div>
                                <div className="myprofile_onsale_column_box_creator_price text-left">
                                    <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs font-normal">CREATED BY </h6>
                                    <span className="dark:text-[#fff] text-[#000] font-semibold text-xs flex "  > @{trimString(createdBy.username)}</span>
                                </div>
                            </div>

                            {/* <div className="flex  items-center justify-between  auctioncountdown_div">
                                <div className="auction_countdown text-center">
                                    <h6 className=" dark:text-[#fff] text-[#fff] text-xs font-normal">30</h6>
                                    <span className="dark:text-[#fff] text-[#fff] font-semibold text-xs flex "  >DAYS</span>
                                </div>

                                <div className="auction_countdown text-center">
                                    <h6 className=" dark:text-[#fff] text-[#fff] text-xs font-normal">30</h6>
                                    <span className="dark:text-[#fff] text-[#fff] font-semibold text-xs flex "  >DAYS</span>
                                </div>

                                <div className="auction_countdown text-center">
                                    <h6 className=" dark:text-[#fff] text-[#fff] text-xs font-normal">30</h6>
                                    <span className="dark:text-[#fff] text-[#fff] font-semibold text-xs flex "  >DAYS</span>
                                </div>

                                <div className="auction_countdown text-center">
                                    <h6 className=" dark:text-[#fff] text-[#fff] text-xs font-normal">30</h6>
                                    <span className="dark:text-[#fff] text-[#fff] font-semibold text-xs flex "  >DAYS</span>
                                </div>

                            </div> */}
                            <DVCountDown date={marketplace.data.endDate} />


                        </div>
                        <div className="myprofile_onsale_column_box_creator myprofile_onsale_viewsrow  flex  items-center justify-center border-t-1 border-[#707a83] pt-3">
                            <div className=" flex items-center ">
                                <AiFillEye />
                                <h6 className=" dark:text-[#fff] text-[#000] ml-2 text-xs font-normal">{viewCount} Views</h6>
                            </div>
                            <div className=" flex items-center ml-4" onClick={handleLike}>
                                {favourite ? <AiFillHeart /> : <AiOutlineHeart />}
                                <h6 className="dark:text-[#fff] text-[#000] ml-2 text-xs font-normal ">{nftLikes} Likes</h6>
                            </div>

                        </div>



                    </div>


                </div>
            </a>
        </Link>
    )
}

export default Auction;