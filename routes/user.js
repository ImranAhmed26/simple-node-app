import express from "express";

import { deleteUser, getUser, getUsers } from "../controllers/userController.js";
import { userToken } from "../middleware/authToken.js";

const router = express.Router();

router.get("/", getUsers).get("/:id", getUser).delete("/:id", deleteUser);

export default router;
