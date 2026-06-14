import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const SERVER_NAME = process.env.SERVER_NAME || "Unknown";

app.get("/", (req, res) => {
  const running_port = req.socket.localPort;
  res.send(
    `Hello! Yeh response Server aa raha hai jiska Port hai: ${running_port} and Response from ${SERVER_NAME}`,
  );
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok ji",
    statusCode: 200,
    message: "Successfully Helth Check!",
  });
});

export { app };
