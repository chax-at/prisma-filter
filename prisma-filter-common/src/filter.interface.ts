import { FilterOperationType, FilterOrder } from './filter.enum';

export interface IPaginatedDto<T> {
  rows: Array<T>;
  count: number;
}

export interface ISingleFilter<T = any> {
  field: keyof T & string;
  type: FilterOperationType;
  value: any;
}

export interface ISingleOrder<T = any> {
  field: keyof T;
  dir: FilterOrder;
}

export interface IFilter<T = any> {
  filter?: Array<ISingleFilter<T>>;
  order?: Array<ISingleOrder<T>>;
  offset: number;
  limit: number;
}
