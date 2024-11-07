import {ReactNode} from "react";
import 'ckeditor5/ckeditor5.css';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {ClassicEditor, Essentials, EventInfo, Mention, Paragraph, Undo, Heading, Font, HorizontalLine,
    AutoLink, Link, List, Table, TableToolbar, TableCellProperties, TableProperties, TableColumnResize, TableCaption,
    Alignment, Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline, CodeBlock
} from 'ckeditor5';
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
                        items: [ 'undo', 'redo', '|',
                            'bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript',  '|',
                            'link', '|',
                            'heading', 'codeBlock', '|',
                            'horizontalLine', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                            'insertTable', '|',
                            'alignment', '|',
                            'bulletedList', 'numberedList',
                        ],
                    },
                    table: {
                        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties',
                            'tableCellProperties', 'toggleTableCaption', ],
                    },
                    menuBar: {
                        isVisible: true
                    },
                    language: loggedUser.user.language,
                    plugins: [
                        Bold, Essentials, Italic, Mention, Paragraph, Undo, Heading, Font, HorizontalLine, AutoLink,
                        Link, List, Table, TableToolbar, TableCellProperties, TableProperties, TableColumnResize,
                        TableCaption, Alignment, Strikethrough, Subscript, Superscript, Underline, Code, CodeBlock
                    ],
                    translations: [ coreTranslationsEs ],
                    initialData: props.content,
                } }
                onChange={props.changeContentEvent}
            />
        </>
    )
}