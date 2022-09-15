import { UserInterface } from "./user.interface";

export interface UserPaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [UserInterface];
}