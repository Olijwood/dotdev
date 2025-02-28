import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const app = express();
const port = process.env.PORT || 4001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
