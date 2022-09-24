import { CityInterface } from "./city.interface";

export interface CityPaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [CityInterface];
}