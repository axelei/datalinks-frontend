import {ReactNode} from "react";
import {Box, CircularProgress} from "@mui/material";

export default function SuspenseFallback(): ReactNode {
    return (
        <Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
            <CircularProgress />
        </Box>
    );
}
