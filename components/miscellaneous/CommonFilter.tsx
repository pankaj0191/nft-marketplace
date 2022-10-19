import { FC, useEffect, useState } from 'react';
import { BsFillGrid3X3GapFill, BsFillGridFill } from 'react-icons/bs';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import { getCategories, getGenries } from 'services';

interface CommonFilterProps {
    onToggle: Function;
}

interface FilterData {
    category: string;
    genre: string;
    status: string;
}

const CommonFilter: FC<CommonFilterProps> = ({ onToggle }) => {
    const [toggleViewMode, setToggleViewMode] = useState<Boolean>(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [genries, setGenries] = useState<any[]>([]);
    const [filterData, setFilterData] = useState<FilterData>({
        category: "",
        genre: "",
        status: ""
    })

    const handleToggle = (bool: Boolean) => {
        setToggleViewMode(bool);
        if (typeof onToggle === "function") {
            onToggle(bool);
        }
    }

    useEffect(() => {
        (async () => {
            const categoryResult = await getCategories();
            const genreResult = await getGenries();
            setCategories(categoryResult);
            setGenries(genreResult);
        })();
    }, []);

    const handleSearch = (value: string, name: string) => {
        setFilterData({
            ...filterData,
            [name]: value
        })
    }

    return (
        <div className="searchpage_filte r mb-10">
            <div className="lg:flex md:flex sm-block justify-between ">
                <div className="flex searchpage_filter_left_menus">
                    <div className="searchpage_filter_btns">
                        <CDropdown alignment={{ xs: 'end', lg: 'start' }}>
                            <CDropdownToggle color="secondary">
                                Categories
                            </CDropdownToggle>
                            <CDropdownMenu>
                                {
                                    categories.length ? (
                                        categories.map((category: any, key) => {
                                            return (
                                                <CDropdownItem href="#" className='block' key={key} onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSearch(category.id, "category")
                                                }}>{category.name}</CDropdownItem>
                                            )
                                        })
                                    ) : (
                                        <CDropdownItem href="#">No Category Found</CDropdownItem>
                                    )
                                }
                            </CDropdownMenu>
                        </CDropdown>
                    </div>

                    <div className="searchpage_filter_btns">
                        <CDropdown alignment={{ xs: 'end', lg: 'start' }}>
                            <CDropdownToggle color="secondary">
                                Type
                            </CDropdownToggle>
                            <CDropdownMenu>
                                {
                                    genries.length ? (
                                        genries.map((genre: any, key) => {
                                            return (
                                                <CDropdownItem href="#" className='block' key={key} onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSearch(genre.id, "genre")
                                                }}>{genre.name}</CDropdownItem>
                                            )
                                        })
                                    ) : (
                                        <CDropdownItem href="#">No Genre Found</CDropdownItem>
                                    )
                                }
                            </CDropdownMenu>
                        </CDropdown>
                    </div>

                    <div className="searchpage_filter_btns">
                        <CDropdown alignment={{ xs: 'end', lg: 'start' }}>
                            <CDropdownToggle color="secondary">
                                Status
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem href="#" className='block' onClick={(e) => {
                                    e.preventDefault();
                                    handleSearch("on_sale", "status")
                                }}>On Sale</CDropdownItem>
                                <CDropdownItem href="#" className='block' onClick={(e) => {
                                    e.preventDefault();
                                    handleSearch("on_auction", "status")
                                }}>On Auction</CDropdownItem>
                                <CDropdownItem href="#" className='block' onClick={(e) => {
                                    e.preventDefault();
                                    handleSearch("created", "status")
                                }}>Created</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </div>

                <div className="flex justify-between items-end searchpage_filter_right_menus">
                    <div className=" searchright_filter explore_lsistgrid mr-3 ">
                        <button
                            onClick={() => handleToggle(true)}
                            className={`${toggleViewMode ? "active" : ""}`}
                        ><BsFillGrid3X3GapFill /></button>
                        <button
                            onClick={() => handleToggle(false)}
                            className={`${!toggleViewMode ? "active" : ""}`}
                        ><BsFillGridFill /></button>
                    </div>
                    <div className="searchpage_filter_btns searchright_filter">
                        <CDropdown alignment={{ xs: 'end', lg: 'start' }}>
                            <CDropdownToggle color="secondary">
                                Filter & Sort
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem href="#">Music</CDropdownItem>
                                <CDropdownItem href="#">Genres</CDropdownItem>

                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CommonFilter;