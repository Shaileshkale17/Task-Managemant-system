import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ConnectAPi from "./database/indedx.js";
import UserRouter from "./router/user.routes.js";
import TaskRouter from "./router/Task.routes.js";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN || "*",
  })
);

app.use(express.json());

app.use("/api/user", UserRouter);
app.use("/api/task", TaskRouter);

ConnectAPi()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("runing on ", process.env.PORT || 3000);
    });
  })
  .catch((err) => {
    console.log(err);
  });
