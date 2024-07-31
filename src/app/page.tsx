"use client";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import items from "./items";
import { useState, useEffect, SetStateAction } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  onSnapshot,
  QuerySnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

interface Item {
  name: string;
  price: number;
  amount: number;
  id: string;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Home() {
  const [pantry, setPantry] = useState<Item[]>([]);
  const [item, setItem] = useState({ name: "", amount: 0, price: 0 });
  const [error, setError] = useState(false);

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setItem((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // add item to database
  const submitItem = async () => {
    if (item.amount > 0 && item.price > 0 && item.name !== "") {
      setItem({ name: "", amount: 0, price: 0 });
      setError(false);
      await addDoc(collection(db, "pantry"), {
        name: item.name,
        price: Number(item.price),
        amount: Number(item.amount),
      });
    } else {
      setError(true);
    }
  };

  // read/storing items from database
  useEffect(() => {
    const q = query(collection(db, "pantry"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let pantryArr: SetStateAction<Item[]> = [];

      querySnapshot.forEach((doc) => {
        const item = doc.data() as Item;
        pantryArr.push({ ...item, id: doc.id });
      });
      setPantry(pantryArr);
    });
  }, []);

  //delete items from database
  function removeItem(index: number) {
    setPantry((prevItems) => prevItems.filter((_, i) => i !== index));
    const id = pantry[index].id;
    const docRef = doc(db, "pantry", id);
    deleteDoc(docRef)
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

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
        <Box sx={{ bgcolor: "#181818", p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginBottom: 4,
            }}
          >
            <TextField
              name="name"
              id="outlined-basic"
              label="Enter Item"
              variant="outlined"
              value={item.name}
              onChange={handleChange}
              required
              error={error}
              helperText={error ? "This field is required" : ""}
            />
            <TextField
              name="amount"
              id="outlined-basic"
              label="Quantity"
              variant="outlined"
              type="number"
              value={item.amount}
              onChange={handleChange}
              required
              error={error}
              helperText={error ? "This field is required" : ""}
            />
            <TextField
              name="price"
              id="outlined-basic"
              label="Base Price"
              variant="outlined"
              type="number"
              value={item.price}
              onChange={handleChange}
              required
              error={error}
              helperText={error ? "This field is required" : ""}
            />
            <Button variant="contained" onClick={submitItem}>
              <Typography variant="h6">+</Typography>
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            {pantry.map((item, index) => (
              <Paper
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  gap: "16px",
                  p: "1rem",
                  elevation: "3",
                }}
              >
                <Typography variant="h5">{item.name}</Typography>
                <Typography variant="h5">
                  ${item.price * item.amount}
                </Typography>
                <Typography variant="h5">x{item.amount}</Typography>
                <Button onClick={() => removeItem(index)}>X</Button>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
