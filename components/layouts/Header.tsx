import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsSun, BsMoon } from "react-icons/bs";

import { Common, Metamask } from "context";
import Menus from "data/menus.json";
import CustomNavLink from "./CustomNavLink";

// import {FaUserAlt} from "react-icons/fa";
import { trimString } from "helpers";
import { FaUserAlt } from "react-icons/fa";
import { MdCollectionsBookmark } from "react-icons/md";
import { RiLogoutCircleRFill } from "react-icons/ri";
import Avatar from "boring-avatars";
import BodyClass from '../BodyClass';
import { useRouter } from "next/router";
import { DvAvatar } from "components/miscellaneous";

interface MenuProps {
  name: string;
  slug: string;
  href: string;
  url: string[];
}

function Header() {
  const [menus, setMenus] = useState<MenuProps[]>([]);
  const { userTheme, setUserTheme }: any = Common.useContext();
  const { login, logout, user, isAuthenticated, setUserData }: any = Metamask.useContext();
  const [active, setActive] = useState(false);
  const [keyword, setKeyword] = React.useState("")
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let menuLinks = Menus.filter((menu) => {
        if (menu.slug == "nft" && !isAuthenticated) { return false }
        return true;
      });
      setMenus(menuLinks)
    })();
  }, [isAuthenticated, user]);

  async function authWalletConnect() {
    await login();
  }

  const connectToWallet = (event: any) => {
    event.preventDefault();
    authWalletConnect();
  };

  const disconnectToWallet = (event: any) => {
    event.preventDefault();
    logout();
  };

  const handleMode = async () => {
    const theme = userTheme == "dark" ? "light" : "dark";
    if (isAuthenticated) {
      await setUserData({
        theme: theme
      })
    }
    setUserTheme(theme)
  }

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?keyword=${keyword}`)
    }
  }


  return (
    <div>
      <BodyClass />
      <div className="z-10 bg-transparent  w-full border-b-2  border-[#ffffff14] absolute mainheader">
        <div className="container-flex mx-auto header px-12">
          <div className="lg:flex md:flex block flex-row ">

            <div className="basis-6/12 flex left_header items-center">
              <Link
                href="/"
                passHref
              >
                <a
                  className="cursor-pointer text-sm font-bold leading-relaxed inline-block mr-4 whitespace-nowrap uppercase text-white"
                >
                  <Image
                    src="/logo1.png"
                    alt="my image"
                    height="100px"
                    width="226px"
                    className="cursor-pointer"
                  />
                </a>
              </Link>

              <div className="menus ">
                <nav className=" flex flex-wrap items-center justify-between ">
                  <div className="container mx-auto flex flex-wrap items-center justify-between navbar_header">
                    <div className="w-full flex justify-between  lg:w-auto md:w-auto    px-4 lg:static lg:block md:static md:block  lg:justify-start">
                      <button
                        className="  inline-flex p-3  rounded lg:hidden md:hidden text-white ml-auto hover:text-white outline-none "
                        onClick={() => setActive(!active)}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <nav className="flex items-center flex-wrap ">
                      <div
                        className={`${active ? "menu_active " : ""
                          }w-full lg:inline-flex lg:flex-grow lg:w-auto`}
                      >
                        <div className="lg:inline-flex lg:flex-row lg:ml-auto lg:w-auto w-full lg:items-center items-start  flex flex-col lg:h-auto">
                          <div className="mobile_header_menus">
                            <ul className="flex  flex-col md:flex-row lg:flex-row list-none ml-auto">
                              {menus.map((menu, index) => (
                                <CustomNavLink key={index} {...menu}>{menu.name}</CustomNavLink>
                              ))}
                              <div className="mobile_rightheader ">
                                <div className="basis-6/12 right_header flex items-center justify-end">
                                  <div className="search site-search-bar">
                                    <form className="header_main_search" onSubmit={handleSearchSubmit}>
                                      <input type="text" name="search" onChange={(e) => setKeyword(e.target.value)} placeholder="Search.."></input>
                                    </form>
                                  </div>
                                  <ul className=" flex items-center justify-end  header_usrprofile">
                                    {isAuthenticated ? (
                                      <li className=" inline pl-1 pr-3 cursor-pointer font-bold text-base uppercase tracking-wide float-right headerprofile_list">
                                        <div className="rounded-full cursor-pointer font-bold text-base uppercase tracking-wide flex items-center">
                                          <div>
                                            {
                                              user.image ? (
                                                <Image
                                                  src={user.image}
                                                  alt="my image"
                                                  height="32px"
                                                  width="35px"
                                                  className="rounded-full"
                                                />
                                              ) : (
                                                <Avatar
                                                  size={33}
                                                  name={user.name}
                                                  variant="beam"
                                                  colors={user.colors}
                                                />
                                              )
                                            }
                                          </div>
                                          <div>
                                            <p className="text-[#fff] text-sm font-normal normal-case px-3"> {trimString(user.address, 2)}</p>
                                          </div>
                                        </div>
                                        <div className="dropdown-menu   h-auto  ">
                                          <ul className="block w-full bg-white shadow px-12 py-8">
                                            <li>
                                              <Link passHref className="py-1" href="/profile">
                                                <a><FaUserAlt />  My Profile</a>
                                              </Link>
                                            </li>
                                            <li>
                                              <Link passHref className="py-1" href="/collections">
                                                <a><MdCollectionsBookmark /> My Collections</a>
                                              </Link>
                                            </li>
                                            <li onClick={disconnectToWallet}>
                                              <a href="#" className="py-1">
                                                <RiLogoutCircleRFill /> Disconnect
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      </li>
                                    ) : (
                                      <li className=" connectwallet_button inline px-4 cursor-pointer font-bold text-base uppercase tracking-wide float-right	">
                                        {/* <div className=" rounded-full dropdown inline text-purple-500 hover:text-purple-700 cursor-pointer font-bold text-base uppercase tracking-wide  cursor-pointer ]"> */}
                                        <button
                                          className="  connectwallet_btn text-center mx-auto text-[#fff] font-bold py-1 px-2 border-[#fff] rounded-full bg-transparent	 text-sm"
                                          onClick={connectToWallet}
                                        >
                                          {" "}
                                          Connect Wallet
                                        </button>
                                        {/* </div> */}
                                      </li>
                                    )}
                                  </ul>
                                  <div className="header_sun_icon text-[#fff] mr-4 rounded-full p-2 cursor-pointer"
                                    onClick={handleMode}
                                  >
                                    <a>
                                      {userTheme == "light" ? <BsSun size="24" /> : < BsMoon size="24" />}
                                    </a>
                                  </div>


                                </div>
                              </div>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                </nav>
              </div>
            </div>

            <div className="basis-6/12 right_header main_right_header flex items-center justify-end">
              <div className="search site-search-bar">
                <form className="header_main_search" onSubmit={handleSearchSubmit}>
                  <input type="text" name="search" onChange={(e) => setKeyword(e.target.value)} placeholder="Search.."></input>
                </form>
              </div>
              <ul className=" flex items-center justify-end  header_usrprofile">
                {isAuthenticated ? (
                  <li className=" inline pl-1 pr-3 cursor-pointer font-bold text-base uppercase tracking-wide float-right headerprofile_list">
                    <div className="rounded-full cursor-pointer font-bold text-base uppercase tracking-wide flex items-center">
                      <div>
                        <DvAvatar
                          imageAlt="My Image"
                          imageUrl={user.image}
                          colors={user.colors}
                          imageSize={{
                            height: "32px",
                            width: "35px"
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-[#fff] text-sm font-normal normal-case px-3"> {trimString(user.address, 2)}</p>
                      </div>
                    </div>
                    <div className="dropdown-menu   h-auto  ">
                      <ul className="block w-full bg-white shadow px-12 py-8">
                        <li>
                          <Link passHref className="py-1" href="/profile">
                            <a><FaUserAlt />  My Profile</a>
                          </Link>
                        </li>
                        <li>
                          <Link passHref className="py-1" href="/collections">
                            <a><MdCollectionsBookmark /> My Collections</a>
                          </Link>
                        </li>
                        <li onClick={disconnectToWallet}>
                          <a href="#" className="py-1">
                            <RiLogoutCircleRFill /> Disconnect
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li className=" connectwallet_button inline px-4 cursor-pointer font-bold text-base uppercase tracking-wide float-right	">
                    {/* <div className=" rounded-full dropdown inline text-purple-500 hover:text-purple-700 cursor-pointer font-bold text-base uppercase tracking-wide  cursor-pointer ]"> */}
                    <button
                      className="  connectwallet_btn text-center mx-auto text-[#fff] font-bold py-1 px-2 border-[#fff] rounded-full bg-transparent	 text-sm"
                      onClick={connectToWallet}
                    >
                      {" "}
                      Connect Wallet
                    </button>
                    {/* </div> */}
                  </li>
                )}
              </ul>
              <div className="header_sun_icon text-[#fff] mr-4 rounded-full p-2 cursor-pointer"
                onClick={handleMode}
              >
                <a>
                  {userTheme == "light" ? <BsSun size="24" /> : < BsMoon size="24" />}
                </a>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
