import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import errorHandler from "./helpers/errorHandler.js";
import path from "path";
import userRoute from "./routes/userRoute.js";
import tasksRoute from "./routes/tasksRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

const __dirname = path.resolve();

//middleware
app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "https://ctd-mern-project-hanna.onrender.com", // Set this to the correct URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1", userRoute);
app.use("/api/v1", tasksRoute);

//error handler middleware
app.use(errorHandler);

//routes
//const routeFiles = fs.readdirSync("./backend/routes");
const routeFiles = fs.readdirSync(path.join(__dirname, "backend", "routes"));
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

//set static folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

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
