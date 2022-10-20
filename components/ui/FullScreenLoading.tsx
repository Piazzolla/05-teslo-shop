import { Typography, Box, CircularProgress } from "@mui/material"
import React from "react"



export const FullScreenLoading = () => {
    return (
        <Box
            display='flex'
            justifyContent='center'
            flexDirection={'column'}
            alignItems='center'
            height='calc(100vh -200px)'
        >
            <Typography sx={{ mb: 3 }}>Cargando...</Typography>
            <CircularProgress thickness={2} />
        </Box>

    )
}


