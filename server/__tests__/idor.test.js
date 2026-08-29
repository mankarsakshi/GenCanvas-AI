import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";

describe("IDOR Protection & JWT Enforcement Tests", () => {
  const secret = process.env.JWT_SECRET || "test_secret_key";
  process.env.JWT_SECRET = secret;

  it("should reject /api/v1/auth/me without token (401)", async () => {
    const res = await request(app).get("/api/v1/auth/me");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should reject /api/v1/history without token (401)", async () => {
    const res = await request(app).get("/api/v1/history");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should reject /api/v1/favorite without token (401)", async () => {
    const res = await request(app).get("/api/v1/favorite");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should reject /api/v1/dashboard/stats without token (401)", async () => {
    const res = await request(app).get("/api/v1/dashboard/stats");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("success", false);
  });

  it("should reject POST /api/v1/history without token (401)", async () => {
    const res = await request(app)
      .post("/api/v1/history")
      .send({ prompt: "cyberpunk city", photo: "data:image/png;base64,123" });
    expect(res.statusCode).toEqual(401);
  });

  it("should reject POST /api/v1/favorite/toggle without token (401)", async () => {
    const res = await request(app)
      .post("/api/v1/favorite/toggle")
      .send({ prompt: "cyberpunk city", photo: "data:image/png;base64,123" });
    expect(res.statusCode).toEqual(401);
  });

  it("should reject DELETE /api/v1/history/:id without token (401)", async () => {
    const res = await request(app).delete("/api/v1/history/random-id");
    expect(res.statusCode).toEqual(401);
  });

  it("should reject requests with an invalid/tampered JWT token (401)", async () => {
    const res = await request(app)
      .get("/api/v1/history")
      .set("Authorization", "Bearer invalid.tampered.token");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toMatch(/invalid or expired token/i);
  });
});
