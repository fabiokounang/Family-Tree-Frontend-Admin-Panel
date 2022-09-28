import { AdminInterface } from "./admin.interface";
import { ProvinceInterface } from "./province.interface";

export interface AdminPaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [AdminInterface];
  province: [ProvinceInterface];
}