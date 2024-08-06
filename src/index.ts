import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(cookieParser());

app.listen(5001, () => console.log("Works"));
