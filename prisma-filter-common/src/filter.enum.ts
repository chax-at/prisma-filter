export enum FilterOperationType {
  // Numeric Operations
  Eq = '=',
  Lt = '<',
  Lte = '<=',
  Gt = '>',
  Gte = '>=',
  Ne = '!=',
  // String Operations
  /**
   * @deprecated Use {@link FilterOperationType.Contains} instead
   */
  Like = 'like',
  /**
   * @deprecated Use {@link FilterOperationType.IContains} instead
   */
  Ilike = 'ilike',
  Contains = 'contains',
  IContains = 'icontains',
  Search = 'search',
  ISearch = 'isearch',
  StartsWith = 'startswith',
  IStartsWith = 'istartswith',
  EndsWith = 'endswith',
  IEndsWith = 'iendswith',
  EqString = 'eqstring',
  NeString = 'nestring',
  // Array Operations
  In = 'in',
  NotIn = 'notin',
  InStrings = 'instrings',
  NotInStrings = 'notinstrings',
  // Null Operations
  EqNull = 'eqnull',
  NeNull = 'nenull',
}

export type FilterOrder = 'asc' | 'desc';
