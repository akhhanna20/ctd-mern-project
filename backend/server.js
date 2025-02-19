import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import errorHandler from "./helpers/errorHandler.js";

dotenv.config();
const app = express();

// CORS configuration
// const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

const port = process.env.PORT || 8000;
app.get("/tasks", (req, res) => {
  res.send("Server is running");
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//error handler middleware
app.use(errorHandler);

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
