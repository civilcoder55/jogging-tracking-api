import request from "supertest";
import app from "../../app";
import tokenModel from "../../models/token.model";
import userModel from "../../models/user.model";
import database from "./database";
import SeedData from "./seed.data";

const basePath = "/api/v1";

beforeAll(async () => await database.connect());
beforeEach(async () => await database.seed());
afterAll(async () => await database.close());

test("Should register a new user", async () => {
  const response = await request(app)
    .post(basePath + "/auth/register")
    .send({
      name: "test",
      email: "test@example.com",
      password: "Password@123",
      passwordConfirmation: "Password@123",
    })
    .expect(201);

  // Assertions about the response
  expect(response.body).toMatchObject({
    name: "test",
    email: "test@example.com",
  });

  // Assert that the database was changed correctly
  const user = await userModel.findById(response.body._id);
  expect(user).not.toBeNull();

  // assert password stored as hash
  expect(user?.password).not.toBe("Password@123");
});

test("Should not register with invalid data", async () => {
  const response = await request(app)
    .post(basePath + "/auth/register")
    .send({
      email: "test@example.com",
      password: "Password@123",
      passwordConfirmation: "Password@123",
    })
    .expect(400);

  // Assertions about the response
  expect(response.body.message).toEqual("name field is required");
});

test("Should not register with invalid email", async () => {
  const response = await request(app)
    .post(basePath + "/auth/register")
    .send({
      name: "test",
      email: "test",
      password: "Password@123",
      passwordConfirmation: "Password@123",
    })
    .expect(400);

  // Assertions about the response
  expect(response.body.message).toEqual("email field must be valid email");
});

test("Should not register with invalid password", async () => {
  const response = await request(app)
    .post(basePath + "/auth/register")
    .send({
      name: "test",
      email: "test@examle.com",
      password: "Password",
      passwordConfirmation: "Password",
    })
    .expect(400);

  // Assertions about the response
  expect(response.body.message).toEqual(
    "Password must contain 8 characters, at least one uppercase, one lowercase, one number and one special character"
  );
});

test("Should not register with existing email", async () => {
  const response = await request(app)
    .post(basePath + "/auth/register")
    .send({
      name: "test",
      email: SeedData.testUser.email,
      password: "Password@123",
      passwordConfirmation: "Password@123",
    })
    .expect(409);

  // Assertions about the response
  expect(response.body.message).toEqual("User email already exists.");
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post(basePath + "/auth/login")
    .send({
      email: SeedData.testUser.email,
      password: SeedData.testUser.password,
    })
    .expect(200);

  expect(response.body.accessToken).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/);

  const token = await tokenModel.findOne({ token: response.body.accessToken });
  expect(token).not.toBeNull();
});

test("Should not login with wrong password", async () => {
  const response = await request(app)
    .post(basePath + "/auth/login")
    .send({
      email: SeedData.testUser.email,
      password: "wrongpassword",
    })
    .expect(401);

  expect(response.body.message).toEqual("Invalid credentials.");
});

test("Should not login with wrong email", async () => {
  const response = await request(app)
    .post(basePath + "/auth/login")
    .send({
      email: "anyemail@example.com",
      password: SeedData.testUser.password,
    })
    .expect(401);

  expect(response.body.message).toEqual("Invalid credentials.");
});

test("Should not logout without auth", async () => {
  const response = await request(app)
    .post(basePath + "/auth/logout")
    .send()
    .expect(403);
  expect(response.body.message).toEqual("Forbidden request.");
});

test("Should logout with auth", async () => {
  let token = await tokenModel.findOne({ token: SeedData.testUserToken.token });
  expect(token).not.toBeNull();

  const response = await request(app)
    .post(basePath + "/auth/logout")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(200);

  expect(response.body.message).toEqual("Success.");

  token = await tokenModel.findOne({ token: SeedData.testUserToken.token });
  expect(token).toBeNull();
});
