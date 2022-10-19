import React from "react";


const SkeletonBannercard = () => {
    return (
        <>


            <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1   lg:p-1 md:p-1 p-0 lg:px-10 md:px-10  px-0  mx-auto mt-5">
                <div className="h-96 w-80  mx-auto relative">
                    <div className="animate-pulse ">
                        <div className="">
                            <div className="bg-slate-200 dark:bg-[#16151a] h-96 w-80 rounded-xl"></div>

                        </div>
                        <div className=" ">
                            <div className="flex w-full px-3 justify-between items-center pb-3 mt-4 mx-auto absolute bottom-0 left-0" >
                                <div className="block">
                                    <div className="bg-slate-300 dark:bg-[#48474c] w-32 h-2  mt-2 mr-4 rounded"> </div>
                                    <div className="bg-slate-300 dark:bg-[#48474c] w-16 h-2  mt-2 mr-4 rounded"> </div>

                                </div>

                                <div className="flex items-endd">
                                    <div className="bg-slate-300 dark:bg-[#48474c] w-6 h-2  mt-2 rounded mr-2"> </div>
                                    <div className="bg-slate-300 dark:bg-[#48474c]w-6 h-2  mt-2 rounded "> </div>
                                </div>


                            </div>
                        </div>

                    </div>
                </div>
            </div>



        </>
    )
}

export default SkeletonBannercard;