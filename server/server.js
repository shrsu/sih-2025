// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import connectToMongo from "./src/configs/mongoConfig.js";
import { startCron } from "./src/cron/processCalls.js";
import reconRoutes from "./src/routes/reconRoutes.js";
import registerRoutes from "./src/routes/registerRoutes.js"; 
import inventoryRoutes from "./src/routes/pharmaRoutes.js";
import loginRoutes from "./src/routes/loginRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running with MongoDB!");
});

app.use("/api", reconRoutes);
app.use("/api", registerRoutes);
app.use("/api", loginRoutes);
app.use("/api", inventoryRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  connectToMongo();
  console.log(`Server listening at http://localhost:${PORT}`);
  startCron();
});
