import {useParams} from "react-router-dom";

function Page() {

    const params = useParams();

    return (
        <>
            <h1>{params.title}</h1>
            {params.mode !== 'edit' && (
                <article>content</article>
            )}
            {params.mode === 'edit' && (
                <textarea value={'content'}></textarea>
            )}
            mode = {params.mode}
        </>
    )
}

export default Page;