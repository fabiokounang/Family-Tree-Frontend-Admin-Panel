import { BulletinInterface } from "./bulletin.interface";

export interface BulletinPaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [BulletinInterface];
}
