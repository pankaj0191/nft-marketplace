
import Layout from "components/Layout"
import { EditProfile } from "components/profile"
import { Metamask } from "context";
import { getTokenData } from "services";
import { SECRET } from "utils";

export default function BaseEditProfile({ user }: any) {
    const { isAuthenticated }: any = Metamask.useContext();
    return (
        <Layout is404={!isAuthenticated}>
            <EditProfile />
        </Layout>
    )
}

export const getServerSideProps = (context: any) => {
    const cookies = context.req.cookies;
    const token = cookies[SECRET] || "";
    if (!token) {
        return {
            redirect: {
                permanent: true,
                destination: "/",
            },
        }
    }
    const data: any = getTokenData(token);
    return { props: { user: data.user } };
}