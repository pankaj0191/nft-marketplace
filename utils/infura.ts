
import { create, Options } from "ipfs-http-client";

import { INFURA_PROJECT_ID, INFURA_PROJECT_SECRET, INFURA_API_ENDPOINT, INFURA_IPFS_BASE_URL } from "./constants";

export const infuraIPFSClient = (projectUrl?: string) => {
    const url = projectUrl ? projectUrl : INFURA_API_ENDPOINT || "";
    const urlObject = new URL(url);
    const options: Options = {
        host: urlObject.hostname,
        port: parseInt(urlObject.port),
        protocol: urlObject.protocol.replace(":", "")
    }

    if (INFURA_PROJECT_ID && INFURA_PROJECT_SECRET) {
        const auth = 'Basic ' + Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_PROJECT_SECRET).toString('base64');
        options.headers = {
            authorization: auth
        }
    }
    return create(options);
}


export const uploadOnIPFSServer = async (file: any) => {
    try {
        // Get infura ipfs client object
        const infIpfsClient = infuraIPFSClient();
        // Upload nft art on infura ipfs server
        const result = await infIpfsClient.add(file);
        return result.path || "";
    } catch (error) {
        console.log(error)
        return "";
    }
}