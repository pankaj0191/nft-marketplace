import Layout from "components/Layout"
import { getUserById } from "services/users";
import { Details } from "components/creators";


export default function BaseCreator({ user }: any) {
    return (
        <Layout>
            <Details id={user.id} creator={user} />
        </Layout>
    )
}

export const getServerSideProps = async (context: any) => {
    const { creatorId }: any = context.query;
    const user: any = await getUserById(creatorId);
    if (Object.keys(user).length) {
        return { props: { user } };
    }
    return {
        notFound: true
    }
}