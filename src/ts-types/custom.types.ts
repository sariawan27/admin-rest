import { QueryKey } from "react-query";
import { SortOrder } from "./generated";

export type CategoriesQueryOptionsType = {
  type?: string;
  text?: string;
  userId?: string;
  page?: number;
  parent?: number | null;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};

export type UnitsQueryOptionsType = {
  type?: string;
  text?: string;
  page?: number;
  parent?: number | null;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};

export type TagsQueryOptionsType = {
  type?: string;
  text?: string;
  page?: number;
  userId?: string;
  parent?: number | null;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};
export type ShopsQueryOptionsType = {
  text?: string;
  page?: number;
  parent?: number | null;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};
export type WithdrawsQueryOptionsType = {
  text?: string;
  shop_id?: number;
  page?: number;
  parent?: number | null;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};
export type ProductsQueryOptionsType = {
  page?: number;
  shop_id?: number;
  text?: string;
  user?: string;
  category?: string;
  status?: string;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};
export type TypesQueryOptionsType = {
  page?: number;
  text?: string;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};
export type StaffsQueryOptionsType = {
  page?: number;
  shop_id?: number;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};

export type UserGroupQueryOptionsType = {
  page?: number;
  text?: string;
  userGroupId?: string;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};

export type QueryOptionsType = {
  page?: number;
  text?: string;
  shop_id?: number;
  limit?: number;
  orderBy?: string;
  sortedBy?: SortOrder;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
