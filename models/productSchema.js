import mongoose from "mongoose";
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const productSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      minLength: [3, "Product name is too short"],
      maxLength: [32, "Too many characters"],
    },
    categoryId: { type: Number, required: [true, "Category ID is required"] },
    unitPrice: { type: Number, required: true, maxLength: [9, "Amount out of line"] },
    status: { type: Number, enum: [0, 1], default: 1 },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
