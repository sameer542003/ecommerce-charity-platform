import client from "./client";

export function getAllProducts() {
  return client.get("/products").then((r) => r.data.data);
}

export function getProductById(id) {
  return client.get(`/products/${id}`).then((r) => r.data.data);
}

export function getProductsByCharityPublic(charityId) {
  return client.get(`/products/charity/${charityId}`).then((r) => r.data.data);
}

export function getProductsByCharityForAdmin(charityId) {
  return client
    .get(`/products/admin/charity/${charityId}`)
    .then((r) => r.data.data);
}

export function getProductsByCategory(categoryId) {
  return client.get(`/products/category/${categoryId}`).then((r) => r.data.data);
}

export function createProduct(formData) {
  return client
    .post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export function updateProduct(id, formData) {
  return client
    .put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export function updateProductStatus(id, status) {
  return client.patch(`/products/${id}/status`, { status }).then((r) => r.data);
}
