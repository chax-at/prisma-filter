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
  NeNull = 'nenull',
  EqString = 'eqstring',
  NeString = 'nestring',
}

export type FilterOrder = 'asc' | 'desc';
