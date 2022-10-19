import React, { FC, useState } from 'react';
import { BsPlus, BsListStars } from 'react-icons/bs'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { AiOutlineClose } from 'react-icons/ai'
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

import { propertiesSchema, validateNftForm } from '../../schemas/form';

import { CustomModal, ModalHeader, ModalContent, ModalFooter } from '../miscellaneous/modal';
import { FormControl } from '@mui/material';

interface PropertyProps {
    onComplete: Function;
}

export interface ProperyValueProps {
    trait_type: string;
    value: string;
}

const PropertyModal: FC<PropertyProps> = ({ onComplete }) => {
    const [open, setOpen] = useState(false);
    const defaultProperty = {
        trait_type: "",
        value: ""
    };
    const [properties, setProperties] = useState<ProperyValueProps[]>([defaultProperty]);
    const [isError, setIsError] = useState({
        status: false,
        message: ""
    });

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: any, key: number) => {
        const { name, value } = event.target;
        let newProperties: any = properties;
        var property = newProperties[key];
        if (name === "value") {
            property.value = value;
        } else {
            property.trait_type = value;
        }
        newProperties[key] = property;
        setProperties([...newProperties]);
    }

    const handleAddMore = () => {
        setProperties([...properties, defaultProperty]);
    }

    const handleRemove = (property: ProperyValueProps) => {
        if (properties.length > 1) {
            const newProperties = properties.filter((item: ProperyValueProps) => item !== property);
            setProperties([...newProperties]);
        }
    }

    const handleSubmit = async () => {
        const result = await validateNftForm(properties, propertiesSchema());
        if (result.status) {
            if (typeof onComplete === "function") {
                onComplete(result.data);
            }
            handleClose();
            setIsError({
                status: false,
                message: ""
            });
        } else {
            const message = result.errors.shift() || "";
            setIsError({
                status: true,
                message
            });
        }
    }


    const [isActive, setActive] = useState(false);

    const ToggleClass = () => {
        setActive(!isActive);
    };
    return (
        <>
            <div className="grid grid-cols-12 px-3 pb-3 mb-4 mt-5 border-b dark:border-[#ffffff14] nftcreate_form_puton">
                <div className="pt-1 col-span-1">
                    <BsListStars size={22} />
                </div>
                <div className="col-span-6 place-self-start">
                    <h5 className='dark:text-[#fff]'>Properties</h5>
                    <p className="dark:text-[#fff]">Textual traits that show up as rectangles</p>
                </div>
                <div className="nftcreate_plus_btn">
                    <Button variant="outlined" className='p-1 ' onClick={handleClickOpen}><BsPlus size={32} /></Button>
                </div>
                <CustomModal id="drkform"
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={open} className={isActive ? "dark_createform_popup" : "createform_popup"}
                >
                    <ModalHeader onClose={handleClose}>
                        Add Properties
                    </ModalHeader>
                    <ModalContent>
                        <Typography gutterBottom sx={{ marginBottom: 2 }}>
                            Properties show up underneath your item, are clickable, and can be filtered in your collection&apos;s sidebar.
                        </Typography>
                        <Collapse in={isError.message ? true : false} >
                            <Alert
                                {
                                ...{
                                    severity: isError.status ? "error" : "success"
                                }
                                }
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setIsError({
                                                ...isError,
                                                message: ""
                                            });
                                        }}
                                    >
                                        <AiOutlineClose />
                                    </IconButton>
                                }
                                sx={{ mb: 2 }}
                            >
                                {isError.message}
                            </Alert>
                        </Collapse>
                        <Box sx={{ flexGrow: 1 }}>
                            <div className="grid grid-cols-5 gap-3 mb-2">
                                <div></div>
                                <h5 className="createform_label font-medium text-sm	dark:text-[#fff]">Type</h5>
                                <h5 className="createform_label font-medium text-sm	dark:text-[#fff]">Name</h5>
                            </div>
                            {
                                properties.length && (
                                    properties.map((property, key) => {
                                        return (
                                            <div className="grid grid-cols-5 gap-3 mb-2" key={key}>
                                                <Button onClick={() => {
                                                    handleRemove(property);
                                                }} className="createpopup_crossicon"><AiOutlineClose /></Button>
                                                <FormControl
                                                    className="mb-6 md:mb-0 col-span-2"
                                                >
                                                    <input
                                                        className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-2 px-4 leading-tight text-[#333333] dark:text-[#acacac] text-sm focus:border-[#571a81]"
                                                        onChange={(event) => {
                                                            handleChange(event, key)
                                                        }}
                                                        name="trait_type"
                                                        type="text"
                                                        placeholder="e.g. Character"
                                                        value={property.trait_type}
                                                    />
                                                </FormControl>
                                                <FormControl
                                                    className="mb-6 md:mb-0 col-span-2"
                                                >
                                                    <input
                                                        className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-2 px-4 leading-tight text-[#333333] dark:text-[#acacac] text-sm focus:border-[#571a81]"
                                                        onChange={(event) => {
                                                            handleChange(event, key)
                                                        }}
                                                        name="value"
                                                        type="text"
                                                        placeholder="e.g. Male"
                                                        value={property.value}
                                                    />
                                                </FormControl>
                                            </div>
                                        )
                                    })
                                )
                            }
                            <div className="grid grid-cols-3 gap-3 mb-2">
                                <div></div>
                                <h5 className="createform_label font-medium text-sm	dark:text-[#fff]"></h5>
                                <h5 className="createform_label font-medium text-sm	dark:text-[#fff]">
                                    <Button variant="outlined" onClick={handleAddMore}>Add More</Button>
                                </h5>
                            </div>
                        </Box>
                    </ModalContent>
                    <ModalFooter>
                        <Button autoFocus variant="outlined" onClick={handleSubmit}>
                            Save
                        </Button>
                    </ModalFooter>
                </CustomModal>
            </div>
            <div className="grid grid-cols-6 gap-3 property-items px-3">
                {
                    properties.length ? (
                        properties.filter(property => property.trait_type && property.value).map((property, key) => {
                            return (
                                <div key={key} className="item-property border-dashed border-2 border-indigo-600 rounded p-3 mb-5">
                                    <div className="property-trait_type text-center capitalize text-sm text-[#571a81]">{property.trait_type}</div>
                                    <div className="property-value text-center capitalize text-lg" data-testid="Property--value">{property.value}</div>
                                </div>
                            )
                        })
                    ) : ""
                }
            </div>

        </>
    );
}

export default PropertyModal;