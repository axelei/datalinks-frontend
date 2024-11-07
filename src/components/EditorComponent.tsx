import {ReactNode} from "react";
import 'ckeditor5/ckeditor5.css';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import {
    Alignment,
    AutoLink,
    Bold,
    ClassicEditor,
    Clipboard,
    Code,
    CodeBlock,
    Essentials,
    EventInfo,
    Font,
    GeneralHtmlSupport,
    Heading,
    HorizontalLine,
    Italic,
    Link,
    List,
    Mention,
    Paragraph,
    RemoveFormat,
    ShowBlocks,
    SourceEditing,
    Strikethrough,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    Underline,
    Undo,
} from 'ckeditor5';
import coreTranslationsEn from 'ckeditor5/translations/en.js';
import coreTranslationsEs from 'ckeditor5/translations/es.js';
import coreTranslationsDe from 'ckeditor5/translations/de.js';
import {useAppSelector} from "../hooks.ts";
import {t} from "i18next";

interface Props {
    initialContent: string;
    changeContentEvent: (event: EventInfo<string, unknown>, editor : ClassicEditor) => void;
}


export default function EditorComponent( props : Props) : ReactNode | null {

    const loggedUser = useAppSelector((state) => state.loggedUser);
    let translation = coreTranslationsEn;

    if (loggedUser.user.language) {
        switch (loggedUser.user.language.substring(0, 2)) {
            case 'es':
                translation = coreTranslationsEs;
                break;
            case 'de':
                translation = coreTranslationsDe;
                break;
            default:
                translation = coreTranslationsEn;
        }
    }

    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                config={{
                    toolbar: {
                        items: [
                            'undo', 'redo', 'showBlocks', '|',
                            'bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript', 'removeFormat', '|',
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
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties',
                            'tableCellProperties', 'toggleTableCaption',],
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
                    placeholder: t('Write your content here'),
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
                    translations: [translation],
                    initialData: props.initialContent,
                }}
                onChange={props.changeContentEvent}
            />
        </>
    )
}