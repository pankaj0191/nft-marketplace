import { getNftById, getTokenData } from 'services'
import Layout from "components/Layout"
import Sell from "components/nft/Sell";
import { SECRET } from "utils";

interface SellProps {
    nftItem: any;
}

export default function BaseSell({ nftItem }: SellProps) {
    return (
        <Layout>
            <Sell nft={nftItem} />
        </Layout>
    )
}

export const getServerSideProps = async (context: any) => {
    const { id }: any = context.query;
    const cookies = context.req.cookies;
    const token = cookies[SECRET] || "";
    const loginUser: any = getTokenData(token);
    const nftItem: any = await getNftById(id);
    if (loginUser && loginUser.user.id === nftItem.ownedBy.id && Object.keys(nftItem).length) {
        return { props: { nftItem } };
    }
    return {
        notFound: true
    }
}
