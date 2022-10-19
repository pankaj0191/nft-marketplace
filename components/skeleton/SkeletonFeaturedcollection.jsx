import React from "react";


const SkeletonTrendingNfts = () => {
    return (
        <>
         

        
<div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1  p-1"> 
                    <div className="border border-blue-300 dark:border-[#16151a]  dark:bg-[#16151a] shadow rounded-md p-2 w-full ">
                        <div className="animate-pulse ">
                        <div className="h-32 w-100 bg-slate-200 dark:bg-[#48474c]  rounded-lg"></div>

                                <div className="bg-slate-200 dark:bg-[#48474c] w-32 h-2 mt-5 mb-4 rounded mx-auto"> </div>
                                <div className="bg-slate-200 dark:bg-[#48474c] w-20 h-2 rounded  mx-auto"> </div>

                                <div className="flex justify-between items-center pb-3 mt-4 mx-auto" >
                                     <div className="bg-slate-200 dark:bg-[#48474c] w-10 h-2  mt-2 mr-4 rounded"> </div>
                                     <div className="bg-slate-200 dark:bg-[#48474c] w-10 h-2  mt-2 rounded "> </div>

                                </div>
                                {/* <div className="h-5 w-30 bg-slate-200 rounded"></div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded"></div>
                                </div> */}
                        </div>
                    </div>
                    </div>


                
        </>
    )
}

export default SkeletonTrendingNfts;