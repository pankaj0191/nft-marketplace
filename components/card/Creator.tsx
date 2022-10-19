import React, { FC } from 'react'
import Image from 'next/image'
import creator from 'components/About'
import Avatar from 'boring-avatars';
import { getColors } from 'helpers';
import { BiPlus } from 'react-icons/bi';

interface CreatorProps {
    creator: any;
    id: string
}

const Creator: FC<CreatorProps> = ({ creator, id }) => {

    const handleFollow = (userId: string) => {
        console.log(userId)
    }

    if (!id) {
        return (
            <div>No Creator Found</div>
        )
    }

    return (
        <div className="broadband_section_column_box  border dark:border-gray-800 dark:border-[#16151a] border-[#6b6e6f33] bg-[#fff] dark:bg-[#16151a] border-2 rounded-xl	 cursor-pointer transition ease-in-out px-5 py-5 ">
            <div className="broadband_section_column_box_image">
                <div className="broadband_section_column_box_bannerimage">
                    {
                        creator.banner ? (
                            <Image
                                src={creator.banner}
                                className=" "
                                alt="my image"
                                height="400px"
                                width="400px"
                            />
                        ) : (
                            <div className=" profile_dummybg"></div>
                        )
                    }
                </div>

                <div className="broadband_section_column_box_smallimage">
                    {
                        creator.image ? (
                            <Image
                                src={creator.image}
                                className="rounded-full rounded-lg  w-24 h-24  border border-[#fff] border-3 border-[#fff]"
                                alt="my image"
                                height="70px"
                                width="70px"
                            />
                        ) : (
                            <Avatar
                                size={200}
                                name={creator.name || "noname"}
                                variant="marble"
                                colors={creator.colors || getColors()}
                            />
                        )
                    }
                </div>

            </div>

            <div className="broadband_section_column_box_content  pt-5 px-3 flex-col flex align-center justify-center w-full	">
                <h2 className="dark:text-white text-[#000] font-semibold	text-lg	">{creator.name}</h2>
                <h6 className=" dark:text-[#fff] text-sm "> @{creator.username} </h6>
                <div className=" broadband_section_column_box_followers flex  items-center justify-between border-t-1 border-[#707a83] py-4">
                    <div className=" text-left">
                        <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs "><strong>{creator.ownedNftCount + creator.createdNftCount} </strong>Creations </h6>

                    </div>

                    <div className=" text-left">
                        <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs "><strong>{creator.followers}</strong> Followers </h6>
                    </div>
                </div>
                <div className="myprofile_onsale_column_box_end_btn mt-2 ">
                    <button
                        className="bg-blue-500  rounded-full w-full text-white text-xs font-medium flex justify-center align-center	 py-3 px-6 bg-[#571a81]"
                        onClick={(event) => {
                            event.preventDefault();
                            handleFollow(creator.id)
                        }}
                    > FOLLOW <BiPlus /> </button>
                </div>
            </div>
        </div>
    )
}

export default Creator