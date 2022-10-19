import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

import Layout from "../../../components/Layout"
import { getAllItems } from '../../../services'
import { NFT  } from "../../../components/nft";
import { Metamask } from "context";
import { NftDataProps } from "@types";

export default function BaseNftDetail() {
    const [userNfts, setUserNfts] = useState<NftDataProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const { userId = false }: any = router.query;
    const { user }: any = Metamask.useContext();

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            if (userId) {
                const result = await getAllItems({
                    createdBy: userId,
                    limit: 20
                });
                if (Object.keys(result).length) {
                    setUserNfts(result);
                }
            }
            setIsLoading(false);
        })();
    }, [userId]);

    return (
        <Layout isLoading={isLoading} is404={!Object.keys(user ? user : {}).length}>
            <NFT nfts={userNfts} userId={userId} />
        </Layout>
    )
}