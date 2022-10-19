import { INFURA_IPFS_BASE_URL } from "utils";

export const truncateAddress = (address: string | null | undefined, limit: number = 2) => {
    if (!address) return "";
    const match = address.match(
        /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{2})$/
    );
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

export const toHex = (num: number) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};

export const getKeyByValue = (value: any, array: any) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === value) return i;
    }
}

export const followStepError = (slug: string, message: string, defaultModal: any) => {
    var newModal: any = {};
    var count = 0;
    for (const key in defaultModal) {
        if (Object.prototype.hasOwnProperty.call(defaultModal, key)) {
            var modalValue = defaultModal[key];
            if (slug === key) {
                modalValue = {
                    ...modalValue,
                    isError: true,
                    errorMessage: message || "Something went wrong!"
                };
            } else {
                const slugKey = getKeyByValue(slug, Object.keys(defaultModal)) || 0;
                if (count < slugKey) {
                    modalValue = {
                        ...modalValue,
                        isComplete: true
                    }
                }
            }
            newModal[key] = modalValue;
        }
        count++;
    }
    return newModal;
}

export const getIPFSBaseUrl = (url: any = "") => {
    if(!url) return "";    
    const ipfsBaseUrl = INFURA_IPFS_BASE_URL.slice(-1) === "/" ? INFURA_IPFS_BASE_URL.slice(0, -1) : INFURA_IPFS_BASE_URL.trim();
    return `${ipfsBaseUrl}/${url}`;
}