import Layout from "components/Layout"
import { Profile } from "components/profile"
import { SECRET } from "utils";
import { JWT } from "utils/jwt";

export default function BaseProfile({ user }: any) {
    return (
        <Layout is404={!user}>
            <Profile />
        </Layout>
    )
}

export const getServerSideProps = (context: any) => {
    const cookies = context.req.cookies;
    const token = cookies[SECRET] || "";
    console.log({token, context})
    if (!token) {
        return {
            redirect: {
                permanent: true,
                destination: "/",
            },
        }
    }
    const jwt = new JWT();
    const data: any = jwt.varifyToken(token);
    return { props: { user: data } };
}
