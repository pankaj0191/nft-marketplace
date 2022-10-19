import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout"
import { getCollectionById } from "../../../services";
import { EditCollection } from "../../../components/collections";


export default function BaseCollectionDetails() {
    const [isLoading, setIsLoading] = useState(false);
    const [collection, setCollection] = useState<any | Boolean>(false);
    const router = useRouter()
    const collectionId: any = router.query.collectionId;

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            if (collectionId) {
                const collection = await getCollectionById(collectionId);
                if (Object.keys(collection).length) {
                    setCollection(collection);
                }
            }
            setIsLoading(false);
        })();
    }, [collectionId])

    return (
        <Layout isLoading={isLoading} is404={!collection}>
            <EditCollection id={collectionId} collection={collection} />
        </Layout>
    )
}
