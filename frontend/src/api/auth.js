import client from "./client";

export function register(payload) {
  return client.post("/users/register", payload).then((r) => r.data);
}

export function login(payload) {
  return client.post("/users/login", payload).then((r) => r.data);
}

export function getMe() {
  return client.get("/users/me").then((r) => r.data.data);
}
