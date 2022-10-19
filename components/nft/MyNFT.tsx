import Image from "next/image";
import Link from "next/link";
import { trimString } from "../../helpers";
import { AiFillHeart, AiFillEye } from "react-icons/ai";
import { NoDataFound } from "../miscellaneous";
import { SITE_TOKEN } from "utils";

function MyNFT(props: any) {
  const {
    id = "",
    description = "",
    image = "/images/portfolio-04.jpg",
    title,
    price = { eth: '0.00', dollar: '0.00' },
    likeCount = 0,
    viewCount = 0,
    ownedBy = false,
    createdBy = {},
    collected = false
  } = props;

  if (!id) {
    return (
      <NoDataFound />
    )
  }

  return (
    <Link href={`/discover/${id}`} passHref>
      <div
        className="basis-3/12 myprofile_onsale_col m-1 mb-5"
        data-aos="flip-left"
        data-aos-anchor-placement="top-bottom"
        data-aos-delay="300"
        data-aos-duration="2000"
      >
        <div className="myprofile_onsale_column_box border-2 dark:border-[#16151a] rounded-lg  cursor-pointer pb-3">
          <div className="explore_section_column_box_image text-center">
            <Image
              src={image}
              className="text-center w-full  border border-[#ffffff14] border-3"
              alt="my image"
              height={300}
              width={300}
            />
          </div>
          <div className="myprofile_onsale_column_box_content  text-center ">
            <div className="myprofile_onsale_column_box_content_headingrow flex justify-center">
              <h2 className="dark:text-white text-[#000] font-normal	 text-xl  text-center  ">
                {title}
              </h2>
            </div>
            <p className="dark:text-[#acacac]  text-[#969696] text-center text-sm my-3 lg:px-1 md:px-1 px-3">
              {description.length > 25 ? description.substring(0, 22) + "..." : description}
            </p>
            <div className="myprofile_onsale_column_box_content  text-center py-3 px-3">
              <div className="myprofile_onsale_column_box_creator  flex  items-center justify-between border-t-1 border-[#707a83] pt-4">
                <div className="myprofile_onsale_column_box_creator_price text-left">
                  <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs font-normal capitalize">{collected ? "created By" : "owned By"}</h6>
                  <span className="dark:text-[#fff] text-[#000] font-semibold text-xs flex mt-1"  >
                    {
                      collected ? `@${trimString(createdBy.username)}` : ownedBy ? `@${trimString(ownedBy.username)}` : "you"
                    }
                  </span>
                </div>
                {
                  price.eth ? (
                    <div className="myprofile_onsale_column_box_creator_price text-left">
                      <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs font-norma uppercasel">Current Price </h6>
                      <span className="dark:text-[#fff] text-[#000] font-semibold text-xs flex mt-1" >
                        {parseFloat(price.eth).toFixed(4)} {SITE_TOKEN}
                      </span>
                    </div>
                  ) : ""
                }
              </div>
              <div className="myprofile_onsale_column_box_creator myprofile_onsale_viewsrow  flex  items-center justify-center border-t-1 border-[#707a83] pt-3">
                <div className=" flex items-center">
                  <AiFillEye />
                  <h6 className=" dark:text-[#fff] text-[#000] ml-2 text-xs font-normal">{viewCount} Views</h6>
                </div>
                <div className=" flex items-center ml-4">
                  <AiFillHeart color="#fff" />
                  <h6 className="dark:text-[#fff] text-[#000] ml-2 text-xs font-normal ">{likeCount} Likes</h6>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MyNFT;
