import Head from 'next/head'

import { Button, Grid, Stack, Typography } from "@mui/material";
import Timer from '../components/timer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Chess Timer</title>
        <meta name="description" content="Chess timer next.js app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container height="100vh" alignItems="center" justifyContent="center" direction="column">
        <Typography variant='h2'>Chess Timer</Typography>
        <Timer />
      </Grid>
    </>
  )
}
