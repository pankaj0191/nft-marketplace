import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { AiFillEye, AiFillHeart } from "react-icons/ai";


// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";
import Image from "next/image";
import SwiperCore, { Autoplay } from 'swiper';


// import required modules
import { EffectCards } from "swiper";

export default function App() {
  SwiperCore.use([Autoplay])

  return (
    <>
      <Swiper
        effect={"cards"}
        autoplay={true}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="banner">
            <Image
              src="/images/banner03.jpg"
              className=""
              alt="my image"
              height="500px"
              width="500px"
            />

            <div className="banner_content">
              <div className="banner_content_box">
                <div className="banner_content_title">
                  <h2 className="dark:text-white text-[#000] font-semibold	text-lg	">
                    Sally Fadel
                  </h2>
                </div>
                <div className="banner_content_user flex justify-between " >

                  <h5 className=" dark:text-[#000] text-xs font-normal"> @noel_meon.. </h5>
                  <div className=" flex items-center ml-5">
                    <div>
                      <p className=" dark:text-[#fff] text-[#fff] ml-4 text-xs "><AiFillEye /> 26 </p>
                    </div>
                    <div>
                      <p className=" dark:text-[#fff] text-[#fff] text-xs "><AiFillHeart /> 26 </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>

        </SwiperSlide>

        <SwiperSlide>
          <div className="banner">

            <Image
              src="/images/banner-01.jpg"
              className=""
              alt="my image"
              height="500px"
              width="500px"
            />

            <div className="banner_content">
              <div className="banner_content_box">
                <div className="banner_content_title">
                  <h2 className="dark:text-white text-[#000] font-semibold	text-lg	">
                    Sally Fadel
                  </h2>
                </div>
                <div className="banner_content_user flex justify-between " >

                  <h5 className=" dark:text-[#000] text-xs font-normal"> @noel_meon.. </h5>
                  <div className=" flex items-center ml-5">
                    <div>
                      <p className=" dark:text-[#fff] text-[#fff] ml-4 text-xs "><AiFillEye /> 26 </p>
                    </div>
                    <div>
                      <p className=" dark:text-[#fff] text-[#fff] text-xs "><AiFillHeart /> 26 </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="banner">

            <Image
              src="/images/portfolio-04.jpg"
              className=""
              alt="my image"
              height="500px"
              width="500px"
            />
            <div className="banner_content">
              <div className="banner_content_box">
                <div className="banner_content_title">
                  <h2 className="dark:text-white text-[#000] font-semibold	text-lg	">
                    Sally Fadel
                  </h2>
                </div>
                <div className="banner_content_user flex justify-between " >

                  <h5 className=" dark:text-[#000] text-xs font-normal"> @noel_meon.. </h5>
                  <div className=" flex items-center ml-5">
                    <div>
                      <p className=" dark:text-[#fff] text-[#fff] ml-4 text-xs "><AiFillEye /> 26 </p>
                    </div>
                    <div>
                      <p className=" dark:text-[#fff] text-[#fff] text-xs "><AiFillHeart /> 26 </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="banner">

            <Image
              src="/images/banner-02.jpg"
              className=""
              alt="my image"
              height="500px"
              width="500px"
            />
            <div className="banner_content">
              <div className="banner_content_box">
                <div className="banner_content_title">
                  <h2 className="dark:text-white text-[#000] font-semibold	text-lg	">
                    Sally Fadel
                  </h2>
                </div>
                <div className="banner_content_user flex justify-between " >

                  <h5 className=" dark:text-[#000] text-xs font-normal"> @noel_meon.. </h5>
                  <div className=" flex items-center ml-5">
                    <div>
                      <p className=" dark:text-[#fff] text-[#fff] ml-4 text-xs "><AiFillEye /> 26 </p>
                    </div>
                    <div>
                      <p className=" dark:text-[#fff] text-[#fff] text-xs "><AiFillHeart /> 26 </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </SwiperSlide>

      </Swiper>
    </>
  );
}
