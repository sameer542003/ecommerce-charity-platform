import client from "./client";

export function createOrder(payload) {
  return client.post("/orders", payload).then((r) => r.data);
}

export function getUserOrders() {
  return client.get("/orders").then((r) => r.data.data);
}

export function getOrderById(id) {
  return client.get(`/orders/${id}`).then((r) => r.data.data);
}

export function getOrdersByCharity(charityId) {
  return client.get(`/orders/charity/${charityId}`).then((r) => r.data.data);
}
