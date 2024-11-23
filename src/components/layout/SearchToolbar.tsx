import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import Toolbar from "@mui/material/Toolbar";
import {Autocomplete, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {t} from "i18next";
import {useNavigate} from "react-router-dom";
import {log, useDebounce} from "../../service/Common.ts";
import {Page} from "../../model/page/Page.ts";

export default function SearchToolbar() {

    const navigate = useNavigate();

    const [data, setData] = useState<Page[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const query = async (query: string): Promise<Page[]> => {
        log("Fetching query: " + query);
        const data = await fetch(import.meta.env.VITE_API + '/page/-titleSearch/' + query);
        if (data.ok) {
            return data.json();
        } else {
            return Promise.reject(data.text());
        }
    }

    useEffect(
        () => {
            if (debouncedSearchTerm) {
                query(debouncedSearchTerm)
                    .then((data: Page[]) => {
                        setData(data);
                    }).catch((_error) => {
                        setData([]);
                    });
            } else {
                setData([])
            }
        },
        [debouncedSearchTerm]
    );

    const chooseSearch = (_event: SyntheticEvent, value: string) => {
        if (value) {
            gotoOrSearch(value);
        }
    }

    const searchKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            if (searchTerm) {
                gotoOrSearch(searchTerm);
            }
        }
    }

    const gotoOrSearch = (value: string) => {
        query(value)
            .then((data: Page[]) => {
                if (data.length == 1) {
                    navigate('/page/' + data[0].title);
                } else {
                    navigate('/search/' + value);
                }
            });
    }

    return (<>
        <Toolbar id="searchBar">
            <Autocomplete
                freeSolo
                disableClearable
                onChange={chooseSearch}
                options={data.map((option) => option.title)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField
                    {...params}
                    label={t("Search")}
                    onChange={(event : ChangeEvent<HTMLInputElement>) => {setSearchTerm(event.target.value)}}
                    onKeyUp={(event) => {searchKeyUp(event)}}
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
        </Toolbar>
        </>);
}