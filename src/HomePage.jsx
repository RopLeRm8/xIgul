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
import { useCallback, useEffect, useRef, useState } from "react";

const socket = io("http://127.0.0.1:3000");
function App() {
  const [currUser, setcurrUser] = useState(null);
  const [open, setOpen] = useState(true);
  const [cells, setCells] = useState(Array(9).fill(""));
  // const [cellCharacter, setCellCharacter] = useState(null);
  const [userNames, setUserNames] = useState([]);
  const [error, setError] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [localPlayer, setLocalPlayer] = useState();
  const [enemyPlayer, setEnemyPlayer] = useState();
  const [alert, setAlert] = useState("");
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const turns = useRef();
  useEffect(() => {
    let timeout;
    socket.on("connectedUsers", (connected, username) => {
      setAlert(
        connected ? `User ${username} joined` : `User ${username} disconnected`
      );

      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        setAlert("");
      }, 5000);
      if (!connected) {
        setCells(Array(9).fill(""));
        localPlayer.ishesturn = false;
      }
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
    socket.on("sendError", () => {
      setOpen(true);
      setError("The room you trying to enter is full");
    });
    socket.on("sendTurnBroadcast", (num, simanGiven, userNamesGiven) => {
      turns.current.classList.add("bounce-in-fwd");
      setTimeout(() => {
        turns.current.classList.remove("bounce-in-fwd");
      }, 500);
      userNamesGiven.map((user) => {
        if (user.isLocal && socket.id === user.id) {
          setLocalPlayer((prev) => ({ ...prev, ishesturn: user.ishesturn }));
          setEnemyPlayer((prev) => ({ ...prev, ishesturn: !user.ishesturn }));
        } else if (!user.isLocal && socket.id === user.id) {
          setLocalPlayer((prev) => ({ ...prev, ishesturn: user.ishesturn }));
          setEnemyPlayer((prev) => ({ ...prev, ishesturn: !user.ishesturn }));
        }
      });

      setCells((prev) => ({
        ...prev,
        [num]: { siman: simanGiven, isActive: true },
      }));
    });
  }, [localPlayer, enemyPlayer, cells]);
  // const { enqueueSnackbar } = useSnackbar();

  const handleChangeUser = (e) => {
    setcurrUser(e.target.value);
  };
  const handleCloseModal = useCallback((_, reason) => {
    if (reason === "backdropClick") return;
    setOpen(false);
  }, []);
  const handleSubmitName = (e) => {
    e.preventDefault();

    setOpen(false);
    if (currUser) {
      socket.emit("setUserName", currUser, sessionID);
    }
  };

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Droid Sans", "Kanit"],
      },
    });
  }, []);
  const Cell = useCallback(
    ({ num }) => {
      const [localCells, setLocalCells] = useState(cells);

      useEffect(() => {
        if (localCells !== cells) {
          socket.emit("sendTurn", num, localPlayer?.whatside, sessionID);
          socket.emit("checkwinner", localCells, sessionID);
          socket.on("winnerfound", (username) => {
            if (typeof username === "boolean") {
              setWinnerName("TIE!");
            } else {
              setWinnerName(
                username === localPlayer?.username
                  ? "you win"
                  : `${username} wins`
              );
            }
            setWinnerModalOpen(true);
          });
        }
      }, [localCells, localPlayer, socket, setWinnerName, setWinnerModalOpen]);

      const handleClick = () => {
        if (!localCells[num] && localPlayer?.ishesturn) {
          setLocalCells((prev) => ({
            ...prev,
            [num]: { siman: localPlayer?.whatside, isActive: true },
          }));
        }
      };

      return (
        <td onClick={handleClick} style={{ width: "7vmax" }}>
          <Box
            sx={{
              display: localCells[num]?.isActive ? "flex" : "none",
              justifyContent: "center",
              color: "black",
            }}
          >
            {localCells[num]?.siman}
          </Box>
        </td>
      );
    },
    [cells, socket, localPlayer, setWinnerName, setWinnerModalOpen]
  );
  return (
    // <SnackbarProvider maxSnack={3} translate="yes">
    <>
      <CssVarsProvider />
      {sessionID && !open ? (
        <Typography
          sx={{
            fontSize: "200%",
            color: "green",
            fontFamily: "Kanit",
          }}
        >
          Session ID: {sessionID}
        </Typography>
      ) : null}
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
              whiteSpace: "nowrap",
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
          <TextField
            sx={{ mt: 2 }}
            placeholder="Session ID - 4 numbers atleast"
            type="number"
            variant="standard"
            fullWidth
            inputProps={{
              style: {
                textAlign: "center",
                fontFamily: "Kanit",
                fontSize: "100%",
              },
            }}
            value={sessionID}
            onChange={(e) => setSessionID(e.target.value)}
          />
          {error ? (
            <Chip
              variant="solid"
              color="danger"
              sx={{
                display: "flex",
                justifyContent: "center",
                fontFamily: "Kanit",
                fontSize: "120%",
                textAlign: "center",
                mt: 2,
                borderRadius: "0px",
              }}
            >
              {error}
            </Chip>
          ) : null}
          <MUIButton
            variant="contained"
            color="inherit"
            size="small"
            sx={{ mt: 1, fontFamily: "Kanit", fontSize: "100%" }}
            disabled={
              currUser?.length <= 3 ||
              currUser?.length >= 15 ||
              currUser === null ||
              sessionID?.length <= 3
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
                sx={{
                  fontSize: "200%",
                  display: open ? "none" : "flex",
                  color: "green",
                  fontFamily: "Kanit",
                }}
              >
                You {`[${localPlayer?.whatside}]`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  fontSize: "150%",
                  display: open ? "none" : "flex",
                  fontFamily: "Kanit",
                }}
              >
                VERSUS
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                sx={{
                  fontSize: "200%",
                  display: open ? "none" : "flex",
                  color: "red",
                  fontFamily: "Kanit",
                }}
              >
                {enemyPlayer?.username &&
                  `${enemyPlayer?.username} [${enemyPlayer?.whatside}]`}
              </Typography>
            </Grid>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex" }}>
              <Chip variant="solid" color="info" size="sm">
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
          </>
        )}

        <Grid item>
          <Typography
            ref={turns}
            sx={{
              fontSize: "150%",
              display:
                localPlayer !== undefined && localPlayer !== null && !winnerName
                  ? "flex"
                  : "none",
              fontWeight: 700,
            }}
          >
            {localPlayer?.ishesturn
              ? "Your turn"
              : `${enemyPlayer?.username}'s turn`}
          </Typography>
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

      <Modal open={winnerModalOpen} disableEscapeKeyDown>
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
              whiteSpace: "nowrap",
            }}
          >
            {winnerName ? winnerName : null}
          </Typography>
        </Box>
      </Modal>
    </>
    // </SnackbarProvider>
  );
}

export default App;
