import express from "express";

const app = express();
const port = process.env.PORT || 4001;

app.use("/assets", express.static("assets"));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
