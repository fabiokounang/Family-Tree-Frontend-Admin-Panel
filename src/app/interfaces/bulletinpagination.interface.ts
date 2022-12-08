import { BulletinInterface } from "./bulletin.interface";
import { DropdownInterface } from "./dropdown.interface";

export interface BulletinPaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [BulletinInterface];
  provincies: [DropdownInterface]
}
