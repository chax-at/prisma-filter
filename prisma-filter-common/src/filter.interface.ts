import { FilterOperationType, FilterOrder } from './filter.enum';

/**
 * @deprecated This will be removed in the future, define this typing in your own project instead if you need it
 */
export interface IPaginatedDto<T> {
  rows: Array<T>;
  count: number;
}

export interface IFilter<T = any> {
  filter?: Array<ISingleFilter<T>>;
  order?: Array<ISingleOrder<T>>;
  offset: number;
  limit: number;
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
