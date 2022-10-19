
import { useEffect, useState } from "react";
import CreatableSelect from 'react-select/creatable';
import FormControl from '@mui/material/FormControl';

import { getCollections } from 'services'
import { Metamask } from "context";

interface CollectionProps {
    value?: string;
    handleChange?: any;
}

interface CollectionOptionProps {
    label: string,
    value: string
}

function Collections({ value = "", handleChange }: CollectionProps) {
    const [collections, setCollections] = useState<CollectionOptionProps[]>([]);
    const { user }: any = Metamask.useContext();

    useEffect(() => {
        (async () => {
            const result = await getCollections({
                createdBy: user.id
            });
            setCollections(result.map((collection: { name: string, id: string }) => {
                return {
                    label: collection.name,
                    value: collection.id
                }
            }));
        })();
    }, [user]);

    const collectionValue = collections.find((collection: CollectionOptionProps) => collection.value === value) || {
        label: "Select Collection",
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
            className="mb-2 w-full"
            id="collection"
        >
            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="collection">
                collection
            </label>
            <CreatableSelect className="collection_select block  appearance-none w-full   py-1 rounded leading-tight dark:text-white text-[#7d7d7d] text-sm"
                isClearable
                onChange={handleChange}
                options={collections}
                value={collectionValue}
                styles={customStyles}
                placeholder="Select collection"
                name="collection"

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

export default Collections