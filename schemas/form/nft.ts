import { object, string, number, array, boolean, date, ObjectSchema } from "yup";

export const propertiesSchema = () => {
    return array().of(
        object({
            value: string().required("Name must be required"),
            trait_type: string().required("Type must be required"),
        })
    ).min(1, "Property must be required");
};

export const collectionSchema = () => {
    return object().shape({
        explicitSensitiveContent: boolean().optional(),
        collection: string().optional(),
        description: string().required("Description must be required"),
        genre: string().required("Genre must be required"),
        category: string().required("Category must be required"),
        externalLink: string().url("External link must a valid url").optional(),
        title: string().required("Name must be required"),
        image: string().required("Image must be required"),
    })
}

export const validateNftForm = async (formData: any, schema: any = null) => {
    schema = typeof schema === "object" && schema ? schema : collectionSchema();
    const result = await schema.validate(formData)
        .then((value: any) => {
            return {
                status: true,
                errors: [],
                data: value
            }
        })
        .catch(function (err: any) {
            return {
                status: false,
                errors: err.errors,
                data: {}
            };
        });
    return result;
}

export const marketPlaceActionSchema = (isOnMarket = false, action = "fixed_price") => {
    isOnMarket = typeof isOnMarket === "boolean" && isOnMarket ? true : false;
    action = typeof action === "string" && action.trim() ? action.trim() : "fixed_price";
    if (isOnMarket) {
        var data = object().optional();
        if (action === "fixed_price") {
            data = object().shape({
                price: number().moreThan(0, "Price must be greater than 0").required("Price must be required"),
            });
        } else if (action === "timed_auction") {
            data = object().shape({
                minBid: number().moreThan(0, "Min bid must be greater than 0").required("Min bid must be required"),
                startDate: date().required('Start Date must be required'),
                endDate: date().required('End Date must be required')
            });
        }
        return object().shape({
            action: string().required("Marketplace action must be required"),
            data,
        })

    } else {
        return object().optional();
    }
}


export const validateMakeAOfferData = async (formData: any) => {
    const makeOfferSchema = object().shape({
        expiredDate: date().required("Expiration Date must be required"),
        price: number().required('Price must be required').positive(),
    });

    const result = await makeOfferSchema.validate(formData)
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