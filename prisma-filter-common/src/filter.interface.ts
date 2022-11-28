import { FilterOperationType, FilterOrder } from './filter.enum';

export interface IFilter<T = any> {
  filter?: Array<ISingleFilter<T>>;
  sort?: Array<ISingleOrder<T>>;
  order?: Array<ISingleOrder<T>>;
  offset?: number;
  limit?: number;
  page?: number;
  cursor?: string;
  skip?: number;
  select?: string[];
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
