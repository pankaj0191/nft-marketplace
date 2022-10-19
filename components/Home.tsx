import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import SweetAlert from "react-bootstrap-sweetalert";
import { BannerCard, TrendingNfts, ArtistsList, TrendingAuctions, FeaturedCollections } from "./landing_page";
import { Metamask } from "context";


function Home() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(true);
  const { isAuthenticated }: any = Metamask.useContext();

  const redirectToCreateNft = () => {
    if (isAuthenticated) {
      router.push("/discover");
    } else {
      setLoggedIn(false);
    }
  };

  const AlertTitle = (props: any) => {
    const { title = "Please Sign In!" } = props;
    return <span className="text-dark">{title}</span>;
  };

  return (
    <>
      {!loggedIn && (
        <SweetAlert
          danger
          title={<AlertTitle />}
          onConfirm={() => setLoggedIn(!loggedIn)}
          confirmBtnCssClass="text-[#333] font-bold py-2 px-5 border-2 border-[#333] rounded-full"
        >
          You are not loged In!
        </SweetAlert>
      )}


      {/* <section className="homepage_banner bg-[url('/images/banner-bg-image3.jpg')] bg-cover bg-center min-h-screen flex  items-center justify-center pt-20 "> */}
      <section className="homepage_banner  bg-cover bg-center lg:min-h-screen md:min-h-80 flex   items-center justify-center pt-20 ">
        <div className="container mx-auto ">
          <div className="lg:flex md:flex block flex-row justify-center ">

            <div
              className="basis-6/12	  banner_left_section lg:text-left md:text-left text-center pt-10"
              data-aos="zoom-in"
              data-aos-duration="3000"
            >
              <h1 className="text-white font-bold	lg:text-left md:text-left text-center  text-8xl">
                Search your rare NFT by world class artists
              </h1>
              <p className="text-[#fff] text-lg lg:text-left md:text-left text-center  mx-auto my-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores
                expedita beatae exercitationem quasi ullam esse?
              </p>
              <button
                className="lg:mt-0 md:mt-0 mt-0   text-center mx-auto text-[#fff] font-bold py-3 px-6 border-2 border-[#fff] hover:border-[#571a81] rounded-full bg-transparent"
                onClick={redirectToCreateNft}
              >
                {" "}
                Get started
              </button>
            </div>
            <div className="basis-6/12  banner_left_section lg:float-right md:float-right sm:float-none">
              <BannerCard />
            </div>
          </div>
        </div>
      </section>


      {/*******Trending nfts*************/}
      <TrendingNfts />
      {/*******Trending nfts*************/}

      {/*******featured artists*************/}
      <ArtistsList />
      {/***********featured artists**************/}

      {/***********auctions******** */}
      <TrendingAuctions />
      {/**********auctions******/}



      {/*****featured collections******/}
      <FeaturedCollections />
      {/*********featured collections*******/}


      <section className="aboutcreate_section  pb-20 pt-10 ">
        <div className="container mx-auto ">
          <div className="lg:flex md-flex block flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-center mb-10">
            <h2
              className="dark:text-white text-[#000] lg:text-4xl md:text-4xl text-2xl mb-3 font-semibold	text-center homepage_maintitle"
              data-aos="zoom-in"
              data-aos-duration="3000"
            >
              How to create NFT
            </h2>


          </div>          
          <div className="lg:flex md:flex block lg:space-x-10 md:space-x-10 space-x-0 lg:space-y-0 md:space-y-0  space-y-10">
            <div
              className="lg:basis-4/12 md:basis-6/12   aboutcreate_section_col dark:bg-[#16151a] bg-[#fff] rounded-lg "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="aboutcreate_section_column_box  py-6  lg:px-10 md:px-3  px-2   rounded-lg  ">
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
              className="lg:basis-4/12 md:basis-6/12  aboutcreate_section_col dark:bg-[#16151a] bg-[#fff]  rounded-lg "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="aboutcreate_section_column_box  py-6 lg:px-10 md:px-3  px-2  rounded-lg  ">
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
              className="lg:basis-4/12 md:basis-6/12  aboutcreate_section_col dark:bg-[#16151a] bg-[#fff]  rounded-lg "
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay="300"
              data-aos-duration="2000"
            >
              <div className="aboutcreate_section_column_box  py-6  lg:px-10 md:px-3  px-2  rounded-lg">
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

export default Home;
