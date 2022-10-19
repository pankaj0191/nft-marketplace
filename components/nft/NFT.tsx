import { MyNFT } from '../nft'
import Link from "next/link";

import { NoDataFound } from "../miscellaneous";
import { NftDataProps } from '@types';

interface NftProps {
  nfts: NftDataProps[];
  userId: Boolean | string;
}

function NFT({ nfts = [], userId = false }: NftProps) {


  return (
    <div className="dark:bg-[#09080d] bg-[#fff]">
      <section className="explore_section  pb-20 pt-20 lg:px-10 md:px-2 px-1" >
        <div className="container mx-auto">
          <div className="flex flex-row space-x-2 pb-10 justify-between">
            <h2 className="dark:text-white text-[#000] text-4xl font-semibold	text-center" data-aos="zoom-in" data-aos-duration="3000">My NFT</h2>
            <div className="editprofile_submit_btn ">
              <Link href="/nft/create" className="editprofile_submit_btn " >
                <a className="bg-blue-500 hover:bg-blue-700 text-white font-normal	 py-2 px-4 rounded-full">New Create</a>
              </Link>
            </div>

          </div>
          <div className="lg:flex md:flex block flex-wrap">
            {nfts.length ?
              nfts.map((nft: NftDataProps, key: number) => {
                return <MyNFT key={key} {...nft} />
              }) : (
                <NoDataFound>No NFT Found</NoDataFound>
              )
            }
          </div>
        </div>
      </section>

    </div>
  )

}

export default NFT;
