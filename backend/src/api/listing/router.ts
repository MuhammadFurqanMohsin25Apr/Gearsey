import express from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getImage,
} from "@/controllers/listing/listing-controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getProducts);
router.get("/images/:filename", getImage);
router.post("/", upload.array("images"), createProduct);
router.put("/", upload.array("images"), updateProduct);
router.delete("/", deleteProduct);

export default router;
