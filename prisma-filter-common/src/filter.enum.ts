export enum FilterOperationType {
  Eq = '=',
  Lt = '<',
  Lte = '<=',
  Gt = '>',
  Gte = '>=',
  Ne = '!=',
  Like = 'like',
  Ilike = 'ilike',
  In = 'in',
  InStrings = 'instrings',
  EqNull = 'eqnull',
  NeqNull = 'neqnull',
  EqString = 'eqstring',
  NeqString = 'neqstring',
}

export type FilterOrder = 'asc' | 'desc';
