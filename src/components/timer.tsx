import {useState, useEffect} from "react";
import {
    Button,
    Box,
    Grid,
    Typography,
    Select,
    MenuItem,
    FormLabel,
    SelectChangeEvent
} from "@mui/material";
import {Duration} from "luxon";
import {setIntervalAsync, clearIntervalAsync, SetIntervalAsyncTimer} from 'set-interval-async';


export default function Timer() {
    const [startTime, setStartTime] = useState(5 * 60)
    const [increment, setIncrement] = useState(5)
    const [isGameActive, setIsGameActive] = useState(false);
    const [activePlayer, setActivePlayer] = useState("white") // Will be "white" or "black"
    const [whiteTime, setWhiteTime] = useState(Duration.fromObject({seconds: 300}));
    const [blackTime, setBlackTime] = useState(Duration.fromObject({seconds: 300}));
    const [timer, setTimer] = useState<null | SetIntervalAsyncTimer<[]>>(null);
    const [gameOver, setGameOver] = useState<boolean>(false);

    useEffect(() => {
        if (isGameActive) {
            // Start white time to start game
            toggleTurns("white");
        }

    }, [isGameActive]);

    const toggleTurns = async (player: string) => {
        if (timer) {
            await clearIntervalAsync(timer);
        }

        let startingPlayerTime: Duration;
        if (player === "white") {
            startingPlayerTime = whiteTime;
        } else {
            startingPlayerTime = blackTime;
        }

        let newTime = startingPlayerTime;
        const newTimer = setIntervalAsync(async () => {
            // Check if game over
            const testValueMs = newTime.as('milliseconds');
            if (testValueMs - 100 < 0) {
                await exitGame();
                return;
            }

            newTime = newTime?.minus({milliseconds: 100});

            if (player === "white") {
                await setWhiteTime(newTime);
            } else {
                await setBlackTime(newTime);
            }
        }, 100);

        if (!gameOver) {
            await setTimer(newTimer);
            return
        }


    }

    const endTurn = async () => {
        // Add Increment
        if (activePlayer === "white") {
            await setWhiteTime(whiteTime?.plus({seconds: increment}));
        } else {
            await setBlackTime(blackTime?.plus({seconds: increment}));
        }

        // Switch Players
        let newActivePlayer;
        if (activePlayer === "white") {
            newActivePlayer = "black"
        } else {
            newActivePlayer = "white"
        }
        await setActivePlayer(newActivePlayer);

        await toggleTurns(newActivePlayer);
    }

    const handleTimeChange = (event: SelectChangeEvent) => {
        const timeInMinutes = event.target.value;
        const timeInSeconds = parseInt(timeInMinutes, 10) * 60;

        setWhiteTime(Duration.fromObject({seconds: timeInSeconds}))
        setBlackTime(Duration.fromObject({seconds: timeInSeconds}))

        setStartTime(timeInSeconds);
    }

    const handleIncrementChange = (event: SelectChangeEvent) => {
        const timeInSeconds = event.target.value;
        const timeInSecondsInt = parseInt(timeInSeconds, 10);
        setIncrement(timeInSecondsInt);
    }

    const exitGame = async () => {
        await setGameOver(true);
        await setIsGameActive(false);
        if (timer) {
            await clearIntervalAsync(timer);
        }
        await setTimer(null);
    }

    const resetGame = () => {
        setStartTime(5 * 60);
        setIncrement(5);
        setIsGameActive(false);
        setActivePlayer("white");
        setWhiteTime(Duration.fromObject({seconds: 300}));
        setBlackTime(Duration.fromObject({seconds: 300}));
        setTimer(null);
        setGameOver(false);
    }

    return (
        <div>
            <Box>
                <Grid container
                      spacing={1}
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                >
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={() => setIsGameActive(true)}
                                disabled={isGameActive || gameOver}>Start
                            Game</Button>
                    </Grid>

                    <Grid container
                          spacing={0}
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          marginTop={2}>

                        <Grid item xs={6}>
                            <FormLabel>Game Time</FormLabel>
                            <Select
                                labelId="Game Time"
                                id="game-time"
                                value={`(${startTime} / 60)`}
                                onChange={handleTimeChange}
                                disabled={isGameActive}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={30}>30</MenuItem>
                            </Select>
                        </Grid>

                        <Grid item xs={6}>
                            <FormLabel>Increment Time</FormLabel>
                            <Select
                                labelId="Increment Time"
                                id="increment-time"
                                value={`${increment}`}
                                onChange={handleIncrementChange}
                                disabled={isGameActive}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={15}>15</MenuItem>
                            </Select>
                        </Grid>
                    </Grid>

                    <Typography variant='body1'> Game Mode: {startTime / 60} Minutes w/ {increment} seconds
                        increment</Typography>

                </Grid>

                <Grid container
                      spacing={1}
                      direction="column"
                      alignItems="center"
                      justifyContent="center">
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={() => endTurn()} disabled={!isGameActive}>End Turn</Button>
                    </Grid>
                </Grid>

                <Grid container
                      spacing={1}
                      direction="column"
                      alignItems="center"
                      justifyContent="center">
                    <Typography variant='h2'> White: {whiteTime?.toFormat('m:ss')}</Typography>
                </Grid>

                <Grid container
                      spacing={1}
                      direction="column"
                      alignItems="center"
                      justifyContent="center">
                    <Typography variant='h2'> Black: {blackTime?.toFormat('m:ss')}</Typography>
                </Grid>

                <Grid container
                      spacing={1}
                      direction="column"
                      alignItems="center"
                      justifyContent="center">
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <Button variant="contained" color="error" onClick={() => exitGame()}
                                    disabled={!isGameActive}>End Game</Button>
                        </Grid>
                    </Grid>
                </Grid>


                {gameOver &&
                    <Grid container
                          spacing={1}
                          direction="column"
                          alignItems="center"
                          justifyContent="center">
                        <Grid item xs={12}>
                            <Typography variant='body1'> Game Over!</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={() => resetGame()}>Reset Game</Button>
                        </Grid>
                    </Grid>}
            </Box>
        </div>
    )
}
