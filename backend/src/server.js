import { connectDB } from "./config/db.js";
import { app } from "./index.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.argv[2] || 12000;

app.listen(port, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${port}`);
});
