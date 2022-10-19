import { GoLocation } from "react-icons/go";
import { BsPhone } from "react-icons/bs";
import { GrMail } from "react-icons/gr";

export default function Contact() {
  return (
    <>
      <section className="createpage_section  pb-10 pt-20">
        <div className="container mx-auto ">
          <div className="pb-10 lg:flex md:flex block flex-row lg:space-x-10 md:space-x-10 space-x-0 lg:space-y-0 md:space-y-0 space-y-3 flex-row ">
            <div
              className="basis-1/3  getintouch_section_col "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="getintouch_section_column_box  py-6 px-4  bg-[#fff]  dark:bg-[#16151a] border dark:border-[#16151a] border-[#f1f1f1] rounded-lg  ">
                <div className="getintouch_section_column_box_icons text-[#fff] text-5xl">
                  <GoLocation />
                </div>

                <div className="getintouch_section_column_box_content py-3 ">
                  <h2 className="dark:text-white text-[#000]  font-bold	text-lg	py-3">
                    Address
                  </h2>
                  <p className="dark:text-[#acacac] text-[#969696] text-base">
                    Some City, Some Country
                  </p>
                </div>
              </div>
            </div>

            <div
              className="basis-1/3  getintouch_section_col"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="getintouch_section_column_box  py-6 px-4  bg-[#fff]  dark:bg-[#16151a] border dark:border-[#16151a] border-[#f1f1f1] rounded-lg  ">
                <div className="getintouch_section_column_box_icons text-[#fff] text-5xl">
                  <BsPhone />
                </div>

                <div className="getintouch_section_column_box_content py-3 ">
                  <h2 className="dark:text-white text-[#000]  font-bold	text-lg	py-3">
                    Phone
                  </h2>
                  <p className="dark:text-[#acacac] text-[#969696] text-base">
                    +99999 99999
                  </p>
                </div>
              </div>
            </div>

            <div
              className="basis-1/3  getintouch_section_col"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="getintouch_section_column_box  py-6 px-4  bg-[#fff]  dark:bg-[#16151a] border dark:border-[#16151a] border-[#f1f1f1] rounded-lg  ">
                <div className="getintouch_section_column_box_icons text-[#fff] text-5xl">
                  <GrMail />
                </div>

                <div className="getintouch_section_column_box_content py-3 ">
                  <h2 className="dark:text-white text-[#000] font-bold	text-lg	py-3">
                    Email
                  </h2>
                  <p className="dark:text-[#acacac] text-[#969696] text-base">
                    demo@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:flex md:flex block  flex-row justify-center pt-5 ">
          <div className="basis-2/12 "></div>
          <div
            className="basis-8/12  createpage_right_side lg:px-10 md:px-10 px-2 "
            data-aos="zoom-in"
            data-aos-duration="3000"
          >
            <div className="create_form lg:p-5 md:p-5 p-0">
              <form className="w-full  ">
                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:mb-5 md:mb-5 mb-2">
                  <div className=" px-3 mb-6 md:mb-0 mb-5">
                    <label
                      className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                      htmlFor="grid-city"
                    >
                      Name
                    </label>
                    <input
                      className="block shadow appearance-none w-full bg-transparent border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight   text-sm dark:text-white text-[#969696] "
                      id="username"
                      type="text"
                      placeholder="e. g. `Name`"
                    ></input>
                  </div>
                  <div className=" px-3 mb-6 md:mb-0 mb-5">
                    <label
                      className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                      htmlFor="grid-city"
                    >
                      E-mail
                    </label>
                    <input
                      className="block shadow appearance-none w-full bg-transparent border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight   text-sm dark:text-white text-[#969696]"
                      id="username"
                      type="email"
                      placeholder="e. g. `E-mail`"
                    ></input>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1  mb-5">
                  <div className=" px-3 mb-6 md:mb-0">
                    <label
                      className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                      htmlFor="grid-city"
                    >
                      Tel
                    </label>
                    <input
                      className="block shadow appearance-none w-full bg-transparent border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight   text-sm dark:text-white text-[#969696]"
                      id="tel"
                      type="tel"
                      placeholder="e. g. “After purchasing the product you can get item...”"
                    ></input>
                  </div>
                  <div className=" px-3 lg:mb-6 md:mb-6 mb-0 md:mb-0">
                    <label
                      className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                      htmlFor="grid-city"
                    >
                      City
                    </label>
                    <input
                      className="block shadow appearance-none w-full bg-transparent border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight   text-sm dark:text-white text-[#969696]"
                      id="username"
                      type="text"
                      placeholder="e. g. `city`"
                    ></input>
                  </div>
                </div>

                <div className="grid grid-cols-1 mb-5">
                  <div className=" px-3 mb-6 md:mb-0">
                    <label
                      className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                      htmlFor="grid-city"
                    >
                      Your Message
                    </label>
                    <textarea
                      className=" block shadow appearance-none w-full bg-transparent border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight   text-sm dark:text-white text-[#969696] "
                      id="exampleFormControlTextarea1"
                      rows={3}
                      placeholder="Your message"
                    ></textarea>
                  </div>
                </div>
                <div className="grid lg:grid-cols-4 lg:grid-cols-6 lg:grid-cols-1  mb-5 editprofile_submit_btn">
                  <button className="bg-blue-500 hover:bg-blue-700 rounded-full text-white font-bold py-3 px-6  bg-[#571a81]">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="basis-2/12 "></div>
        </div>
      </section>
    </>
  );
}
