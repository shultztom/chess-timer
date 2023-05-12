import { useState, useEffect, use } from "react";
import { Button, Box, Grid, Stack, Typography } from "@mui/material";
import { Duration } from "luxon";
import { setIntervalAsync, clearIntervalAsync, SetIntervalAsyncTimer } from 'set-interval-async';


export default function Timer() {
  const [startTime, setStartTime] = useState(5 * 60) // TODO prompt user for, start with 5 minutes in seconds
  const [increment, setIncrement] = useState(5); // TODO prompt user for, start with 5 seconds
  const [isGameActive, setIsGameActive] = useState(false);
  const [activePlayer, setActivePlayer] = useState("white") // Will be "white" or "black"
  const [whiteTime, setWhiteTime] = useState(Duration.fromObject({ seconds: 300 })); // TODO remove hardcode after prompt user 
  const [blackTime, setBlackTime] = useState(Duration.fromObject({ seconds: 300 })); // TODO remove hardcode after prompt user
  const [timer, setTimer] = useState<null | SetIntervalAsyncTimer<[]>>(null);

  useEffect(() => {
    if (isGameActive) {
      // Set base player
      // setWhiteTime(Duration.fromObject({ seconds: startTime }));
      // setBlackTime(Duration.fromObject({ seconds: startTime }));

      // Start white time
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
      newTime = newTime?.minus({ milliseconds: 100 });

      if (player === "white") {
        await setWhiteTime(newTime);
      } else {
        await setBlackTime(newTime);
      }
    }, 100);

    await setTimer(newTimer);
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

    toggleTurns(newActivePlayer);
  }

  return (
    <Box>
      <Button variant="contained" onClick={() => setIsGameActive(true)} disabled={isGameActive}>Start Game</Button>
      <Button variant="contained" onClick={() => endTurn()} disabled={!isGameActive}>End Turn</Button>

      <Typography variant='body1' > Game Mode: {startTime / 60} Minutes w/ {increment} seconds increment</Typography>

      <Typography variant='h2' > White: {whiteTime?.toFormat('m:ss')}</Typography>
      <Typography variant='h2' > Black: {blackTime?.toFormat('m:ss')}</Typography>
    </Box>

  )
}
