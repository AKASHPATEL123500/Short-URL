import { app } from "./index.js";

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || "localhost";
const backlog = process.env.BACKLOG || 50;

app.listen(port, hostname, backlog, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});
