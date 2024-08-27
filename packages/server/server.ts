import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("hello"));
app.use("/records", routes.Records);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
