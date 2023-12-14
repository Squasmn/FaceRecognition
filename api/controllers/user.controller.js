import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  console.log(req.body); // Log the request body

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Bad Request: Missing email or password");
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          console.log(err); // Log any bcrypt errors
          return res.status(500).json("Error comparing passwords");
        }
        if (result) {
          res.json(user);
        } else {
          res.status(400).json("Incorrect password");
        }
      });
    } else {
      res.status(400).json("User not found");
    }
  } catch (error) {
    console.log(error); // Log any other errors
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      entries: 0,
      joined: new Date(),
    });

    const newUser = await user.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json("No such user");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateImage = async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);
    if (user) {
      user.entries++;
      await user.save();
      res.json(user.entries);
    } else {
      res.status(404).json("No such user");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
