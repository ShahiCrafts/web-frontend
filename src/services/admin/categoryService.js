import {
  fetchCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/admin/categoryApi";

const fetchCategoriesService = async (params = {}) => {
  try {
    const response = await fetchCategories(params);
    return response.data;
  } catch (err) {
    console.error("fetchCategoriesService error:", err.response || err);
    throw err.response?.data || { message: "Failed to fetch categories." };
  }
};

const getCategoryService = async (id) => {
  try {
    const response = await getCategory(id);
    return response.data;
  } catch (err) {
    console.error("getCategoryService error:", err.response || err);
    throw err.response?.data || { message: "Failed to fetch the category." };
  }
};

const createCategoryService = async (categoryData) => {
  try {
    const response = await createCategory(categoryData);
    return response.data;
  } catch (err) {
    console.error("createCategoryService error:", err.response || err);
    throw err.response?.data || { message: "Failed to create category." };
  }
};

const updateCategoryService = async (id, updateData) => {
  try {
    const response = await updateCategory(id, updateData);
    return response.data;
  } catch (err) {
    console.error("updateCategoryService error:", err.response || err);
    throw err.response?.data || { message: "Failed to update category." };
  }
};

const deleteCategoryService = async (id) => {
  try {
    const response = await deleteCategory(id);
    return response.data;
  } catch (err) {
    console.error("deleteCategoryService error:", err.response || err);
    throw err.response?.data || { message: "Failed to delete category." };
  }
};

export const categoryService = {
  fetch: fetchCategoriesService,
  getById: getCategoryService,
  create: createCategoryService,
  update: updateCategoryService,
  delete: deleteCategoryService,
};
