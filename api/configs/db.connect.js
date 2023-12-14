import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

export const connectToDb = () => {
  mongoose
    .connect(uri)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
};
