import {ReactNode} from "react";
import 'ckeditor5/ckeditor5.css';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {ClassicEditor, Essentials, EventInfo, Mention, Paragraph, Undo, Heading, Font, HorizontalLine, ShowBlocks,
    AutoLink, Link, List, Table, TableToolbar, TableCellProperties, TableProperties, TableColumnResize, TableCaption,
    Alignment, Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline, CodeBlock, Clipboard, RemoveFormat,
    SourceEditing, Style, GeneralHtmlSupport,
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
                        items: [ 'undo', 'redo', 'showBlocks', '|',
                            'bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript', 'removeFormat',  '|',
                            'sourceEditing', '|',
                            'heading', 'codeBlock', 'style', '-',
                            'link', '|',
                            'horizontalLine', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                            'insertTable', '|',
                            'alignment', '|',
                            'bulletedList', 'numberedList',
                        ],
                        shouldNotGroupWhenFull: true,
                    },
                    table: {
                        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties',
                            'tableCellProperties', 'toggleTableCaption', ],
                    },
                    style: {
                        definitions: [
                            /*
                            {
                                name: 'Article category',
                                element: 'h3',
                                classes: [ 'category' ]
                            },
                            {
                                name: 'Info box',
                                element: 'p',
                                classes: [ 'info-box' ]
                            },
                             */
                        ]
                    },
                    menuBar: {
                        isVisible: true
                    },
                    language: loggedUser.user.language,
                    plugins: [
                        Bold, Essentials, Italic, Mention, Paragraph, Undo, Heading, Font, HorizontalLine, AutoLink,
                        Link, List, Table, TableToolbar, TableCellProperties, TableProperties, TableColumnResize,
                        TableCaption, Alignment, Strikethrough, Subscript, Superscript, Underline, Code, CodeBlock,
                        Clipboard, RemoveFormat, SourceEditing, Style, GeneralHtmlSupport, ShowBlocks
                    ],
                    translations: [ coreTranslationsEs ],
                    initialData: props.content,
                } }
                onChange={props.changeContentEvent}
            />
        </>
    )
}