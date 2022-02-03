import { joggingDocument } from "../interfaces/jogging.interface";
import { reportDocument } from "../interfaces/report.interface";
import reportModel from "../models/report.model";
import { paginator } from "../utils/paginator.utils";

export async function getOrCreateReport(jogging: joggingDocument): Promise<reportDocument> {
  const date = new Date(jogging.date);
  date.setDate(date.getDate() - date.getDay());
  const weekDate = date.toISOString().slice(0, 10);

  let report = await reportModel.findOne({ user: jogging.user, weekDate });

  if (!report) {
    report = await reportModel.create({ user: jogging.user, weekDate });
  }

  return report;
}

export async function updateReportWithNew(jogging: joggingDocument): Promise<void> {
  const report = await getOrCreateReport(jogging);

  report.totalDistance += jogging.distance;
  report.totalDuration += jogging.duration;
  report.avgSpeed = report.totalDistance / report.totalDuration;

  await report.save();
}

export async function updateReportWithOld(oldJogging: joggingDocument, newJogging: joggingDocument): Promise<void> {
  const oldReport = await getOrCreateReport(oldJogging);
  if (oldReport.totalDistance > oldJogging.distance) oldReport.totalDistance -= oldJogging.distance;
  if (oldReport.totalDuration > oldJogging.duration) oldReport.totalDuration -= oldJogging.duration;
  oldReport.avgSpeed = oldReport.totalDuration == 0 ? 0 : oldReport.totalDistance / oldReport.totalDuration;
  await oldReport.save();

  const newReport = await getOrCreateReport(newJogging);

  newReport.totalDistance += newJogging.distance;
  newReport.totalDuration += newJogging.duration;
  newReport.avgSpeed = newReport.totalDistance / newReport.totalDuration;

  await newReport.save();
}

export async function updateReportWithDeleted(jogging: joggingDocument): Promise<void> {
  const report = await getOrCreateReport(jogging);
  if (report.totalDistance > jogging.distance) report.totalDistance -= jogging.distance;
  if (report.totalDuration > jogging.duration) report.totalDuration -= jogging.duration;
  report.avgSpeed = report.totalDuration == 0 ? 0 : report.totalDistance / report.totalDuration;
  await report.save();
}

export async function getReports(userId: string, page: string, all: string) {
  if (all) {
    return await paginator(reportModel, page, { user: userId }, "-weekDate");
  }
  const date = new Date();
  date.setDate(date.getDate() - date.getDay());
  const thisWeekDate = date.toISOString().slice(0, 10);
  return await reportModel.findOne({ user: userId, weekDate: thisWeekDate });
}
