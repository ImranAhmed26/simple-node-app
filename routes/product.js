import express from "express";

import { userToken } from "../middleware/authToken.js";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
} from "../controllers/productController.js";

const router = express.Router();

router
  .post("/createProduct", userToken, createProduct)
  .get("/", userToken, getProducts)
  .get("/:id", userToken, getProduct)
  .put("/:id", userToken, updateProduct)
  .delete("/:id", userToken, deleteProduct)
  .delete("/batch-delete", userToken, batchDeleteProducts);

export default router;
