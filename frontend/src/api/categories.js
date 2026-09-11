import client from "./client";

export function getAllCategories() {
  return client.get("/category").then((r) => r.data.data);
}

export function getCategoriesForAdmin() {
  return client.get("/category/admin").then((r) => r.data.data);
}

export function createCategory(formData) {
  return client
    .post("/category", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export function updateCategoryTitle(id, title) {
  return client.patch(`/category/${id}`, { title }).then((r) => r.data);
}
