import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { Typography } from "@mui/joy";
import { Box, Button, Modal, TextField } from "@mui/material";
import WebFont from "webfontloader";
// import { SnackbarProvider, useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
function App() {
  // const { enqueueSnackbar } = useSnackbar();
  const [currUser, setcurrUser] = useState(null);
  const [open, setOpen] = useState(true);
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
    console.log(currUser);
  };
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Droid Sans", "Kanit"],
      },
    });
  }, []);
  return (
    // <SnackbarProvider maxSnack={3} translate="yes">
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
          variant="outlined"
          color="success"
          size="small"
          sx={{ mt: 1, fontFamily: "Kanit", fontSize: "100%" }}
          disabled={
            currUser?.length <= 3 || currUser?.length >= 10 || currUser === null
          }
          onClick={handleSubmitName}
          fullWidth
          startIcon={<ThumbUpAltIcon />}
        >
          CONFIRM
        </Button>
      </Box>
    </Modal>
    // </SnackbarProvider>
  );
}

export default App;
