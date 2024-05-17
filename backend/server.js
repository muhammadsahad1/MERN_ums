import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connetDB from "./config/db.js";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 3000;

// Routes 
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";

connetDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// using routes
app.use("/api/admin",adminRouter)
app.use("/api/users", userRouter);

app.get("/", (req, res) => res.send("hai from server"));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
