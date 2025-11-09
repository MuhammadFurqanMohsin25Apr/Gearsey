import { createCategory, deleteCategory, getCategories, updateCategory } from "@/controllers/category/category-controller.js";
import Express from "express";

const router = Express.Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.put('/', updateCategory);
router.delete('/', deleteCategory);

export default router;