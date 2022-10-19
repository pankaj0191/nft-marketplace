import React from "react";

const Skeletonprofileimage = () => {
    return (
        <>



            <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1  p-1">
                <div className="border border-blue-300 shadow rounded-full bg-[#fff] dark:bg-[#09080d] dark:border-[#16151a]  p-2 w-full ">
                    <div className="animate-pulse ">
                        <div className="lg:h-44 lg:w-44 md:h-32 md:w-32 h-32 w-32 bg-slate-200 dark:bg-[#48474c] rounded-full mx-auto "></div>




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

export default Skeletonprofileimage;