import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Alert, Button, Chip, CssVarsProvider, Typography } from "@mui/joy";
import {
  Box,
  Grid,
  Button as MUIButton,
  Modal,
  TextField,
} from "@mui/material";
import io from "socket.io-client";
import WebFont from "webfontloader";
import "./css/App.css";
// import { SnackbarProvider, useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

const charactersArray = ["X", "O"];
const socket = io("http://10.9.23.6:3000");
function App() {
  const [currUser, setcurrUser] = useState(null);
  const [open, setOpen] = useState(true);
  const [cells, setCells] = useState(Array(9).fill(""));
  const [cellCharacter, setCellCharacter] = useState(null);
  const [userNames, setUserNames] = useState([]);
  const [localPlayer, setLocalPlayer] = useState();
  const [enemyPlayer, setEnemyPlayer] = useState();
  const [alert, setAlert] = useState("");
  useEffect(() => {
    let timeout;
    socket.on("connect", () => {
      console.log("Connected with ID:", socket.id);
    });
    socket.on("connectedUsers", (connected, id, addr) => {
      if (socket.id !== id) {
        setAlert(
          connected
            ? `User ${id} with IP ${addr} joined`
            : `User ${id} disconnected, waiting 4 seconds until he reconnects`
        );
      }
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        setAlert("");
      }, 5000);
    });
    socket.on("startGame", (userNames) => {
      setUserNames(userNames);
      userNames.map((user) => {
        if (user.isLocal && socket.id === user.id) {
          setLocalPlayer(user);
          setEnemyPlayer(userNames.find((u) => !u.isLocal) || null);
        } else if (!user.isLocal && socket.id === user.id) {
          setLocalPlayer(user);
          setEnemyPlayer(userNames.find((u) => u.isLocal) || null);
        }
      });
    });
    socket.on("reloadPage", () => {
      location.reload();
    });
  }, [localPlayer, enemyPlayer]);
  // const { enqueueSnackbar } = useSnackbar();

  const handleChangeUser = (e) => {
    setcurrUser(e.target.value);
    console.log(currUser);
  };
  const handleCloseModal = useCallback((_, reason) => {
    if (reason === "backdropClick") return;
    setOpen(false);
  }, []);
  const handleSubmitName = (e) => {
    e.preventDefault();
    setOpen(false);
    const rand = Math.floor(Math.random() * charactersArray.length);
    setCellCharacter(charactersArray[rand]);

    if (currUser) {
      socket.emit("setUserName", currUser);
    }
  };
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Droid Sans", "Kanit"],
      },
    });
  }, []);
  const Cell = ({ num }) => {
    return (
      <td
        onClick={() => {
          setCells((prev) => ({ ...prev, [num]: true }));
        }}
        style={{ width: "7vmax" }}
      >
        <Box
          className="bounce-in-fwd"
          sx={{
            display: cells[num] ? "flex" : "none",
            justifyContent: "center",
          }}
        >
          {cellCharacter}
        </Box>
      </td>
    );
  };
  return (
    // <SnackbarProvider maxSnack={3} translate="yes">
    <>
      <CssVarsProvider />
      <Modal open={open} onClose={handleCloseModal} disableEscapeKeyDown>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30vmax",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 6,
            borderRadius: "15px",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              fontSize: "250%",
              fontFamily: "Kanit",
            }}
          >
            Welcome to xIgul
          </Typography>
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              fontFamily: "Kanit",
            }}
            startDecorator={<ArrowDownwardIcon />}
          >
            Choose a nickname to continue
          </Typography>

          <TextField
            sx={{ mt: 2 }}
            placeholder="Something easy"
            variant="standard"
            onChange={handleChangeUser}
            fullWidth
            inputProps={{
              style: {
                textAlign: "center",
                fontFamily: "Kanit",
                fontSize: "160%",
              },
            }}
          />
          <MUIButton
            variant="contained"
            color="inherit"
            size="small"
            sx={{ mt: 1, fontFamily: "Kanit", fontSize: "100%" }}
            disabled={
              currUser?.length <= 3 ||
              currUser?.length >= 15 ||
              currUser === null
            }
            onClick={handleSubmitName}
            fullWidth
            startIcon={<ThumbUpAltIcon />}
          >
            CONFIRM
          </MUIButton>
        </Box>
      </Modal>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "80vh" }}
        spacing={3}
      >
        {alert ? (
          <Alert
            color={
              alert.substring(alert.length - 6) === "joined"
                ? "success"
                : "danger"
            }
            variant="outlined"
            sx={{ mb: 1 }}
          >
            {alert}
          </Alert>
        ) : null}
        {userNames && userNames.length > 1 ? (
          <>
            <Grid item>
              <Typography
                sx={{ fontSize: "250%", display: open ? "none" : "flex" }}
              >
                {localPlayer.username && `Username : ${localPlayer.username}`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                sx={{ fontSize: "250%", display: open ? "none" : "flex" }}
              >
                {enemyPlayer.username && `Enemy : ${enemyPlayer.username}`}
              </Typography>
            </Grid>
          </>
        ) : (
          <Box sx={{ display: "flex", zIndex: 1350 }}>
            <Chip variant="solid" color="info" size="lg" title="hello">
              <Button
                variant="plain"
                loadingPosition="start"
                loading
                size="sm"
                sx={{ mr: 1 }}
              >
                <Typography sx={{ color: "white" }}>
                  Waiting for players...
                </Typography>
              </Button>
            </Chip>
          </Box>
        )}

        <Grid item>
          <Typography sx={{ fontSize: "150%" }}>Tic tac Toe</Typography>
        </Grid>
        <Grid item>
          <table className="">
            <tbody>
              <tr>
                <Cell num={0} />
                <Cell num={1} />
                <Cell num={2} />
              </tr>
              <tr>
                <Cell num={3} />
                <Cell num={4} />
                <Cell num={5} />
              </tr>
              <tr>
                <Cell num={6} />
                <Cell num={7} />
                <Cell num={8} />
              </tr>
            </tbody>
          </table>
        </Grid>
      </Grid>
    </>
    // </SnackbarProvider>
  );
}

export default App;
