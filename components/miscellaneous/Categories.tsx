
import { useEffect, useState } from "react";
import CreatableSelect from 'react-select/creatable';
import FormControl from '@mui/material/FormControl';

import { getCategories } from '../../services'

interface CategoryProps {
    value?: string;
    handleChange?: any;
}

interface CategoryOptionProps {
    label: string, 
    value: string
}

function Categories({ value = "", handleChange }: CategoryProps) {
    const [categories, setCategories] = useState<CategoryOptionProps[]>([]);

    useEffect(() => {
        (async () => {
            const result = await getCategories();
            const categoryOptions = result.map((category: { name: string, id: string }) => {
                return {
                    label: category.name,
                    value: category.id
                }
            });
            setCategories(categoryOptions);
        })();
    }, []);

    const categoryValue = categories.find((category: CategoryOptionProps) => category.value === value) || {
        label: "Select Category",
        value: ""
    }
    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            // borderBottom: '1px solid rgb(229, 232, 235)',
            color: state.isSelected ? '#fff' : '',
            backgroundColor: state.isSelected ? '#571a81' : '',
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
        <FormControl
            className="w-full"
        >
            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="category">
                Category
            </label>
            <CreatableSelect className="collection_select block mb-5 appearance-none w-full   py-1 rounded leading-tight dark:text-white text-[#7d7d7d] text-sm"
                isClearable
                onChange={handleChange}
                options={categories}
                value={categoryValue}
                styles={customStyles}
                placeholder="Select Category"
                name="category"
                id="category-select"
                instanceId="category-select"
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    colors: {
                        ...theme.colors,
                        // primary25: 'hotpink',
                        primary: '#571a81',
                    },
                })}

            />
        </FormControl>
    )
}

export default Categories