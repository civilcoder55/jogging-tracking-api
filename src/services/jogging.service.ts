import { joggingDocument } from "../interfaces/jogging.interface";
import joggingModel from "../models/jogging.model";
import { paginator } from "../utils/paginator.utils";

export async function createJogging(joggingData: joggingDocument, userId: string): Promise<joggingDocument> {
  joggingData.user = userId;
  return await joggingModel.create(joggingData);
}

export async function getAllJogging(page: string, filter: { from: string; to: string }) {
  const filterQuery: any = { date: {} };

  if (filter.from) {
    filterQuery.date.$gte = new Date(filter.from);
  }

  if (filter.to) {
    filterQuery.date.$lte = new Date(filter.to);
  }

  if (Object.keys(filterQuery.date).length === 0) {
    delete filterQuery.date;
  }
  return await paginator(joggingModel, page, filterQuery, "-date");
}

export async function getUserJogging(userId: string, page: string, filter: { from: string; to: string }) {
  const filterQuery: any = { user: userId, date: {} };

  if (filter.from) {
    filterQuery.date.$gte = new Date(filter.from);
  }

  if (filter.to) {
    filterQuery.date.$lte = new Date(filter.to);
  }

  if (Object.keys(filterQuery.date).length === 0) {
    delete filterQuery.date;
  }
  return await paginator(joggingModel, page, filterQuery, "-date");
}

export async function getJogging(jogginId: string, userId: string | null = null): Promise<joggingDocument> {
  const filterQuery: any = { _id: jogginId };

  if (userId) {
    filterQuery.user = userId;
  }

  const jogging = await joggingModel.findOne(filterQuery);

  if (jogging) {
    return jogging;
  }

  throw {
    statusCode: 404,
    message: "Jogging not found.",
  };
}

export async function updateJogging(jogging: joggingDocument, joggingData: joggingDocument): Promise<joggingDocument> {
  Object.assign(jogging, joggingData);
  await jogging.save();
  return jogging;
}

export async function deleteJogging(jogging: joggingDocument): Promise<void> {
  await jogging.remove();
}
