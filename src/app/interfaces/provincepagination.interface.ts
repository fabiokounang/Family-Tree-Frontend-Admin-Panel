import { ProvinceInterface } from "./province.interface";

export interface ProvincePaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [ProvinceInterface]
}