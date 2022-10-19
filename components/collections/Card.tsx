import React, { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { subString, toCaptalize } from '../../helpers'

interface CollectionCardProps {
    collection: any;
    id: string;
}

const Card: FC<CollectionCardProps> = ({ collection, id }) => {
    if (!id) {
        return (
            <div>No Collection Found</div>
        )
    }

    return (
        <Link href={`/collections/${collection.id}`} passHref>
            <div
                className="lg:basis-3/12 md:basis-1/2 broadband_section_col featuredcollection_cards"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-delay="300"
                data-aos-duration="2000"
            >
                <div className="collection-boxes myprofile_onsale_column_box m-1 p-2  border-2 dark:border-[#16151a] rounded-lg dark:bg-[#16151a] bg-[#fff] cursor-pointer">
                    <div className="explore_section_column_box_image">
                        <div className="collection_banner_img">
                            <Image
                                src={collection.featuredImage || "/images/client-1.png"}
                                alt="Collection Featured Image"
                                className="object-cover w-full rounded-lg	hover:rounded-3xl"
                                height={300}
                                width={300}
                            />
                        </div>
                        <div className="myprofile_onsale_column_box_creator_name featuredcollection_smallimage flex items-center justify-center my-2 featuredcollection_image">
                            <div className="relative w-8 h-8 small-image">
                                <Image
                                    src={collection.image || "/images/boy-avater.png"}
                                    alt="Collection Image"
                                    className="rounded-full border border-gray-100 shadow-sm"
                                    height={300}
                                    width={300}
                                />
                            </div>

                        </div>
                    </div>
                    <h2 className="third-tab dark:text-[#fff]">{toCaptalize(collection.name)}</h2>
                    <h2 className="dark:text-[#707a83] text-[#707a83] text-sm">@{subString(collection.creator.username)}</h2>

                    <div className="myprofile_onsale_column_box_content  text-center pt-3 px-3">
                        <div className="myprofile_onsale_column_box_creator  flex  items-center justify-between pt-4">
                            <div className=" text-left">
                                <h6 className="volume dark:text-[#707a83] text-[#707a83] text-xs "><span>Vol. 7.3400</span> </h6>

                            </div>
                            <div className=" text-left">
                                <span className="dark:text-[#707a83] text-[#707a83] font-semibold text-xs "  >{collection.nftCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Card