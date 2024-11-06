import {ReactNode} from "react";
import {Box} from "@mui/material";
import {useAppSelector} from "../../hooks.ts";
import {ConfigState} from "../../redux/configSlice.ts";

export default function Footer() : ReactNode | null {

    const config : ConfigState = useAppSelector((state) => state.config);

    return (
        <footer>
            Datalinks <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank">AGPL-3.0</a>
            <Box display="flex" justifyContent="center" hidden={!import.meta.env.VITE_IS_DEV}>
                {config.value['DELETE_LEVEL']}
                <ul>
                </ul>
            </Box>
        </footer>
    );
}