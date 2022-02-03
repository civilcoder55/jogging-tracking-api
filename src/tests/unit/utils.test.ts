import userModel from "../../models/user.model";
import { signToken, validateToken } from "../../utils/jwt.util";
import { paginator } from "../../utils/paginator.utils";
import mockingoose from "mockingoose";

test("Should sign jwt token", async () => {
  const token = signToken({ username: "test" });
  expect(token).not.toBeNull();
  expect(typeof token).toBe("string");
  expect(token).toMatch(/^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-+/=]*)/);
});

test("Should validate jwt token", async () => {
  const token = signToken({ username: "test" });
  const result = validateToken(token);
  expect(result).not.toBeNull();
  expect(typeof result).toBe("object");
  expect(result.valid).toBeTruthy();
  expect(result.payload).toMatchObject({ username: "test" });
});

const records = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
  { id: 11 },
  { id: 12 },
  { id: 13 },
];

mockingoose(userModel).toReturn(records, "find").toReturn(records.length, "countDocuments");

test("Should paginate records", async () => {
  const page = "1";
  const records = await paginator(userModel, page, {});
  expect(records.pagination.totalPages).toEqual(2);
  expect(records.pagination.hasNext).toBeTruthy();
  expect(records.pagination.hasPerv).toBeFalsy();
  expect(records.pagination.totalRecords).toEqual(13);
  expect(records.pagination.pageNum).toEqual(1);
});

test("Should fetch pages of records", async () => {
  const page = "2";
  const records = await paginator(userModel, page, {});
  expect(records.pagination.totalPages).toEqual(2);
  expect(records.pagination.hasNext).toBeFalsy();
  expect(records.pagination.hasPerv).toBeTruthy();
  expect(records.pagination.totalRecords).toEqual(13);
  expect(records.pagination.pageNum).toEqual(2);
});

test("Should return empty result", async () => {
  const page = "3";
  const records = await paginator(userModel, page, {});
  expect(records.pagination.totalPages).toEqual(2);
  expect(records.pagination.hasNext).toBeFalsy();
  expect(records.pagination.hasPerv).toBeTruthy();
  expect(records.pagination.totalRecords).toEqual(13);
  expect(records.pagination.pageNum).toEqual(3);
});
