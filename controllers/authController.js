import jwt from "jsonwebtoken";
import nid from "nid";

import User from "../models/userSchema.js";
import { comparePassword, hashPassword } from "../utils/auth.js";

// Register User

const RegisterUser = async (req, res) => {
  try {
    // Destructure Req Body

    let { userName, password } = req.body;

    // Validation

    if (!userName) return res.status(400).send("User Name is required");
    let userNameExists = await User.findOne({ userName }).exec();
    if (userNameExists) return res.status(401).send("User name already exists");

    if (!password || password.length < 6) {
      return res.status(400).send("Password is required and has to be min 6 characters long");
    }

    // Unique ID number
    const uniqueNumber = nid({ alphabet: "1234567890", length: 6 });
    const userId = `USER-0${uniqueNumber()}`;

    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Register
    const user = new User({
      userName,
      userId,
      password: hashedPassword,
    });

    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(401).json(error);
    throw error;
  }
};

// Login

const LoginUser = async (req, res) => {
  try {
    let { userName, password } = req.body;

    const user = await User.findOne({ userName }).exec();
    if (!user) return res.status(404).send("User Name not found");

    const matchPassword = await comparePassword(password, user.password);
    if (!matchPassword) return res.status(401).send("Password did not match");

    const accessToken = jwt.sign(
      { userName: user.userName, _id: user._id },
      process.env.JWT_ACCESS_TOKEN,
      {
        expiresIn: "7d",
      },
    );

    user.password = undefined;

    res.json({ user, token: accessToken });
    console.log("Login successful");
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error. Please Try Again");
  }
};

const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Sign out success" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { RegisterUser, LoginUser, LogoutUser };
