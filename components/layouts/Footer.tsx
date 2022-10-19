import React from "react";
import Image from "next/image";
import { BsTwitter, BsInstagram } from "react-icons/bs";
import { FaFacebookF, FaDiscord } from "react-icons/fa";
import Link from "next/link";
import { Metamask, MetamaskContextResponse } from "context";

function Footer() {
  const { login }: MetamaskContextResponse = Metamask.useContext();

  const handleConnectWallet = async (event: any) => {
    event.preventDefault()
    await login();
  }

  const marketplaceLists = [
    {
      title: "Discover",
      href: "/discover"
    },
    {
      title: "New NFTs",
      href: "/discover?newNfts=true"
    },
    {
      title: "Collections",
      href: "/collections/all"
    }
  ];

  const myAccountLists = [
    {
      title: "My Profile",
      href: "/profile"
    },
    {
      title: "Connect Wallet",
      href: "",
      callback: handleConnectWallet
    },
    {
      title: "Collections",
      href: "/collections/all"
    }
  ];

  const resourceLists = [
    {
      title: "Learn",
      href: "/learning"
    },
    {
      title: "Subscribe",
      href: "/subscribe"
    }
  ];

  const companyLists = [
    {
      title: "About",
      href: "/about"
    },
    {
      title: "Terms",
      href: "/terms-and-conditions"
    },
    {
      title: "Privacy",
      href: "/privacy-policy"
    }
  ];

  return (
    <div className="bg-[#24243557]">
      <footer className="bg-[#16151a]">
        <div className="bg-[#16151a] py-5 ">
          <div className="container-fluid  footer-content  mx-auto footer py-10">
            <div className="grid grid-cols-5 gap-2">
              <div className="left_footer_logo">
                <a
                  className="text-sm font-bold leading-relaxed inline-block mr-4 whitespace-nowrap uppercase text-white mb-4"
                  href="#pablo"
                >
                  <Image
                    src="/footer-logo.png"
                    alt="my image"
                    height="100px"
                    width="226px"
                    priority={true}
                  />

                </a>
                <p className="text-[#fff] lg:text-base md:text-base text-sm leading-6">
                  Where Bitcoin was hailed as the digital answer to currency,{" "}
                  <br />
                  NFTsare now being touted as the digital answer to
                  collectables.{" "}
                </p>
                
                <ul className="list-none  flex text-[#fff] social-video  lg:py-8 md:py-8 py-0 pt-6 pb-0  ">
                  <li className=" text-[#fff] hover:text-[#571a81]  hover:border-[#571a81] rounded-full border-[#fff] p-2 border mr-4 ">
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                      <BsInstagram />
                    </a>
                  </li>
                  <li className=" text-[#fff] hover:text-[#571a81]  hover:border-[#571a81] rounded-full border-[#fff] p-2 border mr-4 ">
                    <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                      <BsTwitter />
                    </a>
                  </li>
                  <li className=" text-[#fff] hover:text-[#571a81]  hover:border-[#571a81] rounded-full border-[#fff] p-2 border mr-4 ">
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                      <FaFacebookF />
                    </a>
                  </li>
                  <li className=" text-[#fff] hover:text-[#571a81]  hover:border-[#571a81] rounded-full border-[#fff] p-2 border mr-4 ">
                    <a href="https://discord.com/" target="_blank" rel="noopener noreferrer">
                      <FaDiscord />
                    </a>
                  </li>
                </ul>
              </div>
              <div className="footer-link-column text-white marketplace-footer">
                <h1 className="footer-link-header" style={{ fontSize: 25 }}>Marketplace</h1>
                <ul className="Footer--link-list">
                  {
                    marketplaceLists.map((footerMenu, key) => {
                      return (
                        <li key={key} className="footer-link-wrapper">
                          <Link href={footerMenu.href}>{footerMenu.title}</Link>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>


              <div className="footer-link-column text-white my-account">
                <h1 className="footer-link-header" style={{ fontSize: 25 }}>My Account</h1>
                <ul className="Footer--link-list">
                  {
                    myAccountLists.map((list, key) => {
                      return (
                        <li key={key} className="footer-link-wrapper">
                          {
                            typeof list.callback === "function" ? (
                              <a href="" onClick={list.callback}>{list.title}</a>
                            ) : (
                              <Link href={list.href}>{list.title}</Link>
                            )
                          }
                        </li>
                      )
                    })
                  }
                </ul>
              </div>

              <div className="footer-link-column text-white resources my-account">
                <h1 className="footer-link-header" style={{ fontSize: 25 }}>Resources</h1>
                <ul className="Footer--link-list">
                  {
                    resourceLists.map((list, key) => {
                      return (
                        <li key={key} className="footer-link-wrapper">
                          {
                            <Link href={list.href}>{list.title}</Link>
                          }
                        </li>
                      )
                    })
                  }
                </ul>
              </div>

              <div className="footer-link-column text-white company my-account">
                <h1 className="footer-link-header" style={{ fontSize: 25 }}>Company</h1>
                <ul className="Footer--link-list">
                  {
                    companyLists.map((list, key) => {
                      return (
                        <li key={key} className="footer-link-wrapper">
                          {
                            <Link href={list.href}>{list.title}</Link>
                          }
                        </li>
                      )
                    })
                  }
                </ul>
              </div>


            </div>
          </div>
          <div className="container-fluid mx-auto bottom_copyright_footer dark:[#16151a] bg-[#16151a] lg:px-20 md:px-20  px-5  lg:pb-0   md :pb-0 pb-4  border-t-2 border-[#ffffff14] ">
            <div className="footer-copyright lg:flex md:flex block  items-center justify-between">
              <p className="text-[#fff] text-sm	leading-9 text-center py-2">
                © Diamond Verse, All rights reserved.{" "}
              </p>
              <ul className="list-none  flex text-[#fff]  text-sm  items-center justify-center  lg:space-x-10 md:space-x-10 space-x-3 ">
                <Link href="/privacy-policy">
                  <a className="hover:text-[#571a81]">
                    <li>Privacy Policy</li>
                  </a>
                </Link>
                <Link href="/terms-and-conditions">
                  <a className="hover:text-[#571a81]">
                    <li>Terms & Conditions</li>
                  </a>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
