import React from "react";


const SkeletonArtistsList = () => {
    return (
        <>


            <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1 skeletonforartists">
                <div className="px-4 py-3 lg:w-full md:w-full w-4/5	mx-auto">
                    <div className="animate-pulse">
                <div className="border border-blue-300 dark:border-[#16151a]  shadow -md p-3 w-full dark:bg-[#16151a] lg:flex md:flex block items-center lg:rounded-full md:rounded-full rounded-lg  ">
                    {/* <div className="animate-pulse "> */}

                    <div className="rounded-full bg-slate-200 dark:bg-[#48474c]  lg:h-16 lg:w-16  md:h-16 md:w-16   h-24 w-24	 "></div>

                    <div className="lg:pl-5 md:pl-5 pl-0">
                       <div className="bg-slate-200 dark:bg-[#48474c]  w-20 h-2 rounded lg:text-left md:text-left text-center  mt-4 skeletonforartists_heading"> </div>

                        <div className="bg-slate-200 dark:bg-[#48474c] w-32 h-2 mt-2  rounded"> </div>
                    </div>

                    {/* <div className="h-5 w-30 bg-slate-200 rounded"></div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded"></div>
                                </div> */}
                    {/* </div> */}
                </div>
                </div>
                </div>
            </div>



        </>
    )
}

export default SkeletonArtistsList;