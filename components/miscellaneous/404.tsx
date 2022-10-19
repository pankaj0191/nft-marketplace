
import { useEffect, useState } from "react";
import Link from 'next/link'

function Four0Four() {

    return (
        <>
            <section className="error_page">
                <div className="container-fluid mx-auto text-center error_page_container">
                    <h1 className="text-[#fff] dark:text-[#09080d]">404</h1>
                    <h4 className="text-[#000] dark:text-[#fff]">oops! The page you requested was not found!</h4>
                    <p className="text-[#707a83] dark:text-[#fff]">The page you are looking for was moved, removed, renamed or might never existed.</p>

                    <div className="text-center mx-auto editprofile_submit_btn mt-6">
                        <Link href="/" passHref>
                            <a className="hover:bg-blue-700 text-center mx-auto dark:text-[#fff] text-[#fff] font-bold py-3 px-6 rounded-full ">BACK TO HOMEPAGE</a>
                        </Link>
                    </div>

                </div>
            </section>
        </>
    )
}

export default Four0Four