import { object, string, number, array, boolean, date } from "yup";

export const collection = object().shape({
    blockchain: string().required("Blockchain type must be required"),
    explicitSensitiveContent: boolean().required("Explicit & sensitive content must be required"),
    creatorEarningAddress: string().trim().when('creatorEarning', {
        is: (val: number) => val > 0,
        then: string().required("User Address must be required"),
        otherwise: string(),
    }),
    creatorEarning: number().max(10).integer().optional(),
    socialLinks: object({
        discord: string().trim().url("Discord url must a valid url").optional(),
        twitter: string().trim().url("Twitter url must a valid url").optional(),
        instagram: string().trim().url("Instagram url must a valid url").optional(),
        facebook: string().trim().url("Facebook url must a valid url").optional(),
        website: string().trim().url("Website url must a valid url").optional(),
    }),
    collaborators: array().of(string().required("collaborators must be required")),
    banner: string().required("Banner image must be required"),
    feature: string().required("Featured image must be required"),
    image: string().required("Logo must be required"),
    description: string().trim().required("Description must be required"),
    genre: string().required("Genre must be required"),
    category: string().required("Category must be required"),
    symbol: string().trim().required("Symbol must be required"),
    name: string().trim().required("Name must be required"),
});

export const validateCollectionForm = async (formData: any) => {
    const result = await collection.validate(formData)
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