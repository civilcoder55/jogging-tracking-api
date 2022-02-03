import request from "supertest";
import app from "../../../app";
import database from "./../database";
import SeedData from "./../seed.data";

const basePath = "/api/v1";

beforeAll(async () => await database.connect());
beforeEach(async () => await database.seed());
afterAll(async () => await database.close());

test("Should not manage jogging without auth", async () => {
  const getAll = await request(app)
    .get(basePath + "/admin/jogging")
    .expect(403);

  const get = await request(app)
    .get(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .expect(403);

  const patch = await request(app)
    .patch(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .expect(403);

  const del = await request(app)
    .delete(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .expect(403);

  expect(getAll.body.message).toEqual("Forbidden request.");
  expect(get.body.message).toEqual("Forbidden request.");
  expect(patch.body.message).toEqual("Forbidden request.");
  expect(del.body.message).toEqual("Forbidden request.");
});

test("Should not manage jogging as normal user", async () => {
  const getAll = await request(app)
    .get(basePath + "/admin/jogging")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(401);

  const get = await request(app)
    .get(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(401);

  const patch = await request(app)
    .patch(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(401);

  const del = await request(app)
    .delete(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(401);

  expect(getAll.body.message).toEqual("Unauthorized request.");
  expect(get.body.message).toEqual("Unauthorized request.");
  expect(patch.body.message).toEqual("Unauthorized request.");
  expect(del.body.message).toEqual("Unauthorized request.");
});

test("Should not manage jogging as manager user", async () => {
  const getAll = await request(app)
    .get(basePath + "/admin/jogging")
    .set("Authorization", `Bearer ${SeedData.managerUserToken.token}`)
    .expect(401);

  const get = await request(app)
    .get(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.managerUserToken.token}`)
    .expect(401);

  const patch = await request(app)
    .patch(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.managerUserToken.token}`)
    .expect(401);

  const del = await request(app)
    .delete(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.managerUserToken.token}`)
    .expect(401);

  expect(getAll.body.message).toEqual("Unauthorized request.");
  expect(get.body.message).toEqual("Unauthorized request.");
  expect(patch.body.message).toEqual("Unauthorized request.");
  expect(del.body.message).toEqual("Unauthorized request.");
});

test("Should manage jogging as admin user", async () => {
  await request(app)
    .get(basePath + "/admin/jogging")
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);

  await request(app)
    .get(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);

  await request(app)
    .patch(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);

  await request(app)
    .delete(basePath + "/admin/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.adminUserToken.token}`)
    .expect(200);
});
