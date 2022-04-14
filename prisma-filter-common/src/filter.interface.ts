import { FilterOperationType, FilterOrder } from './filter.enum';

export interface IFilter<T = any> {
  filter?: Array<ISingleFilter<T>>;
  order?: Array<ISingleOrder<T>>;
  offset?: number;
  limit?: number;
}

export interface ISingleFilter<T = any> {
  field: keyof T & string;
  type: FilterOperationType;
  value: any;
}

export interface ISingleOrder<T = any> {
  field: keyof T & string;
  dir: FilterOrder;
}
