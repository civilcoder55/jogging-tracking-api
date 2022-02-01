import { joggingDocument } from "../interfaces/jogging.interface";
import joggingModel from "../models/jogging.model";
import { paginator } from "../utils/paginator.utils";

export async function createJogging(joggingData: joggingDocument, userId: string): Promise<joggingDocument> {
  joggingData.user = userId;
  return await joggingModel.create(joggingData);
}

export async function getAllJogging(userId: string, page: string, filter: { from: string; to: string }) {
  let filterQuery: any = { user: userId, date: {} };

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

export async function getJoggingById(jogginId: string, userId: string): Promise<joggingDocument> {
  const jogging = await joggingModel.findOne({ _id: jogginId, user: userId });

  if (jogging) {
    return jogging;
  }

  throw {
    statusCode: 404,
    message: "Jogging not found.",
  };
}

export async function getWeeklyReport(jogginId: string, userId: string) {
  //   const jogging = await getJoggingById(jogginId, userId);
  // implement later
}

export async function updateJogging(
  joggingData: joggingDocument,
  jogginId: string,
  userId: string
): Promise<joggingDocument> {
  const jogging = await getJoggingById(jogginId, userId);
  Object.assign(jogging, joggingData);
  await jogging.save();
  return jogging;
}

export async function deleteJogging(jogginId: string, userId: string): Promise<void> {
  const jogging = await getJoggingById(jogginId, userId);
  await jogging.remove();
  return;
}
