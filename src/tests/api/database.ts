import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userModel from "../../models/user.model";
import SeedData from "./seed.data";
import tokenModel from "../../models/token.model";
import joggingModel from "../../models/jogging.model";

let mongoServer: MongoMemoryServer;

const connect = async function () {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
};

const close = async function () {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

const seed = async function () {
  await userModel.deleteMany({});
  await new userModel(SeedData.testUser).save();
  await new userModel(SeedData.managerUser).save();
  await new userModel(SeedData.adminUser).save();

  await tokenModel.deleteMany({});
  await new tokenModel(SeedData.testUserToken).save();
  await new tokenModel(SeedData.managerUserToken).save();
  await new tokenModel(SeedData.adminUserToken).save();

  await joggingModel.deleteMany({});
  await new joggingModel(SeedData.testUserJogging).save();
  await new joggingModel(SeedData.managerUserJogging).save();
};

export default { connect, close, seed };
