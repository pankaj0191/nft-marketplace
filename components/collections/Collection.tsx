import { useState, useEffect } from "react";
import Link from "next/link";

import { NoDataFound } from "../miscellaneous";
import { getCollections } from "services";
import { Filter } from "../nft";
import Card from './Card'
import { Metamask } from "context";


function Collection({ isUser = false }) {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<Boolean>(true);
  const { isAuthenticated, user }: any = Metamask.useContext();
  const currentUserId = user.id || "";


  useEffect(() => {
    (async () => {
      setIsLoading(true);
      var options: any = {};
      if (isUser) {
        options.createdBy = currentUserId;
      }
      const results = await getCollections(options);
      setCollections(results);
      setIsLoading(false);
    })();
  }, [isUser, currentUserId])

  const handleOnToggle = (bool: Boolean) => {
    setViewMode(bool);
  }

  return (
    <>

      <div className="dark:bg-[#09080d] bg-[#fff]">
        <section className="explore_section  pb-20 pt-10 px-14" >
          <div className="container-flui mx-auto ">
            <div className="lg:flex md-flex block flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-between mb-10">
              <h2 className="dark:text-white text-[#000] text-4xl font-semibold text-center" data-aos="zoom-in" data-aos-duration="3000">{isUser ? "My Collection" : "Collections"}</h2>
              {isAuthenticated && (
                <div className="editprofile_submit_btn ">
                  <Link href="/collections/create" className="editprofile_submit_btn " >
                    <a className="bg-blue-500 hover:bg-blue-700 text-white font-normal	 py-2 px-4 rounded-full">New Create</a>
                  </Link>
                </div>
              )}
            </div>
            <Filter onToggle={handleOnToggle} />
            <div className="explorepagegridlist_section ">
              {isLoading ? (
                <NoDataFound>Loading...</NoDataFound>
              ) : (
                <>
                  {
                    collections.length ? (
                      <>
                        <div className={`grid grid-cols-${viewMode ? '2' : '3'} `}>
                          {
                            collections.map((collection: any, key) => {
                              return (
                                <Card key={key} collection={collection} id={collection.id} />
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
    </>
  );
}

export default Collection;
