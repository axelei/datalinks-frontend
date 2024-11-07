import {ReactNode} from "react";
import 'ckeditor5/ckeditor5.css';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {Bold, ClassicEditor, Essentials, EventInfo, Italic, Mention, Paragraph, Undo} from 'ckeditor5';
import coreTranslationsEs from 'ckeditor5/translations/es.js';
import {useAppSelector} from "../hooks.ts";

interface Props {
    content: string;
    changeContentEvent: (event: EventInfo<string, unknown>, editor : ClassicEditor) => void;
}


export default function EditorComponent( props : Props) : ReactNode | null {

    const loggedUser = useAppSelector((state) => state.loggedUser);

    return (
        <>
            <CKEditor
                editor={ ClassicEditor }
                config={ {
                    toolbar: {
                        items: [ 'undo', 'redo', '|', 'bold', 'italic', ],
                    },
                    menuBar: {
                        isVisible: true
                    },
                    language: loggedUser.user.language,
                    plugins: [
                        Bold, Essentials, Italic, Mention, Paragraph, Undo
                    ],
                    translations: [ coreTranslationsEs ],
                    initialData: props.content,
                } }
                onChange={props.changeContentEvent}
            />
        </>
    )
}