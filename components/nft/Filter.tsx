import React, { FC, useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import Select from 'react-select'

import { BsFillGrid3X3GapFill, BsFillGridFill } from 'react-icons/bs';
import { FaEthereum } from "react-icons/fa";

import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider } from '@coreui/react'
import { getCategories, getCollections, getGenries } from "services";

interface FilterProps {
  onToggle: Function;
  data?: any;
  setData?: any
}

const Filter: FC<FilterProps> = ({ data, setData, onToggle }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [genries, setGenries] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isDrawer, setIsDrawer] = useState(false);
  const [toggleViewMode, setToggleViewMode] = useState<Boolean>(true);
  const [filterData, setFilterData] = useState({
    name: "",
    sold: null,
    range: [0, 100],
  });

  useEffect(() => {
    (async () => {
      // Get collection data
      const collectionResult = await getCollections();
      setCollections(collectionResult.map((collection: any) => {
        return {
          label: collection.name,
          value: collection.id
        }
      }));
      // Get category data
      const categoryResult = await getCategories();
      setCategories(categoryResult.map((category: any) => {
        return {
          label: category.name,
          value: category.id
        }
      }));
      // Get genre data
      const genreResult = await getGenries();
      setGenries(genreResult.map((genre: any) => {
        return {
          label: genre.name,
          value: genre.id
        }
      }));
    })();
    return () => {
      setCollections([]);
      setCategories([]);
      setGenries([]);
    };
  }, [])

  const handleFilter = (filterObject: any) => {
    const nftName = filterObject.name;
    const nftSold = filterObject.sold;
    const [start, end] = filterObject.range;

    var i, newData;
    // Loop through all list items, and hide those who don't match the search query
    newData = [];
    for (i = 0; i < data.length; i++) {
      const item = data[i];
      const itemName = item.name;
      const itemSold = item.isSold;
      const itemPrice = item.price;
      let pushStatus = false;

      if (nftName && itemName.toUpperCase().indexOf(nftName) > -1) {
        pushStatus = true;
      }
      if (nftSold) {
        if (itemSold && nftSold == "yes") {
          pushStatus = true;
        }
        if (!itemSold && nftSold == "no") {
          pushStatus = true;
        }
      }
      if (itemPrice >= start && itemPrice <= end) {
        pushStatus = true;
      }

      if (pushStatus) {
        newData.push(item);
      }
    }
    setData(newData);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    handleFilter(filterData);
  };

  const handleReset = (event: any) => {
    event.preventDefault();
    setFilterData({
      name: "",
      sold: null,
      range: [0, 100],
    });
    setData(data);
  };

  const handleToggle = (bool: Boolean) => {
    setToggleViewMode(bool);
    if (typeof onToggle === "function") {
      onToggle(bool)
    }
  }

  const status = [
    { value: 'buy_now', label: 'Buy Now' },
    { value: 'on_auction', label: 'On Auction' },
    { value: 'new', label: 'New' },
    { value: 'has_offers', label: 'Has Offers' },
  ]


  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      // borderBottom: '1px solid rgb(229, 232, 235)',
      // color: state.isSelected ? '#fff' : 'black',
      // backgroundColor: state.isSelected ? '#571a81' : '#fff',


      // color: state.isSelected ? '#fff' : '#fff',
      // backgroundColor: state.isSelected ? '#571a81' : '#000',


      //dark  color: state.isSelected ? '#fff' : '#fff',
      //dark  borderBottom: '1px solid #000',
      //dark   backgroundColor: state.isSelected ? '#571a81' : '#000',

      // background: "#023950",
      "&:hover": {
        backgroundColor: state.isFocused ? "#571a81" : "#571a81",
        color: state.isFocused ? "#fff" : "#571a81",
      }


    }),
    control: (provided: any) => ({
      ...provided,
      padding: "0%",
    })
  }


  return (
    <div className="lg:flex md-flex flex flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-between mb-10  ">
      <div className="explore_filterbutton">
        <button onClick={() => setIsDrawer(true)} className="dark:text-[#fff]">Filter</button>
        <Drawer
          anchor="left"
          open={isDrawer}
          onClose={() => setIsDrawer(false)}
        >
          <div>
            <form
              className="w-full mb-10 mt-10 filter_form"
              onSubmit={handleSubmit}
              // data-aos="fade-left"
              data-aos-duration="3000"
            >
              {/* <div className="grid lg:grid-cols-5 md:grid-cols-5 grid-cols-1"> */}
              <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1">

                <div className="  px-3 mb-8 md:mb-5">
                  <label
                    className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                    htmlFor="grid-state"
                  >
                    Categories
                  </label>
                  <div className="">
                    <Select options={categories} styles={customStyles}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#571a81',
                          primary: '#571a81',
                        },
                      })}
                      className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-0 px-0 leading-tight dark:text-white text-[#969696] text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="  px-3 mb-8 md:mb-5">
                  <label
                    className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                    htmlFor="grid-state"
                  >
                    Genre
                  </label>
                  <div className="">
                    <Select options={genries} styles={customStyles}

                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#571a81',
                          primary: '#571a81',
                        },
                      })}
                      className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-0 px-0 leading-tight dark:text-white text-[#969696] text-sm"
                    />
                  </div>
                </div>
                <div className="  px-3 mb-8 md:mb-5">
                  <label
                    className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                    htmlFor="grid-state"
                  >
                    Collection
                  </label>
                  <div className="">
                    <Select options={collections} styles={customStyles}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#571a81',
                          primary: '#571a81',
                        },
                      })}
                      className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-0 px-0 leading-tight dark:text-white text-[#969696] text-sm"
                    />
                  </div>
                </div>

                <div className="  px-3 mb-8 md:mb-5">
                  <label
                    className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                    htmlFor="grid-state"
                  >
                    Status
                  </label>
                  <div className="">
                    <Select options={status} styles={customStyles}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#571a81',
                          primary: '#571a81',
                        },
                      })}
                      className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-0 px-0 leading-tight dark:text-white text-[#969696] text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="  px-3 mb-8 md:mb-5">
                  <label
                    className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                    htmlFor="grid-state"
                  >
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="filter_minimum">
                      <input className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-[#969696] text-sm" placeholder="Minimum "></input>
                      <FaEthereum className="" />
                    </div>
                    <div className="filter_minimum">
                      <input className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-[#969696] text-sm" placeholder="Maximum "></input>
                      <FaEthereum className="" />
                    </div>
                  </div>
                </div>
                <div className=" px-2 mb-5 md:mb-5 mt-3">
                  <button
                    type="submit"
                    className="discover_filter_buton border-2 rounded-full mr-1 dark:text-white hover:text-[#fff] hover:bg-[#571a81] hover:border-[#571a81] font-bold py-2 px-6 border-[#000]"
                  >
                    Search
                  </button>{" "}
                </div>
              </div>
            </form>
          </div>
        </Drawer>
      </div>
      <div className=" flex ">
        <div className="mr-4 explore_lsistgrid">
          <button
            onClick={() => handleToggle(true)}
            className={`${toggleViewMode ? "active" : ""}`}
          ><BsFillGrid3X3GapFill /></button>
          <button
            onClick={() => handleToggle(false)}
            className={`${!toggleViewMode ? "active" : ""}`}
          ><BsFillGridFill /></button>
        </div>
        {/* {toggleViewMode ? 'grid' : 'list'} */}
        <div className="searchpage_filte ">

          <div className="searchpage_filter_btns">
            <CDropdown alignment={{ xs: 'end', lg: 'start' }}>
              <CDropdownToggle color="secondary">
                Filter & Sort
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#">Featured </CDropdownItem>
                <CDropdownItem href="#">Latest</CDropdownItem>

              </CDropdownMenu>
            </CDropdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
