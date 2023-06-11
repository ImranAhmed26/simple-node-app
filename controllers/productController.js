import fs, { stat } from "fs";
import _ from "lodash";
import formidable from "formidable";
import Product from "../models/productSchema.js";

const createProduct = async (req, res) => {
  const { name, categoryId, unitPrice, status } = req.body;
  if (!name || !unitPrice || !categoryId)
    return res.status(400).json({ error: "Missing fields. All fields are required." });

  try {
    const product = new Product({
      name,
      categoryId,
      unitPrice,
    });
    const saveProduct = await product.save();
    res.status(200).send(saveProduct);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("supplier", "name id");
    // product.photo = undefined;
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(200).send("Error. Please try again");
  }
};

const getProducts = async (req, res) => {
  // console.log(req.user);
  try {
    let products = Product.find({});

    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.limit || 12);
    const skip = (page - 1) * pageSize;
    const total = await Product.countDocuments();
    const pages = Math.ceil(total / pageSize);

    products = products.skip(skip).limit(pageSize);

    if (page > pages) {
      return res.status(400).json({ status: "failed", message: "Page not found" });
    }

    const result = await products;

    res.status(200).json({
      status: "Success",
      count: result.length,
      page,
      pages,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error. Please try again");
  }
};

const updateProduct = async (req, res) => {
  console.log("body", req.body);
  try {
    const { name, unitPrice, categoryId, status } = req.body;

    if (!name || !unitPrice || !categoryId) {
      return res.status(400).json({ error: "Missing fields. All fields are required." });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    product.name = name;
    product.unitPrice = unitPrice;
    product.category = categoryId;
    product.status = status;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const batchDeleteProducts = async (req, res) => {
  console.log("hello", req.body);
  const { productIds } = req.body;
  try {
    const result = await Product.deleteMany({ _id: { $in: productIds } });
    console.log("result", result);
    if (result.deletedCount > 0) {
      console.log("deleted", result);
      res.status(200).json({ message: "Products deleted successfully" });
    } else {
      res.status(404).json({ message: "No products found for deletion" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete products", error: error.message });
  }
};

export {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  batchDeleteProducts,
};
