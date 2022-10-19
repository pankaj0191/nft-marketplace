import { useEffect, useState } from 'react';

import Layout from "../../components/Layout"
import Explore from "../../components/Explore"
import { getAllItems } from '../../services';

export default function BaseExplore() {
    const [isLoading, setIsLoading] = useState(false);
    const [explores, setExplores] = useState<any[]>([]);
    const [updated, setUpdated] = useState<Boolean>(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const results = await getAllItems({
                limit: 20,
            });
            setExplores(results);
            setIsLoading(false);
        })();
    }, [updated]);

    return (
        <Layout isLoading={isLoading}>
            <Explore explores={explores} isLoading={isLoading} useUpdated={() => [updated, setUpdated]} />
        </Layout>
    )
}
