import { BannerInterface } from "./banner.interface";

export interface BannerPaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [BannerInterface];
}
