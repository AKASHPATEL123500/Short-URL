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

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok ji",
    statusCode: 200,
    message: "Successfully Helth Check!",
  });
});

app.get("/check", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    statusCode: 200,
    message: "Successfully Helth Check! by Akash reddy..................",
  });
});

export { app };
