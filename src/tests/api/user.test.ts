import request from "supertest";
import app from "../../app";
import database from "./database";
import SeedData from "./seed.data";
import joggingModel from "../../models/jogging.model";
import reportModel from "../../models/report.model";
import tokenModel from "../../models/token.model";
import userModel from "../../models/user.model";

const basePath = "/api/v1";

beforeAll(async () => await database.connect());
beforeEach(async () => await database.seed());
afterAll(async () => await database.close());

test("Should not crud users without auth", async () => {
  const getAll = await request(app)
    .get(basePath + "/users")
    .expect(403);

  const get = await request(app)
    .get(basePath + "/users/" + SeedData.testUserId)
    .expect(403);

  const post = await request(app)
    .post(basePath + "/users")
    .expect(403);

  const patch = await request(app)
    .patch(basePath + "/users/" + SeedData.testUserId)
    .expect(403);

  const del = await request(app)
    .delete(basePath + "/users/" + SeedData.testUserId)
    .expect(403);

  expect(getAll.body.message).toEqual("Forbidden request.");
  expect(get.body.message).toEqual("Forbidden request.");
  expect(post.body.message).toEqual("Forbidden request.");
  expect(patch.body.message).toEqual("Forbidden request.");
  expect(del.body.message).toEqual("Forbidden request.");
});

test("Should not crud users as normal user", async () => {
  const getAll = await request(app)
    .get(basePath + "/users")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(401);

  const get = await request(app)
    .get(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(401);

  const post = await request(app)
    .post(basePath + "/users")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(401);

  const patch = await request(app)
    .patch(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(401);

  const del = await request(app)
    .delete(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(401);

  expect(getAll.body.message).toEqual("Unauthorized request.");
  expect(get.body.message).toEqual("Unauthorized request.");
  expect(post.body.message).toEqual("Unauthorized request.");
  expect(patch.body.message).toEqual("Unauthorized request.");
  expect(del.body.message).toEqual("Unauthorized request.");
});

test("Should crud users as manager user", async () => {
  await request(app)
    .get(basePath + "/users")
    .set("Authorization", `Bearer ${SeedData.managerUserToken.token}`)
    .expect(200);

  await request(app)
    .get(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.managerUserToken.token}`)
    .expect(200);

  await request(app)
    .post(basePath + "/users")
    .set("Authorization", `Bearer ${SeedData.managerUserToken.token}`)
    .expect(400);

  await request(app)
    .patch(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.managerUserToken.token}`)
    .expect(400);
});

test("Should crud users as admin user", async () => {
  await request(app)
    .get(basePath + "/users")
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);

  await request(app)
    .get(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);

  await request(app)
    .post(basePath + "/users")
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(400);

  await request(app)
    .patch(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(400);
});

test("Should get all users paginated", async () => {
  const response = await request(app)
    .get(basePath + "/users")
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);

  const users = await userModel.find({}).sort("-createdAt");
  expect(response.body.results.length).toEqual(users.length);
  expect(response.body.pagination).not.toBeNull();
  expect(response.body.pagination.pageNum).toEqual(1);
  expect(response.body.pagination.totalRecords).toEqual(users.length);
});

test("Should paginate users ", async () => {
  const response = await request(app)
    .get(basePath + "/users?page=2")
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);

  const users = await userModel.find({});

  expect(response.body.results.length).toEqual(0);
  expect(response.body.pagination).not.toBeNull();
  expect(response.body.pagination.pageNum).toEqual(2);
  expect(response.body.pagination.totalRecords).toEqual(users.length);
});

test("Should get user by id", async () => {
  const response = await request(app)
    .get(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);

  expect(response.body).toMatchObject({
    _id: SeedData.testUser._id,
    name: SeedData.testUser.name,
    email: SeedData.testUser.email,
    role: SeedData.testUser.role,
  });
});

test("Should create new user", async () => {
  const response = await request(app)
    .post(basePath + "/users")
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .send({
      name: "new user",
      email: "newuser@exapmle.com",
      password: "StrongPassword@123",
      passwordConfirmation: "StrongPassword@123",
    })
    .expect(201);

  expect(response.body).toMatchObject({
    name: "new user",
    email: "newuser@exapmle.com",
    role: "user",
  });

  const user = await userModel.findById(response.body._id);

  expect(user).not.toBeNull();
});

test("Should update user by id", async () => {
  let user = await userModel.findById(SeedData.testUserId);
  const oldPassword = user?.password;

  const response = await request(app)
    .patch(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .send({
      name: "new name",
      email: "newemail@exapmle.com",
      password: "StrongPassword@123",
      passwordConfirmation: "StrongPassword@123",
    })
    .expect(200);

  expect(response.body).toMatchObject({
    _id: SeedData.testUser._id,
    name: "new name",
    email: "newemail@exapmle.com",
    role: SeedData.testUser.role,
  });

  user = await userModel.findById(SeedData.testUserId);

  expect(user?.name).toBe("new name");
  expect(user?.email).toBe("newemail@exapmle.com");
  expect(oldPassword).not.toEqual(user?.password);
});

test("Should delete user by id", async () => {
  const response = await request(app)
    .delete(basePath + "/users/" + SeedData.testUserId)
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);

  expect(response.body.message).toEqual("User deleted successfully.");

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

test("Should not delete curren admin/manager", async () => {
  const response = await request(app)
    .delete(basePath + "/users/" + SeedData.adminUserId)
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(400);

  expect(response.body.message).toEqual("You can't delete yourself.");

  const user = await userModel.findById(SeedData.adminUserId);

  expect(user).not.toBeNull();
});
