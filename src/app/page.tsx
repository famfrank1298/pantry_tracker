"use client";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
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
  updateDoc,
} from "firebase/firestore";
import { db, Item } from "./firebase";

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
    console.log("name: ", name);

    if (name == "amount" || name == "price") {
      // remove the leading zero in the textfield
      let newValue = value.replace(/^0+/, "") || "0";
      setItem((prevValues) => ({
        ...prevValues,
        [name]: newValue,
      }));
    } else {
      setItem((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
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

  // delete items from database
  const removeItem = async (index: number) => {
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
  };

  // update item from database
  const increaseItemCount = async (index: number) => {
    const id = pantry[index].id;
    const docRef = doc(db, "pantry", id);
    await updateDoc(docRef, {
      amount: pantry[index].amount + 1,
    });
  };

  const decreaseItemCount = async (index: number) => {
    const id = pantry[index].id;
    const docRef = doc(db, "pantry", id);
    const newVal = pantry[index].amount - 1;
    if (newVal <= 0) {
      removeItem(index);
    } else {
      await updateDoc(docRef, {
        amount: newVal,
      });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ bgcolor: "#191970" }}>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
            gap: "30px",
            backgroundImage: `url('/star_bg.gif')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: "80%",
            boxShadow: "0 0 10px white",
          }}
        >
          <Typography variant="h3" sx={{ textShadow: "0 0 3px white" }}>
            {" "}
            Pantry Tracker
          </Typography>
          <Box
            sx={{
              bgcolor: "#191970",
              p: 3,
              border: "3px solid white",
              boxShadow: "0 0 10px white",
            }}
          >
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
                inputProps={{ min: 1 }}
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
                inputProps={{ min: 0.01 }}
                required
                error={error}
                helperText={error ? "This field is required" : ""}
              />
              <Button
                variant="contained"
                onClick={submitItem}
                sx={{ "&:hover": { boxShadow: "0 0 2px white" } }}
              >
                <Typography variant="h6">+</Typography>
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: "15px",
                height: "250px",
                overflowY: "scroll",
                padding: "5px",
              }}
            >
              {pantry.length > 0 ? (
                pantry.map((item, index) => (
                  <Paper
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      p: "1rem",
                      elevation: "3",
                      bgcolor: "transparent",
                      boxShadow: "0 0 5px white",
                    }}
                  >
                    <Typography variant="h6">{item.name}</Typography>
                    <Box>
                      <Typography component="span"> Price:</Typography>{" "}
                      <Typography component="span" variant="h6">
                        ${item.price * item.amount}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography component="span">Quantity:</Typography>{" "}
                      <Typography component="span" variant="h6">
                        x{item.amount}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Button
                        onClick={() => increaseItemCount(index)}
                        sx={{
                          "&:hover": { boxShadow: "0 0 2px white" },
                        }}
                      >
                        ▲
                      </Button>
                      <Button
                        onClick={() => decreaseItemCount(index)}
                        sx={{ "&:hover": { boxShadow: "0 0 2px white" } }}
                      >
                        ▼
                      </Button>
                      <Button
                        onClick={() => removeItem(index)}
                        sx={{ "&:hover": { boxShadow: "0 0 2px white" } }}
                      >
                        X
                      </Button>
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Typography sx={{ textAlign: "center" }}>
                  There are currently no items in your pantry
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
