import React from "react";


const Skeletonprofilebannerimage = () => {
    return (
        <>



            <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1  p-1">
                <div className="border border-blue-300 shadow rounded-md p-2 w-full  dark:border-[#16151a]  ">
                    <div className="animate-pulse ">
                        <div className="lg:h-72 md:h-40 h-40 w-100 bg-slate-200  dark:bg-[#48474c] rounded-lg"></div>




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

export default Skeletonprofilebannerimage;