import request from "supertest";
import app from "../app.js";

describe("Health & Server Status API", () => {
  it("should return 200 and server running status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "GenCanvas AI Server is Running");
  });
});

describe("Authentication & Server-side Validation API", () => {
  it("should return 400 when registering with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message");
  });

  it("should return 400 when registering with invalid email format", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test User",
        email: "not-an-email",
        password: "securepassword123",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toMatch(/valid email/i);
  });

  it("should return 400 when registering with password less than 6 characters", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body.message).toMatch(/at least 6 characters/i);
  });

  it("should return 400 when logging in with empty password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "test@example.com",
        password: "",
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("success", false);
  });
});
