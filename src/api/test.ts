import { axiosClientAuthentication } from "./axiosClient/index";
import type { SuccessResponse, TestRecordPayload, TestRecord } from "../types/api";

export function insertTestRecord(payload: TestRecordPayload) {
  return axiosClientAuthentication.post<SuccessResponse>("/test/insert", payload);
}

export function getTestRecords() {
  return axiosClientAuthentication.get<TestRecord[]>("/test/get");
}