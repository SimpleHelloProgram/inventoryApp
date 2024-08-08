"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, getDocs, query, setDoc, deleteDoc, doc, getDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]); // New state for filtered inventory
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchInput, setSearchInput] = useState(''); // New state for search input

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    filterInventory(inventoryList, searchInput); // Filter inventory based on search input
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updateInventory();
  };

  const filterInventory = (inventoryList, searchInput) => { // New function to filter inventory
    const filteredList = inventoryList.filter(item =>
      item.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredInventory(filteredList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    filterInventory(inventory, searchInput); // Filter inventory when search input changes
  }, [searchInput]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display={"flex"} justifyContent="center" flexDirection={"column"} alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box
          position={"absolute"}
          top="50%"
          left={"50%"}
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width={"100%"} direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button variant="outlined" onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>

     

      <Box border={"1px solid #333"} width={"800px"} mt={2}>
        <Box
          width={"800px"}
          height="100px"
          bgcolor={"#ADD8E6"}
          display="flex"
          alignItems={"center"}
          justifyContent="center"
        >
          <Typography variant="h2" color={"#333"}>
            Inventory Item
          </Typography>
        </Box>
        <Box alignItems={"center"}
            justifyContent="center"
            display={"flex"}>
            <TextField
            label="Search" // New search input field
            variant="outlined"
            value={searchInput}
            fullWidth
            onChange={(e) => setSearchInput(e.target.value)}
            />
        </Box>
       
      
        <Stack width={"800px"} height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => ( // Use filtered inventory instead of full inventory
            <Box 
            key={name} 
            width="100%" 
            minHeight={"150px"} 
            display="flex" 
            alignItems={"center"} 
            justifyContent="space-between" 
            bgcolor="#f0f0f0"
            padding={5}>
              <Typography variant="h3" color={"#333"} textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h4" color={"#333"} textAlign="center">
                {quantity}
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <Button variant="contained" onClick={() => addItem(name)} color="success">
                    Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)} color="error">
                    Remove
                </Button>
                <Button variant="contained" onClick={() => deleteItem(name)} color="error">
                    Remove All
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
      
      <Button variant="contained" onClick={handleOpen} mt={2}>
        Add new Item
      </Button>
    </Box>
  );
}
