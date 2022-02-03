import mongoose from "mongoose";
import { signToken } from "../../utils/jwt.util";

export class SeedData {
  static testUserId = new mongoose.Types.ObjectId();
  static testUser = {
    _id: SeedData.testUserId,
    name: "test user",
    email: "test_user@example.com",
    password: "TestUser@123",
    role: "user",
  };

  static testUserToken = {
    user: SeedData.testUserId,
    token: signToken({
      userId: SeedData.testUserId.toString(),
      email: SeedData.testUser.email,
      role: SeedData.testUser.role,
    }),
  };

  static managerUserId = new mongoose.Types.ObjectId();
  static managerUser = {
    _id: SeedData.managerUserId,
    name: "manager user",
    email: "manager_user@example.com",
    password: "ManagerUser@123",
    role: "manager",
  };

  static managerUserToken = {
    user: SeedData.managerUserId,
    token: signToken({
      userId: SeedData.managerUserId.toString(),
      email: SeedData.managerUser.email,
      role: SeedData.managerUser.role,
    }),
  };

  static adminUserId = new mongoose.Types.ObjectId();
  static adminUser = {
    _id: SeedData.adminUserId,
    name: "admin user",
    email: "admin_user@example.com",
    password: "AdminUser@123",
    role: "admin",
  };

  static adminUserToken = {
    user: SeedData.adminUserId,
    token: signToken({
      userId: SeedData.adminUserId.toString(),
      email: SeedData.adminUser.email,
      role: SeedData.adminUser.role,
    }),
  };

  static testUserJoggingId = new mongoose.Types.ObjectId();
  static testUserJogging = {
    _id: SeedData.testUserJoggingId,
    user: SeedData.testUserId,
    name: "test user jogging",
    distance: 120,
    duration: 120,
    date: "01/20/2022",
  };

  static managerUserJoggingId = new mongoose.Types.ObjectId();
  static managerUserJogging = {
    _id: SeedData.managerUserJoggingId,
    user: SeedData.managerUserId,
    name: "manager user jogging",
    distance: 150,
    duration: 120,
    date: "01/30/2022",
  };
}

export default SeedData;
