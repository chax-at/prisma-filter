export enum FilterOperationType {
  Eq = '=',
  Lt = '<',
  Lte = '<=',
  Gt = '>',
  Gte = '>=',
  Ne = '!=',
  /**
   * Like is always treated as case-insensitive
   */
  Like = 'like',
  In = 'in',
  EqNull = 'eqnull',
  NeqNull = 'neqnull',
}

export type FilterOrder = 'asc' | 'desc';
