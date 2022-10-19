import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Avatar from "boring-avatars";

import { DvAvatar, NoDataFound } from '../miscellaneous';
import { getUsers } from 'services';
import { trimString, subString } from 'helpers'

function ArtistsList() {
    const [isLoading, setIsLoading] = useState(false);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        async function getArtists() {
            setIsLoading(true);
            let results = await getUsers({
                limit: 8,
                sortBy: "likes",
            });
            setArtists(results);
            setIsLoading(false);
        }
        getArtists();

    }, []);

    return (
        <section className=" artists_section lg:my-0 md:my-10 my-0  pb-10 pt-0 px-14 ">
            <div className="container-fluid mx-auto">

                <div className="lg:flex md-flex block flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-between mb-10">
                    <h2
                        className="dark:text-white text-[#000] lg:text-4xl md:text-4xl text-2xl mb-3 font-semibold	text-center"
                        data-aos="zoom-in"
                        data-aos-duration="3000"
                    >Featured Artists</h2>
                </div>

                {/* <div className="lg:flex broadband_section_flex  md:flex block flex-row lg:space-x-4 md:space-x-4 space-x-0 lg:space-y-0 md:space-y-0 space-y-3"> */}
                {isLoading ? (
                    <NoDataFound>Loading...</NoDataFound>
                ) : (
                    <>
                        {
                            artists.length ? (
                                <div className="broadband_section_flex grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-1 ">
                                    {
                                        artists.map((artist: any, key) => {
                                            const index = key > 9 ? key + 1 : `0${key + 1}`;
                                            const name = artist.name;
                                            const username = artist.username;
                                            return (
                                                <Link href={`/creators/${artist.id}`} passHref key={key}>
                                                    <a
                                                        className="  broadband_section_col"
                                                        data-aos="fade-up"
                                                        data-aos-anchor-placement="top-bottom"
                                                        data-aos-delay="300"
                                                        data-aos-duration="2000"
                                                    >
                                                        <div className="flex  artists_section_col">
                                                            <div className="featuredartists_number">
                                                                <h2 className="dark:text-white text-[#000] font-semibold	text-lg	">{index}</h2>
                                                            </div>
                                                            <div className="broadband_section_column_box_image">
                                                                <div className="artistss_img">
                                                                    <DvAvatar
                                                                      imageAlt="Artist Image"
                                                                      imageSize={{
                                                                        height: "75px",
                                                                        width: "75px"
                                                                      }}
                                                                      imageUrl={artist.image}
                                                                      size={75}
                                                                      name={artist.name || "noname"}
                                                                      colors={artist.colors}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="broadband_section_column_box_content  px-3 flex flex-col ite	">
                                                                <h2 className="dark:text-white text-[#000] font-semibold	text-lg	">{subString(name)}</h2>
                                                                <h6 className=" dark:text-white text-[#000] text-sm "> @{trimString(username)} </h6>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <NoDataFound />
                            )}
                    </>
                )}
            </div>
        </section >
    )
}

export default ArtistsList