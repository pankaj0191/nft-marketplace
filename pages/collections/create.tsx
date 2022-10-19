import Layout from "../../components/Layout"
import { Create } from "../../components/collections";
import { SECRET } from "utils";


export default function CollectionCreate() {
    return (
        <Layout>
            <Create />
        </Layout>
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