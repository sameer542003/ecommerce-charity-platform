import client from "./client";

export function getAddress() {
  return client.get("/address").then((r) => r.data.data);
}

export function createAddress(payload) {
  return client.post("/address", payload).then((r) => r.data);
}

export function updateAddress(id, payload) {
  return client.put(`/address/${id}`, payload).then((r) => r.data);
}

export function deleteAddress(id) {
  return client.delete(`/address/${id}`).then((r) => r.data);
}
