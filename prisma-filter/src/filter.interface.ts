import {
  FilterOrder,
  IFilter,
} from '@chax-at/prisma-filter-common';

export type GeneratedFindOptions<
  TFindManyArgs extends {
    where?: unknown;
    select?: unknown;
    orderBy?: unknown;
    cursor?: unknown;
  }
> = {
  where: TFindManyArgs['where'];
  skip: number | undefined;
  take: number | undefined;
  cursor: TFindManyArgs['cursor'];
  // This can be "any" because we might sort by relations, therefore this will be an object
  orderBy: TFindManyArgs['orderBy'];
  select?: TRecursiveField;
  include?: TRecursiveField;
};

export interface IGeneratedFilter<
  TFindManyArgs extends {
    where?: unknown;
    select?: unknown;
    orderBy?: unknown;
    cursor?: unknown;
  }
> extends IFilter {
  findOptions: GeneratedFindOptions<TFindManyArgs>;
}

export type TRecursiveField = {
  [key: string]: boolean | TRecursiveField;
};

export interface IParsedQueryParams {
  select?: TRecursiveField;
  include?: TRecursiveField;
}
