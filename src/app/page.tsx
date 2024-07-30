"use client";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          gap: "30px",
          bgcolor: "#212121",
        }}
      >
        <Typography variant="h3"> Pantry Tracker</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            p: "2rem",
          }}
        >
          <TextField id="filled-basic" label="Enter Item" variant="filled" />
          <TextField id="outlined-basic" label="Quantity" variant="outlined" />
          <Button variant="contained">+</Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
