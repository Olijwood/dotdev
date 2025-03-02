import path from "path";
import express from "express";

const app = express();
const PORT = 3001;

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.listen(PORT, () => {
    console.log(`Static file server running at http://localhost:${PORT}`);
});
