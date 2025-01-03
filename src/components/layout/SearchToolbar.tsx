import React, {ChangeEvent, SyntheticEvent, useEffect, useState} from "react";
import Toolbar from "@mui/material/Toolbar";
import {Autocomplete, InputAdornment, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {t} from "i18next";
import {useNavigate} from "react-router-dom";
import {log, useDebounce} from "../../service/Common.ts";
import {Foundling} from "../../model/search/Foundling.ts";
import {getFoundlingPath} from "../../model/search/FoundlingType.ts";

export default function SearchToolbar() {

    const navigate = useNavigate();

    const [data, setData] = useState<Foundling[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const query = async (query: string): Promise<Foundling[]> => {
        log("Fetching query: " + query);
        const data = await fetch(import.meta.env.VITE_API + '/search/titleSearch/' + query);
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
                    .then((data: Foundling[]) => {
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
            query(value)
                .then((data: Foundling[]) => {
                    if (data.length == 1) {
                        navigate(getFoundlingPath(data[0].type) + value);
                    } else {
                        navigate('/search/' + value);
                    }
                });
        }
    }

    const searchKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            navigate('/search/' + searchTerm);
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