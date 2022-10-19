import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { NoDataFound } from '../miscellaneous';
import { getCollections } from '../../services';
import { CollectionCard } from '../collections';

function FeaturedCollections() {
    const [collections, setCollections] = useState<any[]>([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const results = await getCollections({
                limit: 4
            });

            setCollections(results);
            setLoading(false);
        })();
    }, [])

    return (

        <section className=" lg:my-0 md:my-0 my-0  lg:mt-10 md:mt-0 mt-0  lg:pb-10 md:pb-0 pb-0 lg:pt-0 md:pt-10 pt-0  lg:px-14 md:px-5 px-5 featured_collection_section">
            <div className="container-fluid mx-auto">
                <div className="lg:flex md-flex block flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-between mb-10 homepage_maintitle">
                    <h2
                        className="dark:text-white text-[#000] lg:text-4xl md:text-4xl text-2xl mb-3 font-semibold	text-center"
                        data-aos="zoom-in"
                        data-aos-duration="3000"
                    >
                        Featured Collections
                    </h2>

                    <div
                        className="text-center mx-auto editprofile_submit_btn"
                        data-aos="zoom-in"
                        data-aos-duration="3000"
                    >
                        <Link href="/collections/all" passHref>
                            <button className=" hover:bg-blue-700 text-center mx-auto  dark:text-[#fff] text-[#fff] font-bold py-3 px-6 rounded-full bg-transparent">
                                See All
                            </button>
                        </Link>
                    </div>
                </div>


                <div className="lg:flex broadband_section_flex  md:flex block flex-row lg:space-x-4 md:space-x-4 space-x-0 lg:space-y-0 md:space-y-0 space-y-3">
                    {isLoading ? (
                        <NoDataFound>Loading...</NoDataFound>
                    ) : (
                        <>
                            {
                                collections.length ? (
                                    collections.map((collection, key) => {
                                        return (
                                            <CollectionCard collection={collection} key={key} id={collection.id} />
                                        )

                                    })
                                ) : (
                                    <NoDataFound />
                                )
                            }
                        </>

                    )}

                </div >
            </div >
        </section >
    )
}

export default FeaturedCollections