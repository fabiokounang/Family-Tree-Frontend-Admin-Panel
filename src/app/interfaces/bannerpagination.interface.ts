import { BannerInterface } from "./banner.interface";
import { DropdownInterface } from "./dropdown.interface";

export interface BannerPaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [BannerInterface];
  provincies: [DropdownInterface]
}
