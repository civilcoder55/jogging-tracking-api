import request from "supertest";
import app from "../../app";
import joggingModel from "../../models/jogging.model";
import reportModel from "../../models/report.model";
import tokenModel from "../../models/token.model";
import userModel from "../../models/user.model";
import database from "./database";
import SeedData from "./seed.data";

const basePath = "/api/v1";

beforeAll(async () => await database.connect());
beforeEach(async () => await database.seed());
afterAll(async () => await database.close());

test("Should not get profile without auth", async () => {
  const response = await request(app)
    .get(basePath + "/profile")
    .expect(403);

  expect(response.body.message).toEqual("Forbidden request.");
});

test("Should get profile with auth", async () => {
  const response = await request(app)
    .get(basePath + "/profile")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(200);

  expect(response.body).toMatchObject({
    _id: SeedData.testUser._id,
    name: SeedData.testUser.name,
    email: SeedData.testUser.email,
    role: SeedData.testUser.role,
  });
});

test("Should update profile data", async () => {
  const response = await request(app)
    .patch(basePath + "/profile")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: "new name",
      email: SeedData.testUser.email,
    })
    .expect(200);

  expect(response.body).toMatchObject({
    _id: SeedData.testUser._id,
    name: "new name",
    email: SeedData.testUser.email,
    role: SeedData.testUser.role,
  });

  const user = await userModel.findById(SeedData.testUserId);

  expect(user?.name).toBe("new name");
});

test("Should not update profile without auth", async () => {
  const response = await request(app)
    .patch(basePath + "/profile")
    .send({
      name: "new name",
      email: SeedData.testUser.email,
    })
    .expect(403);

  expect(response.body.message).toEqual("Forbidden request.");

  const user = await userModel.findById(SeedData.testUserId);

  expect(user?.name).not.toBe("new name");
});

test("Should not update profile with existing email", async () => {
  const response = await request(app)
    .patch(basePath + "/profile")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: SeedData.testUser.name,
      email: SeedData.managerUser.email,
    })
    .expect(409);

  expect(response.body.message).toEqual("User email already exists.");
});

test("Should update profile with new email", async () => {
  const response = await request(app)
    .patch(basePath + "/profile")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: SeedData.testUser.name,
      email: "newemail@example.com",
    })
    .expect(200);

  expect(response.body).toMatchObject({
    _id: SeedData.testUser._id,
    name: SeedData.testUser.name,
    email: "newemail@example.com",
    role: SeedData.testUser.role,
  });

  const user = await userModel.findById(SeedData.testUserId);

  expect(user?.email).toBe("newemail@example.com");
});

test("Should validate when update password", async () => {
  const response = await request(app)
    .patch(basePath + "/profile")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: SeedData.testUser.name,
      email: SeedData.testUser.email,
      password: SeedData.testUser.password,
    })
    .expect(400);

  expect(response.body.message).toEqual("passwords and passwordConfirmation must match");
});

test("Should validate password strength when update", async () => {
  const response = await request(app)
    .patch(basePath + "/profile")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: SeedData.testUser.name,
      email: SeedData.testUser.email,
      password: "weakpassword",
      passwordConfirmation: "weekPassword",
    })
    .expect(400);

  expect(response.body.message).toEqual(
    "Password must contain 8 characters, at least one uppercase, one lowercase, one number and one special character"
  );
});

test("Should update password", async () => {
  let user = await userModel.findById(SeedData.testUserId);
  const oldPassword = user?.password;

  await request(app)
    .patch(basePath + "/profile")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: SeedData.testUser.name,
      email: SeedData.testUser.email,
      password: "StrongPassword@123",
      passwordConfirmation: "StrongPassword@123",
    })
    .expect(200);

  user = await userModel.findById(SeedData.testUserId);
  const newPassword = user?.password;

  expect(oldPassword).not.toEqual(newPassword); // also you can check hash
});

test("Should not delete profile without auth", async () => {
  const response = await request(app)
    .delete(basePath + "/profile")
    .send()
    .expect(403);

  expect(response.body.message).toEqual("Forbidden request.");

  const user = await userModel.findById(SeedData.testUserId);

  expect(user).not.toBeNull();
});

test("Should delete profile with auth", async () => {
  const response = await request(app)
    .delete(basePath + "/profile")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(200);

  expect(response.body.message).toEqual("Profile deleted successfully.");

  // test if user deleted
  const user = await userModel.findById(SeedData.testUserId);
  expect(user).toBeNull();

  // test if tokens deleted
  const tokens = await tokenModel.find({ user: SeedData.testUserId });
  expect(tokens.length).toEqual(0);

  // test if joggings deleted
  const joggings = await joggingModel.find({ user: SeedData.testUserId });
  expect(joggings.length).toEqual(0);

  // test if reports deleted
  const reports = await reportModel.find({ user: SeedData.testUserId });
  expect(reports.length).toEqual(0);
});
