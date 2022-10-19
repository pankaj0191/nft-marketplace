import Layout from "../../components/Layout"
import { NftForm } from "../../components/nft"
import { SECRET } from 'utils/constants';


export default function BaseNFT() {

    return (
        <>
            <Layout>
                <NftForm />
            </Layout>
        </>
    )
}


export const getServerSideProps = (context: any) => {
    const cookies = context.req.cookies;
    const token = cookies[SECRET] || "";
    if(!token) {
        return {
            redirect: {
                permanent: true,
                destination: "/",
            },
        }
    }
    return { props: {} };
}