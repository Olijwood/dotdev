import path from "path";
import { cwd } from "process";
import express from "express";

const app = express();
const port = process.env.PORT || 4001;

app.use("/assets", express.static(path.join(cwd(), "assets")));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
