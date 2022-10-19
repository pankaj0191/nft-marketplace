import { object, string } from "yup";

interface FormProps {
    name: string;
    username: string;
    description: string;
    socialLinks: {
        discord?: string;
        twitter?: string;
        instagram?: string;
        facebook?: string;
        website?: string;
    }
}

export const user = object().shape({
    socialLinks: object({
        discord: string().trim().url("Discord url must a valid url").optional(),
        twitter: string().trim().url("Twitter url must a valid url").optional(),
        instagram: string().trim().url("Instagram url must a valid url").optional(),
        facebook: string().trim().url("Facebook url must a valid url").optional(),
        website: string().trim().url("Website url must a valid url").optional(),
    }),
    banner: string().required("Banner image must be required"),
    image: string().required("Profile image must be required"),
    description: string().required("Bio must be required"),
    username: string().trim().required("Username must be required"),
    name: string().trim().required("Name must be required"),
});

export const validateUserForm = async (formData: FormProps) => {
    const result = await user.validate(formData)
        .then((value) => {
            return {
                status: true,
                errors: [],
                data: value
            }
        })
        .catch(function (err) {
            return {
                status: false,
                errors: err.errors,
                data: {}
            };
        });
    return result;
}