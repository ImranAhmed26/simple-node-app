import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const validToken = (req) => {
  let token;
  if (req.headers) {
    const { authorization } = req.headers;
    let match = authorization.split(" ")[1];

    if (match) {
      token = match;
    } else {
      console.log("--smt went wrong--");
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    console.log("Token validation successful");
    return decoded;
  } else {
    throw new Error("Not authorized, token failed");
  }
};

export const userToken = async (req, res, next) => {
  try {
    const data = validToken(req);
    const { _id } = data;

    if (_id) {
      req.user = await User.findById(_id).select("-password");
      next();
    } else {
      res.status(401).send({ error: "Not authorized as user" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Not authorized as a valid user" });
  }
};
