import { useState, FC } from 'react';

import { Filter, NFTCard } from './nft'
import NoDataFound from './miscellaneous/NoDataFound';

interface ExploreProps {
    explores: any[];
    isLoading: Boolean;
    useUpdated: Function;
}

const Explore: FC<ExploreProps> = ({ explores, isLoading, useUpdated }) => {
    const [viewMode, setViewMode] = useState<Boolean>(true);

    const handleOnToggle = (bool: Boolean) => {
        setViewMode(bool);
    }

    return (
        <div className="dark:bg-[#09080d] bg-[#fff]">
            <section className="explore_section  pb-20 pt-10 px-14" >
                <div className="container-flui mx-auto ">
                    <div className="lg:flex md-flex block flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-between mb-10">
                        <h2 className="dark:text-white text-[#000] text-4xl font-semibold text-center" data-aos="zoom-in" data-aos-duration="3000">Explores</h2>
                    </div>
                    <Filter onToggle={handleOnToggle} />
                    <div className="explorepagegridlist_section ">
                        {isLoading ? (
                            <NoDataFound>Loading...</NoDataFound>
                        ) : (
                            <>
                                {
                                    explores.length ? (
                                        <>
                                            <div className={`grid grid-cols-${viewMode ? '2' : '3'} `}>
                                                {
                                                    explores.map((nft, key) => {
                                                        return (
                                                            <div key={key}>
                                                                <NFTCard {...nft} useUpdate={useUpdated} />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </>
                                    ) : (
                                        <NoDataFound>No Item Found</NoDataFound>
                                    )
                                }
                            </>
                        )}
                    </div>
                </div>


            </section>

        </div>
    )
}

export default Explore;