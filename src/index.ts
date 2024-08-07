import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(cookieParser());

import UserRouter from "./routes/user";
app.use("/users", UserRouter);

app.listen(5001);
