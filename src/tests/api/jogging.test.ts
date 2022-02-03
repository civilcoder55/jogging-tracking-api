import request from "supertest";
import app from "../../app";
import joggingModel from "../../models/jogging.model";
import database from "./database";
import SeedData from "./seed.data";

const basePath = "/api/v1";

beforeAll(async () => await database.connect());
beforeEach(async () => await database.seed());
afterAll(async () => await database.close());

test("Should not crud jogging without auth", async () => {
  const getAll = await request(app)
    .get(basePath + "/jogging")
    .expect(403);

  const get = await request(app)
    .get(basePath + "/jogging/" + SeedData.testUserToken)
    .expect(403);

  const post = await request(app)
    .post(basePath + "/jogging")
    .expect(403);

  const patch = await request(app)
    .patch(basePath + "/jogging/" + SeedData.testUserJogging)
    .expect(403);

  const del = await request(app)
    .delete(basePath + "/jogging/" + SeedData.testUserJogging)
    .expect(403);

  expect(getAll.body.message).toEqual("Forbidden request.");
  expect(get.body.message).toEqual("Forbidden request.");
  expect(post.body.message).toEqual("Forbidden request.");
  expect(patch.body.message).toEqual("Forbidden request.");
  expect(del.body.message).toEqual("Forbidden request.");
});

test("Should create jogging ", async () => {
  const response = await request(app)
    .post(basePath + "/jogging")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: "second jogging",
      distance: 150,
      duration: 120,
    })
    .expect(201);

  expect(response.body).toMatchObject({
    name: "second jogging",
    distance: 150,
    duration: 120,
  });

  const jogging = await joggingModel.findById(response.body._id);

  expect(jogging).not.toBeNull();

  expect(jogging?.date.toISOString().slice(0, 16)).toMatch(new Date().toISOString().slice(0, 16));
});

test("Should not create jogging with invalid data", async () => {
  const requiredName = await request(app)
    .post(basePath + "/jogging")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      distance: 150,
      duration: 120,
    })
    .expect(400);

  expect(requiredName.body.message).toMatch("name field is required");

  const requiredDistance = await request(app)
    .post(basePath + "/jogging")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: "third jogging",
      duration: 120,
    })
    .expect(400);

  expect(requiredDistance.body.message).toMatch("distance field is required");

  const requiredDuration = await request(app)
    .post(basePath + "/jogging")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: "third jogging",
      distance: 150,
    })
    .expect(400);

  expect(requiredDuration.body.message).toMatch("duration field is required");

  const numberDuration = await request(app)
    .post(basePath + "/jogging")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: "third jogging",
      distance: 150,
      duration: "asd",
    })
    .expect(400);

  expect(numberDuration.body.message).toMatch("duration field must be number");

  const numberDistance = await request(app)
    .post(basePath + "/jogging")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: "third jogging",
      distance: "asd",
      duration: 120,
    })
    .expect(400);

  expect(numberDistance.body.message).toMatch("distance field must be number");
});

test("Should get all jogging ", async () => {
  const response = await request(app)
    .get(basePath + "/jogging")
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(200);

  const joggings = await joggingModel.find({ user: SeedData.testUserId }).sort("-date");

  expect(response.body.results.length).toEqual(joggings.length);
  expect(response.body.pagination).not.toBeNull();
  expect(response.body.pagination.pageNum).toEqual(1);
  expect(response.body.pagination.totalRecords).toEqual(joggings.length);
});

test("Should get jogging by id", async () => {
  const response = await request(app)
    .get(basePath + "/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(200);

  expect(response.body).toMatchObject({
    _id: SeedData.testUserJogging._id,
    name: SeedData.testUserJogging.name,
    distance: SeedData.testUserJogging.distance,
    duration: SeedData.testUserJogging.duration,
  });
});

test("Should not get other user jogging", async () => {
  const response = await request(app)
    .get(basePath + "/jogging/" + SeedData.managerUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(404);

  expect(response.body.message).toMatch("Jogging not found.");
});

test("Should update jogging by id", async () => {
  const response = await request(app)
    .patch(basePath + "/jogging/" + SeedData.managerUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.managerUserToken.token}`)
    .send({
      name: "updated jogging",
      distance: 120,
      duration: 120,
    })
    .expect(200);

  expect(response.body).toMatchObject({
    name: "updated jogging",
    distance: 120,
    duration: 120,
  });

  const jogging = await joggingModel.findById(response.body._id);
  expect(jogging?.name).toMatch("updated jogging");
  expect(jogging?.distance).toEqual(120);
});

test("Should not update jogging with invalid data", async () => {
  const numberDuration = await request(app)
    .patch(basePath + "/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: "third jogging",
      distance: 150,
      duration: "asd",
    })
    .expect(400);

  expect(numberDuration.body.message).toMatch("duration field must be number");

  const numberDistance = await request(app)
    .patch(basePath + "/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .send({
      name: "third jogging",
      distance: "asd",
      duration: 120,
    })
    .expect(400);

  expect(numberDistance.body.message).toMatch("distance field must be number");
});

test("Should not update other user jogging ", async () => {
  const response = await request(app)
    .patch(basePath + "/jogging/" + SeedData.managerUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(404);

  expect(response.body.message).toMatch("Jogging not found.");
});

test("Should delete jogging by id", async () => {
  const response = await request(app)
    .delete(basePath + "/jogging/" + SeedData.testUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(200);

  expect(response.body.message).toEqual("Jogging deleted successfully.");

  const jogging = await joggingModel.findOne({ _id: SeedData.testUserJoggingId });
  expect(jogging).toBeNull();
});

test("Should not delete other user jogging ", async () => {
  const response = await request(app)
    .delete(basePath + "/jogging/" + SeedData.managerUserJoggingId)
    .set("Authorization", `Bearer ${SeedData.testUserToken.token}`)
    .expect(404);

  expect(response.body.message).toMatch("Jogging not found.");
});
