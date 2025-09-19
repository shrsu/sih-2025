// server.js
import express from "express";
import dotenv from "dotenv";
import connectToMongo from "./src/configs/mongoConfig.js";

// Load env variables
dotenv.config();

// Connect to DB
connectToMongo();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running with MongoDB!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at Port${PORT}`);
});
