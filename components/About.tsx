import React from "react";
import Image from "next/image";

function creator() {
  return (
    <>
      <section
        className="explore_section pt-20 "
        data-aos="zoom-in"
        data-aos-duration="3000"
      >
        <div className="container mx-auto">
          <div className="grid lg:pb-10 md:pb-10 pb-0  text-center ">
            <h2 className="dark:text-[#09080d] text-[#fff] font-bold lg:text-7xl  md:text-7xl  text-4xl aboutpage_nftheading">
              Nft Marketplace
            </h2>
            <p className="dark:text-[#acacac] text-[#969696] text-base	my-8 lg:mx-40  md:mx-10 mx-0">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industr standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.{" "}
            </p>
          </div>
        </div>
      </section>
      <section className="aboutpage_about_section">
        <div className="container mx-auto px-10 ">
          <div className="lg:flex md:flex block flex-row  ">
            <div className="basis-6/12 lg:pr-5 md:pr-5 pr-0 aboutpage_about_section_imgcol">
              <Image
                src="/images/about-us-banner-1.png"
                className="rounded-lg object-cover lg:pr-0 md:pr-0 pr-5 w-full"
                alt="my image"
                height="250px"
                width="300px"
              />
            </div>
            <div
              className="basis-6/12  createpage_right_side createpage_right_side_firstrow   px-0 flex flex-col justify-center items-start"
              data-aos="flip-left"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <h6 className="text-[#571a81] font-medium text-lg  text-left py-3">
                About Us
              </h6>

              <h2 className="dark:text-white text-[#000] font-medium lg:text-6xl md:text-4xl text-2xl	 py-3">
                Helping You Grow In Every Stage.
              </h2>
              <p className="dark:text-[#acacac] text-[#969696] text-base lg:mt-10 md:mt-5 mt-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
          <div className="lg:flex md:flex block flex-row mt-5 ">
            <div
              className="basis-6/12  createpage_right_side lg:pr-4  px-0 flex flex-col justify-center items-start"
              data-aos="flip-left"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <h2 className="dark:text-white text-[#000] font-medium createpage_right_side_smallheading py-3">
                Creating a <br/>Web3 Community <br/> and Culture.
              </h2>
              <p className="dark:text-[#acacac] text-[#969696] text-base createpage_right_side_smalltext lg:mt-10 md:mt-5 mt-0">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
              </p>
            </div>
            <div className="basis-6/12 lg:pr-5 md:pr-5 pr-0 aboutpage_about_section_imgcol">
              <Image
                src="/images/about-us-banner-2.gif"
                className="rounded-lg object-cover lg:pr-0 md:pr-0 pr-5 w-full"
                alt="my image"
                height="250px"
                width="300px"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="aboutcreate_section mt-20 pb-20 pt-0">
        <div className="container mx-auto ">
          <div className="lg:flex md:flex block lg:space-x-10 md:space-x-10 space-x-0 lg:space-y-0 md:space-y-0  space-y-10">
            <div
              className="lg:basis-4/12 md:basis-6/12  aboutcreate_section_col dark:bg-[#16151a] bg-[#f3f3f3] rounded-lg "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="aboutcreate_section_column_box  py-6 lg:px-10 md:px-3  px-2   rounded-lg  ">
                <div className="aboutcreate_section_column_box_content py-3 ">
                  <Image
                    src="/images/how-to-create-section-1.png"
                    className="rounded-lg object-cover w-24"
                    alt="my image"
                    height="250px"
                    width="300px"
                  />
                  <h2 className="dark:text-white text-[#000] font-medium text-lg  py-3">
                    Set up you nft
                  </h2>
                  <p className="dark:text-[#acacac] text-[#969696] text-base">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry
                    standard dummy text
                  </p>
                </div>
              </div>
            </div>
            <div
              className="lg:basis-4/12 md:basis-6/12  aboutcreate_section_col dark:bg-[#16151a] bg-[#f3f3f3]  rounded-lg "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="aboutcreate_section_column_box  py-6 lg:px-10 md:px-3  px-2   rounded-lg  ">
                <div className="aboutcreate_section_column_box_content py-3 ">
                  <Image
                    src="/images/how-to-create-section-2.png"
                    className="rounded-lg object-cover w-24"
                    alt="my image"
                    height="250px"
                    width="300px"
                  />
                  <h2 className="dark:text-white text-[#000] font-medium text-lg  py-3">
                    Set up you nft
                  </h2>
                  <p className="dark:text-[#acacac] text-[#969696]  text-base">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry
                    standard dummy text{" "}
                  </p>
                </div>
              </div>
            </div>
            <div
              className="lg:basis-4/12 md:basis-6/12 aboutcreate_section_col dark:bg-[#16151a] bg-[#f3f3f3]  rounded-lg "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="aboutcreate_section_column_box  py-6 lg:px-10 md:px-3  px-2  rounded-lg">
                <div className="aboutcreate_section_column_box_content py-3 ">
                  <Image
                    src="/images/how-to-create-section-3.png"
                    className="rounded-lg object-cover w-24"
                    alt="my image"
                    height="250px"
                    width="300px"
                  />
                  <h2 className="dark:text-white text-[#000] font-medium text-lg  py-3">
                    Set up you nft
                  </h2>
                  <p className="dark:text-[#acacac] text-[#969696] text-base">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry
                    standard dummy text{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default creator;
