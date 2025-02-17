import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "node:fs";

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

app.get("/tasks", (req, res) => {});

//middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
const routeFiles = fs.readdirSync("./backend/routes");

routeFiles.forEach((file) => {
  //use dynamic imports
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1", route.default);
    })
    .catch((error) => {
      console.log("Failed to load route: ", error);
    });
});

const server = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

server();
