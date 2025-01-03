import React, {ChangeEvent, ReactNode, SyntheticEvent, useEffect, useState} from "react";
import "ckeditor5/ckeditor5-editor.css";
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
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
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
} from 'ckeditor5';
import coreTranslationsEn from 'ckeditor5/translations/en.js';
import coreTranslationsEs from 'ckeditor5/translations/es.js';
import coreTranslationsDe from 'ckeditor5/translations/de.js';
import {useAppSelector} from "../hooks.ts";
import {t} from "i18next";
import {Autocomplete, Chip, InputAdornment, Stack, TextField} from "@mui/material";
import {Category} from "../model/page/Category.ts";
import {fetchCategory, findCategories} from "../service/CategoryService.ts";
import {log, useDebounce} from "../service/Common.ts";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
    initialContent: string;
    initialCategories: Category[] | undefined;
    changeContentEvent: (event: EventInfo<string, unknown>, editor : ClassicEditor) => void;
    setCategories: (categories: Category[]) => void;
}


export default function EditorComponent( props : Props) : ReactNode | null {

    const loggedUser = useAppSelector((state) => state.loggedUser);
    let translation = coreTranslationsEn;

    const [categories, setCategories] = useState<Category[]>(props.initialCategories || []);
    const [foundCategories, setFoundCategories] = useState<Category[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const debouncedSearchTerm = useDebounce(inputValue, 300);

    useEffect(
        () => {
            if (debouncedSearchTerm) {
                findCategories(debouncedSearchTerm)
                    .then((data: Category[]) => {
                        setFoundCategories(data);
                    }).catch((_error) => {
                    setFoundCategories([]);
                });
            } else {
                setFoundCategories([])
            }
        },
        [debouncedSearchTerm]
    );

    const handleDeleteCategory = (categoryToDelete: Category) => {
        setCategories(categories.filter(category => category !== categoryToDelete));
        props.setCategories(categories.filter(category => category !== categoryToDelete));
    };

    const searchKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            fetchCategory(inputValue.trim()).then((newCategory : Category) => {
                if (!categories.some(category => newCategory.name === category.name)) {
                    setCategories([...categories, newCategory]);
                    props.setCategories([...categories, newCategory]);
                }
            }).catch((error) => {
                if (error === 404) {
                    log("Category not found: " + inputValue);
                } else {
                    log("Error while adding category: " + error);
                }
           });
        }
    }

    const chooseSearch = (_event: SyntheticEvent<Element, Event>, value: string | null) => {
        if (value) {
            setInputValue(value);
        }
    }

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
            <Autocomplete sx={{ marginTop: 5 }}
                          options={foundCategories.map((option) => option.name)}
                          onChange={chooseSearch}
                          renderInput={(params) => <TextField
                            {...params}
                            label={t("Add categories")}
                            onChange={(event : ChangeEvent<HTMLInputElement>) => {setInputValue(event.target.value)}}
                            onKeyUp={(event ) => {searchKeyUp(event)}}
                            slotProps={{
                            input: {
                                ...params.InputProps,
                                type: 'search',
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                        },
                    }}
                />}
               />
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, marginTop: 5 }}>
                {categories.map((category : Category, index : number) => (
                    <Chip
                        key={index}
                        label={category.name}
                        onDelete={() => handleDeleteCategory(category)}
                        color="primary"
                    />
                ))}
            </Stack>
        </>
    )
}