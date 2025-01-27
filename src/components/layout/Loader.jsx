import React from 'react'
import Grid from '@mui/material/Grid2'
import { Skeleton } from '@mui/material'

const Loader = () => {
    console.log("Loading got called...")
  return (
    <Grid container sx={{
        height: "calc(100vh - 3.5rem)", // Use sx for styles
    }} spacing={'1rem'}>
            <Grid size={{ xs: 0, md: 3 }} sx={{
                    height: "100%",
                    display: { xs: "none", sm: "block" },
                }}
            >
                <Skeleton variant='rectangular' height={'100vh'}/>
            </Grid>

            <Grid size={{ xs: 12, sm:8 ,md: 5, lg:6  }} sx={{
                    height: "100%",
                    bgcolor: "primary.main",
                }}
            >
                {
                    Array.from({length:10}).map((_,index)=>(
                        <Skeleton key={index} variant='rectangular' height={'5rem'}/>
                    ))
                }
            </Grid>

            <Grid item md={4} lg={3} size={{ md: 4, lg:3 }} sx={{
                    height: "100%",
                    display: { xs: "none", md: "block" },
                }}
            >
                <Skeleton variant='rectangular' height={'100vh'}/>
            </Grid>
    </Grid>
  )
}

export default Loader