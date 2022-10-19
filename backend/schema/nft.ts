import { object, string, number, array, boolean, date, ObjectSchema } from "yup";


const formDataValidate = async (schema: any, formData: any) => {
    return await schema.validate(formData)
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
}

export const validatePlaceABidData = async (formData: any) => {
    const schema = object().shape({
        price: string().required("Bid price must be required"),
        transaction: object().required("Transaction must be required"),
    })
    return await formDataValidate(schema, formData);
}

export const validateMakeAOffer = async (formData: any) => {
    const schema = object().shape({
        expiredDate: date().required('Expired Date must be required'),
        price: string().required("Offer price must be required"),
        transaction: object().required("Transaction must be required"),
    })
    return await formDataValidate(schema, formData);
}

export const validateBuyData = async (formData: any) => {
    const schema = object().shape({
        // listId: string().required('Listing id must be required'),
        transaction: object().required("Transaction must be required"),
    });
    return await formDataValidate(schema, formData);
}


