export interface SuccessResponse {
  status: "ok";
  message: string;
  insertId: number;
}

export interface ErrorResponse {
  status: "error";
  message: string;
}

export interface TestRecordPayload {
  dt_firstname: string;
  dt_middlename: string;
  dt_lastname: string;
  dt_session: string;
}

export interface TestRecord extends TestRecordPayload {
  dt_no: number;
}