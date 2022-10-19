import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout"
import { getCollectionById } from "../../../services";
import { Details } from "../../../components/collections";


export default function BaseCollectionDetails() {
    const [isLoading, setIsLoading] = useState(false);
    const [collection, setCollection] = useState<any | Boolean>(false);
    const router = useRouter()
    const collectionId: any = router.query.collectionId;


    useEffect(() => {
        (async () => {
            setIsLoading(true);
            if (collectionId) {
                const result = await getCollectionById(collectionId);
                if (Object.keys(result).length) {
                    setCollection(result);
                }
            }
            setIsLoading(false);
        })();
    }, [collectionId])

    return (
        <Layout isLoading={isLoading} is404={!collection}>
            <Details id={collectionId} collection={collection} />
        </Layout>
    )
}
