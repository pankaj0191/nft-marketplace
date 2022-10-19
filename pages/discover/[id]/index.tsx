import Layout from "components/Layout"
import { getNftById } from "services";
import NFTDetail from "components/nft/NFTDetails";
import { useEffect, useState } from "react";

interface NFTDetailProps {
    nftItem: any;
    id: string;
}

export default function BaseNftDetail({ nftItem, id }: NFTDetailProps) {

    const [nft, setNft] = useState<any>(false);
    const [isLoading, setIsLoading] = useState<Boolean>(false);
    const [updated, setUpdated] = useState<Boolean>(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const nftDetails: any = await getNftById(id);
            if(Object.keys(nftDetails).length) {
                setNft(nftDetails);
            }            
            setIsLoading(false);
        })();
    }, [id, updated])

    return (
        <Layout isLoading={isLoading} is404={!nft}>
            <NFTDetail useUpdate={[updated, setUpdated]} details={nft} />
        </Layout>
    )
}

export const getServerSideProps = async (context: any) => {
    const { id }: any = context.query;
    const nftItem: any = await getNftById(id);
    if (Object.keys(nftItem).length) {
        return { props: { nftItem, id } };
    }
    return {
        notFound: true
    }
}
