import express from "express";
import {
  getUsers,
  signin,
  register,
  getProfile,
  updateImage,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/signin", signin);
router.post("/register", register);
router.get("/profile/:id", getProfile);
router.put("/image", updateImage);

export default router;
