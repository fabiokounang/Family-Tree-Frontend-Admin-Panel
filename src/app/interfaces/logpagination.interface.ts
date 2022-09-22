import { LogInterface } from "./log.interface";

export interface LogPaginatedInterface {
  page: Number;
  limit: Number;
  max: Number;
  total: Number;
  values: [LogInterface]
}