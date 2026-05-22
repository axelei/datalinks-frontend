import React, {ChangeEvent, ReactNode, SyntheticEvent, useEffect, useRef, useState} from "react";
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
import {Autocomplete, Chip, Dialog, DialogContent, DialogTitle, InputAdornment, Stack, TextField} from "@mui/material";
import {Category} from "../model/page/Category.ts";
import {fetchCategory, findCategories} from "../service/CategoryService.ts";
import {log, useDebounce} from "../service/Common.ts";
import {Foundling} from "../model/search/Foundling.ts";
import {FoundlingType} from "../model/search/FoundlingType.ts";
import LinkToPagePlugin from "../ckeditor/LinkToPagePlugin.ts";
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

    const editorRef = useRef<ClassicEditor | null>(null);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [pageSearchTerm, setPageSearchTerm] = useState('');
    const debouncedPageSearch = useDebounce(pageSearchTerm, 300);
    const [pageResults, setPageResults] = useState<Foundling[]>([]);

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

    useEffect(
        () => {
            if (debouncedPageSearch) {
                fetch(import.meta.env.VITE_API + '/search/titleSearch/' + encodeURIComponent(debouncedPageSearch), {
                    headers: {Authorization: 'Bearer ' + loggedUser.token}
                })
                    .then(res => res.ok ? res.json() : [])
                    .then((data: Foundling[]) => setPageResults(data.filter(f => f.type === FoundlingType.page)))
                    .catch(() => setPageResults([]));
            } else {
                setPageResults([])
            }
        },
        [debouncedPageSearch]
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

    const handleLinkToPage = (_event: SyntheticEvent, value: string | null) => {
        if (value && editorRef.current) {
            const editor = editorRef.current;
            const siteUrl = (import.meta.env.VITE_SITE_URL ?? '').toString();
            const linkUrl = siteUrl + '/page/' + encodeURIComponent(value);
            const selection = editor.model.document.selection;
            if (selection.isCollapsed) {
                editor.model.change(writer => {
                    const linkText = writer.createText(value, {linkHref: linkUrl});
                    editor.model.insertContent(linkText);
                });
            } else {
                editor.execute('link', linkUrl);
            }
            setLinkDialogOpen(false);
            setPageSearchTerm('');
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
                    licenseKey: 'GPL',
                    toolbar: {
                        items: [
                            'undo', 'redo', 'showBlocks', '|',
                            'bold', 'italic', 'underline', 'strikethrough', 'code', 'subscript', 'superscript', 'removeFormat', '|',
                            'sourceEditing', '|',
                            'heading', 'codeBlock', 'style', '-',
                            'insertImage', '|',
                            'link', 'linkToPage', '|',
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
                        isVisible: true,
                        addItems: [
                            {
                                item: 'menuBar:linkToPage',
                                position: 'end:insertInline',
                            },
                        ],
                    },
                    language: loggedUser.user.language,
                    linkToPage: {
                        onOpenDialog: () => setLinkDialogOpen(true),
                        label: t('Link to Page'),
                    },
                    plugins: [
                        Bold, Essentials, Italic, Mention, Paragraph, Undo, Heading, Font, HorizontalLine, AutoLink,
                        Link, List, Table, TableToolbar, TableCellProperties, TableProperties, TableColumnResize,
                        TableCaption, Alignment, Strikethrough, Subscript, Superscript, Underline, Code, CodeBlock,
                        Clipboard, RemoveFormat, SourceEditing, Style, GeneralHtmlSupport, ShowBlocks,
                        SimpleUploadAdapter, ImageToolbar, Image, ImageCaption, ImageResize, ImageStyle,
                        LinkImage, ImageUpload, ImageInsertViaUrl, LinkToPagePlugin,
                    ],
                    translations: [translation],
                    initialData: props.initialContent,
                } as any}
                onReady={(editor: ClassicEditor) => {
                    editorRef.current = editor;
                }}
                onChange={props.changeContentEvent}
            />
            <Dialog open={linkDialogOpen} onClose={() => { setLinkDialogOpen(false); setPageSearchTerm(''); }}>
                <DialogTitle>{t('Link to Page')}</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        freeSolo
                        disableClearable
                        sx={{ width: 300, marginTop: 1 }}
                        options={pageResults.map(option => option.title)}
                        onChange={handleLinkToPage}
                        renderInput={(params) => <TextField
                            {...params}
                            label={t('Search pages')}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => setPageSearchTerm(event.target.value)}
                            onKeyUp={(event: React.KeyboardEvent<HTMLDivElement>) => {
                                if (event.key === 'Enter' && pageResults.length > 0 && editorRef.current) {
                                    handleLinkToPage(event, pageResults[0].title);
                                }
                            }}
                            autoFocus
                        />}
                    />
                </DialogContent>
            </Dialog>
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