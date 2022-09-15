import { AdminInterface } from "./admin.interface";

export interface AdminPaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [AdminInterface];
}