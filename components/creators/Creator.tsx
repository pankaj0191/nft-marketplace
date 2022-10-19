import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getUsers } from "../../services";
import { NoDataFound } from '../miscellaneous'
import { CreatorCard } from "components/card";

function Creator() {
    const [creators, setCreators] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const users = await getUsers();
            setCreators(users);
            setIsLoading(false);
        })();
    }, [])

    return (
        <>
            <section className=" lg:my-0 md:my-10 my-0  pb-20 px-14 py-20">
                <div className="container-fluid mx-auto">
                    <div className="broadband_section_flex  lg:flex md:flex block flex-wrap  ">
                        {isLoading ? (
                            <NoDataFound>Loading...</NoDataFound>
                        ) : creators.length ? (
                            <>
                                {
                                    creators.map((creator: any, key) => {
                                        return (
                                            <Link href={`/creators/${creator.id}`} passHref key={key}>
                                                <a
                                                    className="lg:basis-3/12  md:basis-1/2  broadband_section_col  p-2"
                                                    data-aos="fade-up"
                                                    data-aos-anchor-placement="top-bottom"
                                                    data-aos-delay="300"
                                                    data-aos-duration="2000"
                                                >
                                                    <CreatorCard creator={creator} id={creator.id} />
                                                </a>

                                            </Link>
                                        )
                                    })
                                }
                            </>
                        ) : (
                            <NoDataFound>No Creators Found</NoDataFound>
                        )
                        }

                    </div>
                </div>
            </section>
        </>
    );
}

export default Creator;
