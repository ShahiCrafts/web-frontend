import {
  fetchTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
} from "../../api/admin/tagApi";

const fetchTagsService = async (params = {}) => {
  try {
    const response = await fetchTags(params);
    return response.data;
  } catch (err) {
    console.error("fetchTagsService error:", err.response || err);
    throw err.response?.data || { message: "Failed to fetch tags." };
  }
};

const getTagService = async (id) => {
  try {
    const response = await getTag(id);
    return response.data;
  } catch (err) {
    console.error("getTagService error:", err.response || err);
    throw err.response?.data || { message: "Failed to fetch the tag." };
  }
};

const createTagService = async (tagData) => {
  try {
    const response = await createTag(tagData);
    return response.data;
  } catch (err) {
    console.error("createTagService error:", err.response || err);
    throw err.response?.data || { message: "Failed to create tag." };
  }
};

const updateTagService = async (id, updateData) => {
  try {
    const response = await updateTag(id, updateData);
    return response.data;
  } catch (err) {
    console.error("updateTagService error:", err.response || err);
    throw err.response?.data || { message: "Failed to update tag." };
  }
};

const deleteTagService = async (id) => {
  try {
    const response = await deleteTag(id);
    return response.data;
  } catch (err) {
    console.error("deleteTagService error:", err.response || err);
    throw err.response?.data || { message: "Failed to delete tag." };
  }
};

export const tagService = {
  fetch: fetchTagsService,
  getById: getTagService,
  create: createTagService,
  update: updateTagService,
  delete: deleteTagService,
};
