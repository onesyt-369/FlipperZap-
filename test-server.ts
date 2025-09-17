import express from "express";
import { createServer } from "http";

const app = express();
app.get("/", (req, res) => res.send("Hello"));

const server = createServer(app);
server.listen(5000, () => {
  console.log("Server running on port 5000");
});