import client from "./client";

export function getAllCharitiesPublic() {
  return client.get("/charity").then((r) => r.data.data);
}

export function getCharityById(id) {
  return client.get(`/charity/${id}`).then((r) => r.data.data);
}

export function getCharityForAdmin() {
  return client.get("/charity/admin").then((r) => r.data.data);
}

export function getCharityByIdAdmin(id) {
  return client.get(`/charity/admin/${id}`).then((r) => r.data.data);
}

export function createCharity(formData) {
  return client
    .post("/charity", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}

export function updateCharity(id, formData) {
  return client
    .patch(`/charity/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
}
