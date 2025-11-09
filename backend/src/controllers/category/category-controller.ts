import { Category } from "@/models/category.js";
import { type Request, type Response } from "express";

export async function getCategories(req: Request, res: Response) {
  try {
    const {limit} = req.query;
    const categories = await Category.find({}).limit(Number(limit));
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error as Error);
    res.status(400).json({
      message: "Failed to fetch categories",
      error: (error as Error).message,
    });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(404)
        .json({ message: "Missing required fields: name, description" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.create({ name, description });

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error as Error);
    res.status(400).json({
      message: "Failed to create category",
      error: (error as Error).message,
    });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { id, name, description } = req.body;
    if (!id || !name || !description) {
      return res
        .status(404)
        .json({ message: "Missing required fields: id, name, description" });
    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );
    if (!category) {
      throw new Error("Category not found");
    }
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error as Error);
    res.status(400).json({
      message: "Failed to update category",
      error: (error as Error).message,
    });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(404).json({ message: "Missing required field: id" });
    }
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      throw new Error("Category not found");
    }
    res
      .status(200)
      .json({ message: "Category deleted successfully", category });
  } catch (error) {
    console.error("Error deleting category:", error as Error);
    res.status(400).json({
      message: "Failed to delete category",
      error: (error as Error).message,
    });
  }
}
