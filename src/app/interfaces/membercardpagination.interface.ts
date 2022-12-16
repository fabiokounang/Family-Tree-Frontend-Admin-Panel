import { DropdownInterface } from "./dropdown.interface";
import { MemberCardInterface } from "./membercard.interface";

export interface MemberCardPaginationInterface {
  page: number;
  limit: number;
  max: number;
  total: number;
  values: [MemberCardInterface];
  provincies: [DropdownInterface]
}
