import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.get("/", (req, res) => {
  const running_port = req.socket.localPort;
  res.send(
    `Hello! Yeh response Server aa raha hai jiska Port hai: ${running_port}`,
  );
});

export { app };
