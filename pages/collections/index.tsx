import Layout from "../../components/Layout"
import { Collection } from "../../components/collections";


export default function BaseCollection() {

    return (
        <Layout>
            <Collection isUser={true} />
        </Layout>
    )
}
