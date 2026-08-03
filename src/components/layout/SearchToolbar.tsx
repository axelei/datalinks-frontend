import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import Toolbar from "@mui/material/Toolbar";
import {Autocomplete, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {t} from "i18next";
import {useNavigate} from "react-router-dom";
import {useDebounce} from "../../service/Common.ts";
import {Foundling} from "../../model/search/Foundling.ts";
import {getFoundlingPath} from "../../model/search/FoundlingType.ts";
import {titleSearch} from "../../service/SearchService.ts";

export default function SearchToolbar() {

    const navigate = useNavigate();

    const [data, setData] = useState<Foundling[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(
        () => {
            if (debouncedSearchTerm) {
                titleSearch(debouncedSearchTerm, '')
                    .then((data: Foundling[]) => {
                        setData(data);
                    }).catch(() => {
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
            const match = data.filter((f) => f.title === value);
            if (match.length === 1) {
                navigate(getFoundlingPath(match[0].type) + encodeURIComponent(value));
            } else {
                navigate('/search/' + encodeURIComponent(value));
            }
        }
    }

    const searchKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            navigate('/search/' + encodeURIComponent(searchTerm));
        }
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
        </Toolbar>
        </>);
}