import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connetDB from "./config/db.js";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 3001;
import userRoutes from "./routes/userRouter.js";

connetDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("hai from server"));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
