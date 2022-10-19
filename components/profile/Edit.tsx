import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { BsDiscord, BsFacebook, BsGlobe, BsInstagram, BsPencilFill, BsTwitter } from 'react-icons/bs';
import { Metamask } from 'context';
import SocialIcons from 'data/social-icons.json';
import { toCaptalize } from 'helpers';
import { uploadOnIPFSServer } from 'utils';
import { validateUserForm } from 'schemas/form';
import { Alert, Box, Collapse, IconButton, Stack } from '@mui/material';
import { AiOutlineClose } from 'react-icons/ai';

function EditProfile() {
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const { user, setUserData }: any = Metamask.useContext();

    const currentUserData = {
        name: user.name || "",
        username: user.username || "",
        description: user.description || "",
        socialLinks: user.socialLinks || {},
        banner: user.banner || "",
        image: user.image || "",
    };
    const [assets, setAssets] = useState({
        image: "",
        banner: ""
    });

    const [formData, setFormData] = useState(currentUserData);


    const handleChange = async (event: any) => {
        let { name, value } = event.target;
        let [newName, childName] = name.split('|');

        if (childName) {
            let socialLinks = formData.socialLinks || {};
            socialLinks[childName] = value;
            value = socialLinks;
        }

        setFormData({ ...formData, [newName]: value });
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const newFormData = formData;
        const result = await validateUserForm(newFormData);
        if (result.status) {
            await uploadAssetsOnIPFS();
            await updateUserData();
        } else {
            console.log({
                valid: false,
                message: result.errors.shift()
            });
        }
    }

    const uploadAssetsOnIPFS = async () => {
        const newFormData: any = formData;
        // upload assets on IPFS Server
        if (assets.image) {
            newFormData.image = await uploadOnIPFSServer(assets.image[0]);
        }
        if (assets.banner) {
            newFormData.banner = await uploadOnIPFSServer(assets.banner[0]);
        }
        setFormData({ ...newFormData });
    }

    const updateUserData = async () => {
        const result = await setUserData(formData);
        if(result.status === "success") {
            router.push('/profile')
        } else {
            setError(result.message);
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            const name = event.target.name;
            setFormData({
                ...formData,
                [name]: URL.createObjectURL(i)
            })
            setAssets({
                ...assets,
                [name]: event.target.files
            })
        }
    }

    const icons: any = {
        twitter: <BsTwitter size={28} />,
        facebook: <BsFacebook size={28} />,
        instagram: <BsInstagram size={28} />,
        discord: <BsDiscord size={28} />,
        website: <BsGlobe size={28} />,
    }

    const socialIcons = SocialIcons.map(socialIcon => {
        return {
            label: socialIcon.name,
            value: socialIcon.slug,
            url: socialIcon.url,
            icon: icons[socialIcon.slug]
        }
    });

    const inputStyle = "shadow appearance-none w-full w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-[#969696] text-sm text-white";

    return (
        <section className="profile_edit" >
            <div className="container-fluid mx-auto ">
                <div className="lg:flex md:flex block flex-row">
                    <div className="basis-4/12  profile_edit_left_col px-10 pt-10 lg:pb-0  md:pb-0  pb-10 dark:bg-[#16151a] bg-[#571a810f]" data-aos="fade-right" data-aos-duration="3000">
                        <div className="dark:bg-[#16151a]  border-rounded-lg lg:p-10 md:p-0 p-0">
                            <div className="profile_edit_left_col_imagebg">
                                <div className="profile_edit_left_col_bannerimg edit-banner-box text-center mx-auto">
                                <div className="cancle">X</div>
                                    <h2 className="dark:text-white text-[#000] text-lg font-semibold aos-init aos-animate mb-3" data-aos="zoom-in" data-aos-duration="3000">Banner Image</h2>
                                    <div className="profile_edit_image">
                                        <label
                                            htmlFor="banner"
                                            className="form-label inline-block mb-2 text-gray-700 rounded-lg object-cover"
                                            style={{
                                                height: "200px",
                                                width: "200px"
                                            }}
                                        >
                                            {
                                                formData.banner ? (
                                                    <Image
                                                        src={formData.banner}
                                                        alt='Profile Bg Image'
                                                        className='rounded-lg object-cover'
                                                        height="300px"
                                                        width="300px"
                                                    />
                                                ) : (
                                                    <p>
                                                        File types supported: JPG, PNG, GIF, SVG. Max size: 10 MB
                                                    </p>
                                                )
                                            }
                                            <BsPencilFill className='profile_edit_pencil-icon' />
                                        </label>
                                        <input type="file" name='banner' id="banner" className="hidden" onChange={handleFileChange} accept="image/*" />

                                    </div>
                                </div>

                                <div className="profile_edit_left_col_image edit-profile-box  text-center mx-auto">
                                    <div className="cancle">X</div>
                                    <h2 className="dark:text-white text-[#000] text-lg font-semibold aos-init aos-animate mb-3" data-aos="zoom-in" data-aos-duration="3000">Profile Image</h2>
                                    <div className="profile_edit_image">
                                        <label
                                            htmlFor="image"
                                            className="form-label inline-block mb-2 text-gray-700 rounded-lg object-cover"
                                            style={{
                                                height: "200px",
                                                width: "200px"
                                            }}
                                        >
                                            {
                                                formData.image ? (
                                                    <Image
                                                        src={formData.image}
                                                        alt='Profile Bg Image'
                                                        className='rounded-lg object-cover'
                                                        height="300px"
                                                        width="300px"
                                                    />
                                                ) : (
                                                    <p>
                                                        File types supported: JPG, PNG, GIF, SVG. Max size: 10 MB
                                                    </p>
                                                )
                                            }

                                            <BsPencilFill className='profile_edit_pencil-icon' />
                                        </label>
                                        <input type="file" name='image' id="image" className="hidden" onChange={handleFileChange} accept="image/*" />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="basis-8/12  profile_edit_right_col lg:mt-0 md:mt-0 mt-10 dark:bg-[#09080d]  bg-[#fff] border-rounded-lg lg:p-10 md:p-10 p-0" data-aos="fade-left" data-aos-duration="3000">
                        <div className="profile_edit_right_col_form_column " >
                            <div className="profile_edit_right_col_form_column_form create_form ">
                                {
                                    error && (
                                        <Box sx={{ width: '100%' }}>
                                            <Collapse in={error ? true : false}>
                                                <Alert
                                                    action={
                                                        <IconButton
                                                            aria-label="close"
                                                            color="inherit"
                                                            size="small"
                                                            onClick={() => {
                                                                setError("");
                                                            }}
                                                        >
                                                            <AiOutlineClose fontSize="inherit" />
                                                        </IconButton>
                                                    }
                                                    sx={{ mb: 2 }}
                                                    severity="error"
                                                >
                                                    {error}
                                                </Alert>
                                            </Collapse>
                                        </Box>
                                    )
                                }
                                <form className="w-full mb-10 mt-8 " data-aos="zoom-in" data-aos-duration="3000">
                                    <div className="grid grid-cols-2 lg:mb-5 md:mb-5 mb-0">
                                        <div className=" px-3 mb-6 md:mb-0">
                                            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="grid-city">Name</label>
                                            <input className={inputStyle} type="text" name='name' value={formData.name} onChange={handleChange} placeholder="Name">
                                            </input>
                                        </div>
                                        <div className=" px-3 mb-6 md:mb-0">
                                            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="grid-city">
                                                Username
                                            </label>
                                            <input className={inputStyle} type="text" name='username' value={formData.username} onChange={handleChange} placeholder="Username">
                                            </input>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 lg:mb-5 md:mb-5 mb-0 form_textarea">
                                        <div className=" px-3 mb-6 md:mb-0">
                                            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="grid-city">Bio</label>
                                            <textarea value={formData.description} className={inputStyle} name='description' placeholder="Bio" onChange={handleChange}>{formData.description}</textarea>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 lg:mb-5 md:mb-5 mb-0 collection_form_socalicons">
                                        {
                                            socialIcons.map((social, key) => {
                                                const newSocialLinks: any = formData.socialLinks;
                                                const value = newSocialLinks[social.value] || "";
                                                return (
                                                    <div className="flex flex-row lg:mb-2 md:mb-2 mb-0 items-center" key={key}>
                                                        <div className="px-3 mb-6 md:mb-0">
                                                            {social.icon}
                                                        </div>
                                                        <div className="  mb-6 px-3 md:mb-0 collection_sociallinks">
                                                            <input className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-sm text-white"
                                                                type="text" name={`socialLinks|${social.value}`} placeholder={`Enter ${toCaptalize(social.value)} URL...`} value={value} onChange={handleChange} />
                                                        </div>
                                                    </div>

                                                )
                                            })
                                        }
                                    </div>

                                    <div className="grid mb-5 grid-cols-3 editprofile_submit_btn" >
                                        <button className="bg-blue-500 hover:bg-blue-700 rounded-full text-white font-bold py-3 px-6" onClick={handleSubmit}>Update</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EditProfile;
