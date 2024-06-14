import { FilterOrder, IFilter } from '@chax-at/prisma-filter-common';

export type OrderBy<TWhereInput> = Array<{
  // This can be "any" because we might order by relations, therefore this will be an object
  [p in keyof TWhereInput]?: FilterOrder | any;
}>;

export type GeneratedFindOptions<TWhereInput> = {
  where: TWhereInput;
  skip: number | undefined;
  take: number | undefined;
  orderBy: OrderBy<TWhereInput>;
};

export interface IGeneratedFilter<TWhereInput> extends IFilter {
  findOptions: GeneratedFindOptions<TWhereInput>;
}
