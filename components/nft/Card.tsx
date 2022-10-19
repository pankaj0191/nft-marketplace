import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiFillHeart, AiFillEye, AiOutlineHeart } from "react-icons/ai";
import { FaEthereum } from "react-icons/fa";
import { subString, trimString } from "../../helpers";
import { GiToken } from "react-icons/gi";
import Tooltip from "@material-ui/core/Tooltip";
import DVAsset from "components/miscellaneous/DVAsset";
import Avatar from "boring-avatars";
import { saveNftLike, unLikeNft } from "services";
import { DvAvatar } from "components/miscellaneous";
import Buy from "./Buy";
import { Metamask, MetamaskContextResponse } from "context";
import { SITE_TOKEN } from "utils";

function Card(props: any) {
  const router = useRouter();
  const {
    image = "/images/portfolio-04.jpg",
    asset = {},
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
    isLiked = false,
    marketplace = {},
    category = {},
    onMarketPlace = false,
    useUpdate
  } = props;


  const [favourite, setFavourite] = useState<Boolean>(isLiked);
  const [nftLikes, setNftLikes] = useState<number>(parseInt(likeCount));

  const { login, isAuthenticated, user }: MetamaskContextResponse = Metamask.useContext();


  useEffect(() => {
    if (!id) {
      router.push('/discover');
    }
  }, [id, router])

  const handleLike = async (e: any) => {
    e.preventDefault();
    if(isAuthenticated) {
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
    } else {
      await login();
      return;
    }
  }

  const handleChangeUrl = (event: any) => {
    const isBuySection = event.target.closest('.nft-card-buy-section');
    if(isBuySection) {
      event.preventDefault();
    }
  }

  return (

    <>
      <Link 
        href={`/discover/${id}`} 
        passHref
      >
        <a
          className="mb-5"
          data-aos="flip-left"
          data-aos-anchor-placement="top-bottom"
          data-aos-delay="300"
          data-aos-duration="2000"
          onClick={handleChangeUrl}
        >
          <div className="myprofile_onsale_column_box m-1 p-2  border-2 dark:border-[#16151a] rounded-lg dark:bg-[#16151a] bg-[#fff] cursor-pointer">
            <div className="myprofile_onsale_viewsrow flex items-center justify-center border-t-1 border-[#707a83] pb-2">
              <div className=" flex items-center ">
                <AiFillEye />
                <h6 className=" dark:text-[#fff] text-[#000] ml-2 text-xs font-normal ">{viewCount} Views</h6>
              </div>
              <div className=" flex items-center ml-4" onClick={handleLike}>
                {favourite ? <AiFillHeart /> : <AiOutlineHeart />}
                <h6 className="dark:text-[#fff] text-[#000] ml-2 text-xs font-normal ">{nftLikes} Likes</h6>
              </div>
            </div>
            <div className="explore_section_column_box_image">
              <DVAsset
                type={asset.type}
                url={image || "/images/portfolio-04.jpg"}
                alt="Nft image"
                size={{
                  height:300,
                  width:300
                }}
              />

              {
                ownedBy ? (
                  <div className="myprofile_onsale_column_box_creator_name flex items-center justify-center my-2">
                    <div className="relative w-8 h-8">
                      <DvAvatar
                        imageAlt="My Image"
                        imageUrl={ownedBy.image}
                        name={ownedBy.name}
                        colors={ownedBy.colors}
                      />
                    </div>

                    <h6 className="ml-2 text-[#000] font-normal text-sm" title={ownedBy?.username || ""}>	@{trimString(ownedBy?.username, 2)} </h6>
                  </div>
                ) : ""
              }
            </div>
            <div className="myprofile_onsale_column_box_content relative text-center py-3 px-3">
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
                {/* <h2 className="dark:text-white text-[#000] font-normal	lg:text-lg md:text-sm sm:text-sm  mt-6">
                  <span title={title}>{subString(title,18)}</span> (<span title={collection.name}>{subString(collection.name, 13)}</span>)
                </h2> */}
              </div>

              <div className="myprofile_onsale_column_box_creator  flex  items-center justify-between border-t-1 border-[#707a83] pt-4">
                <div className="myprofile_onsale_column_box_creator_price text-left">
                  <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs font-normal uppercase">CREATED  BY </h6>
                  <span className="dark:text-[#fff] text-[#000] font-semibold text-xs flex "  >@{trimString(createdBy?.username)} </span>
                </div>
                {
                  price.eth > 0 && (
                    <div className="myprofile_onsale_column_box_creator_price text-left">
                      <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs font-normal uppercase">Current Price</h6>
                      <span className="dark:text-[#fff] text-[#000] font-semibold text-xs flex" >{price.eth} {SITE_TOKEN}</span>
                    </div>
                  )
                }
              </div>
              {
                onMarketPlace && ownedBy.id !== user.id && marketplace.action === "fixed_price" ? (
                  <div className="buy-btn-section hidden nft-card-buy-section">
                    <Buy nft={props} useUpdate={useUpdate} />
                  </div>
                ) : ""
              }
            </div>
          </div>
        </a>

      </Link>
    </>
  );
}

export default Card;
