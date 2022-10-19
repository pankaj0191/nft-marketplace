
import CollectionForm from './Form'

interface EditProps {
    collection: any;
    id: string;
}

function Edit({ collection, id }: EditProps) {
    return (
        <section className="profile_edit" >
            <div className="container-fluid mx-auto ">
                <CollectionForm {...collection} />
            </div>
        </section>
    );
}

export default Edit;
