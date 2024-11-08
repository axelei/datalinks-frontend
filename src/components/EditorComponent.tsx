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
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    Italic,
    Link,
    LinkImage,
    List,
    Mention,
    Paragraph,
    RemoveFormat,
    ShowBlocks,
    SimpleUploadAdapter,
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
    ImageUpload,
    ImageInsertViaUrl,
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
                            'insertImage', '|',
                            'link', '|',
                            'horizontalLine', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                            'insertTable', '|',
                            'alignment', '|',
                            'bulletedList', 'numberedList',
                        ],
                        shouldNotGroupWhenFull: true,
                    },
                    image: {
                        toolbar: [
                            'imageStyle:inline', 'imageStyle:wrapText', 'imageStyle:breakText', '|',
                            'toggleImageCaption', 'imageTextAlternative', 'linkImage'
                        ],
                        styles: {
                            options: [
                                'inline', 'alignLeft', 'alignRight',
                                'alignCenter', 'alignBlockLeft', 'alignBlockRight',
                                'block', 'side'
                            ]
                        },
                        insert: {
                            integrations: [ 'upload', 'assetManager', 'url' ]
                        }
                    },
                    table: {
                        contentToolbar: [
                            'tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties',
                            'tableCellProperties', 'toggleTableCaption',
                        ],
                    },
                    simpleUpload: {
                        uploadUrl: import.meta.env.VITE_API + '/file/upload',
                        withCredentials: true,
                        headers: {
                            // 'X-CSRF-TOKEN': 'CSRF-Token',
                            Authorization: 'Bearer ' + loggedUser.token,
                        }
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
                        Clipboard, RemoveFormat, SourceEditing, Style, GeneralHtmlSupport, ShowBlocks,
                        SimpleUploadAdapter, ImageToolbar, Image, ImageCaption, ImageResize, ImageStyle,
                        LinkImage, ImageUpload, ImageInsertViaUrl,
                    ],
                    translations: [translation],
                    initialData: props.initialContent,
                }}
                onChange={props.changeContentEvent}
            />
        </>
    )
}