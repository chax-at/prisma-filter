import {
  FilterOrder,
  IFilter,
} from '@chax-at/prisma-filter-common';

export type GeneratedFindOptions<TWhereInput> = {
  where: TWhereInput;
  skip: number | undefined;
  take: number | undefined;
  // This can be "any" because we might sort by relations, therefore this will be an object
  orderBy: Array<{ [p in keyof TWhereInput]?: FilterOrder | any }>;
  select?: TRecursiveField;
  include?: TRecursiveField;
};

export interface IGeneratedFilter<TWhereInput> extends IFilter {
  findOptions: GeneratedFindOptions<TWhereInput>;
}

export type TRecursiveField = {
  [key: string]: boolean | TRecursiveField;
};

export interface IParsedQueryParams {
  select?: TRecursiveField;
  include?: TRecursiveField;
}
