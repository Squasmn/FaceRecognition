import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import { connectToDb } from "./configs/db.connect.js";
import { calculateFaceLocation, callClarifaiApi } from "./faceDetection.js";

const app = express();
connectToDb();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Middleware for setting headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Use the routes from user.route.js
app.use(userRoutes);

app.post("/imageurl", async (req, res) => {
  try {
    const data = await callClarifaiApi(req.body.input);
    const faceLocations = calculateFaceLocation(data);
    res.json(faceLocations);
  } catch (error) {
    res.status(400).json("Unable to work with API");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
