const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/server");

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URI ||
      "mongodb://localhost:27017/multitenant_workflow_test",
  );
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth & API Access Tests", () => {
  it("should prevent unauthenticated access to protected analytics route", async () => {
    const res = await request(app).get("/api/v1/analytics");
    expect(res.statusCode).toEqual(401);
  });
});
