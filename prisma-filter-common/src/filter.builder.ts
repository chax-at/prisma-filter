import { FilterOperationType, FilterOrder } from './filter.enum';
import { IFilter, ISingleFilter, ISingleOrder } from './filter.interface';

export class FilterBuilder<T = any> {
  /**
   * Transforms the filter to a query string, including `?` at the start.
   * @example
   * { offset: 50, filter: { field: 'name', type: 'ilike', value: 'Max' } }
   * will be transformed to
   * '?offset=50&filter[field]=name&filter[type]=ilike&filter[value]=Max'
   */
  public static buildFilterQueryString(filter: IFilter): string {
    const parts: string[] = [];

    if(filter.offset != null) {
      parts.push(`offset=${filter.offset}`);
    }
    if(filter.limit != null) {
      parts.push(`limit=${filter.limit}`);
    }
    const filterQuery = filter.filter ? FilterBuilder.buildQueryString('filter', filter.filter) : null;
    if(filterQuery != null) {
      parts.push(filterQuery);
    }
    const orderQuery = filter.order ? FilterBuilder.buildQueryString('order', filter.order) : null;
    if(orderQuery != null) {
      parts.push(orderQuery);
    }

    if(parts.length === 0) return '';

    return `?${parts.join('&')}`;
  }

  private static buildQueryString(paramName: string, array: Array<ISingleFilter | ISingleOrder>): string | null {
    const parts: Array<string> = [];
    for(let i = 0; i < array.length; i++) {
      for(const [key, value] of Object.entries(array[i])) {
        if(!['field', 'dir', 'type', 'value'].includes(key)) {
          continue;
        }
        /**
         * for FilterOperationType.In
         *
         * filter[x][field]=<fieldName>
         * & filter[x][type]=in
         */
        if(Array.isArray(value)) {
          if(value.length === 0) {
            parts.push(`${encodeURIComponent(paramName)}[${i}][${encodeURIComponent(key)}]=`);
          }
          for(let y = 0; y < value.length; y++) {
            /**
             * & filter[x][value][]=<value>
             */
            const valueY = value[y];
            parts.push(
              `${encodeURIComponent(paramName)}[${i}][${encodeURIComponent(key)}][]=${encodeURIComponent(valueY != null ? valueY.toString() : '')}`,
            );
          }
        } else {
          parts.push(`${encodeURIComponent(paramName)}[${i}][${encodeURIComponent(key)}]=${encodeURIComponent(value != null ? value.toString() : '')}`);
        }
      }
    }
    return parts.length === 0 ? null : parts.join('&');
  }

  private readonly filter: IFilter<T> = Object.create(null);

  constructor() {}

  /**
   * Adds a single filter for one field.
   *
   * @param field - The name of the field to filter by
   * @param type - The type of filter to apply
   * @param value - The value to filter for
   *
   * @returns FilterBuilder for chaining
   */
  public addFilter(field: keyof T & string, type: FilterOperationType, value: any): this {
    if(this.filter.filter == null) {
      this.filter.filter = [];
    }
    this.filter.filter.push({ field, type, value });

    return this;
  }

  /**
   * Adds an offset to the result.
   *
   * @param offset - The number of entries to offset from the beginning
   *
   * @returns FilterBuilder for chaining
   */
  public offsetBy(offset: number): this {
    this.filter.offset = offset;

    return this;
  }

  /**
   * Adds a limit to the result.
   *
   * @param limit - The number of entries that should be returned
   *
   * @returns FilterBuilder for chaining
   */
  public limitTo(limit: number): this {
    this.filter.limit = limit;

    return this;
  }

  /**
   * Sets a pagesize for the filter.
   * This is an alias for {@link limitTo}.
   *
   * @param pagesize - The number of entries that should be returned for a single page
   *
   * @returns FilterBuilder for chaining
   */
  public setPageSize(pagesize: number): this {
    return this.limitTo(pagesize);
  }

  /**
   * Requests a specific page of the result set. Requires {@link setPageSize} to have been called before.
   * Automatically calculates the required offset for the given page.
   * page 1 returns the first page (not page 0).
   *
   * @param page - The page number (starting at 1) to return
   *
   * @returns FilterBuilder for chaining
   */
  public requestPage(page: number): this {
    if(this.filter.limit == null) {
      throw new Error('requestPage can only be called after calling setPageSize');
    }
    if(page <= 0) {
      throw new Error('Invalid argument: page must be at least 1');
    }
    this.filter.offset = this.filter.limit * (page - 1);

    return this;
  }

  /**
   * Adds an ordering to the result.
   * If there are multiple entries with the same value in the given field, then later `orderBy`s are used.
   * If no additional `orderBy`s are added, then the resulting order between them is unspecified (and may break pagination).
   * Therefore, it is recommended to add a unique order field in the end (e.g. order by id if everything else is the same).
   *
   * @param field - The name of the field to order by
   * @param dir - FilterOrder direction
   *
   * @returns FilterBuilder for chaining
   */
  public addOrderBy(field: keyof T & string, dir: FilterOrder): this {
    if(this.filter.order == null) {
      this.filter.order = [];
    }
    this.filter.order.push({ field, dir });

    return this;
  }

  /**
   * Returns the built filter object.
   *
   * @returns Resulting filter
   */
  public toFilter(): IFilter<T> {
    return this.filter;
  }

  /**
   * Converts the built filter object into a query string (see {@link buildFilterQueryString})
   *
   * @returns Resulting query string in the form of '?offset=50&filter[field]=name&filter[type]=ilike&filter[value]=Max'
   */
  public toQueryString(): string {
    return FilterBuilder.buildFilterQueryString(this.filter);
  }
}
