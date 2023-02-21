import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Typography } from "@mui/joy";
import { Box, Button, Modal, TextField,Grid } from "@mui/material";
import WebFont from "webfontloader";
import "./css/App.css"
// import { SnackbarProvider, useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
function App() {
  // const { enqueueSnackbar } = useSnackbar();
  const [currUser, setcurrUser] = useState(null);
  const [open, setOpen] = useState(true);
  const [cells, setCells] = useState(Array(9).fill(""));
  const handleChangeUser = (e) => {
    setcurrUser(e.target.value);
    console.log(currUser);
  };
  const handleCloseModal = useCallback((_, reason) => {
    if (reason === "backdropClick") return;
    setOpen(false);
  }, []);
  const handleSubmitName = () => {
    setOpen(false);
  };
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Droid Sans", "Kanit"],
      },
    });
  }, []);
  const Cell = ({ num }) => {
    return <td onClick={() => handleClick(num)}>{cells[num]}</td>;
  };
  return (
    // <SnackbarProvider maxSnack={3} translate="yes">
    <>
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
        <Button
          variant="contained"
          color="inherit"
          size="small"
          sx={{ mt: 1, fontFamily: "Kanit", fontSize: "100%" }}
          disabled={
            currUser?.length <= 3 || currUser?.length >= 15 || currUser === null
          }
          onClick={handleSubmitName}
          fullWidth
          startIcon={<ThumbUpAltIcon />}
        >
          CONFIRM
        </Button>
      </Box>
    </Modal>
    <Grid container direction = "column" justifyContent = "center" alignItems = "center">
      <Grid item> 
    <Typography>Tic tac Toe</Typography>
    </Grid>
    <Grid item>
    <table className="">
            <tbody>
              <tr>
                <Cell num={0} className="nonBorder" />
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
