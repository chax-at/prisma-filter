import { IFilter, ISingleFilter, ISingleOrder } from './filter.interface';

export class FilterBuilder {
  /**
   * Transforms the filter to a query string, including `?` at the start.
   * @example
   * { offset: 50, filter: { field: 'name', type: 'ilike', value: 'Max' } }
   * will be transformed to
   * ?offset=50&filter[field]=name&filter[type]=ilike&filter[value]=Max
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
             * & filter[x][value][y]=<value>
             */
            const valueY = value[y];
            parts.push(
              `${encodeURIComponent(paramName)}[${i}][${encodeURIComponent(key)}][${y}]=${encodeURIComponent(valueY != null ? valueY.toString() : '')}`,
            );
          }
        } else {
          parts.push(`${encodeURIComponent(paramName)}[${i}][${encodeURIComponent(key)}]=${encodeURIComponent(value != null ? value.toString() : '')}`);
        }
      }
    }
    return parts.length === 0 ? null : parts.join('&');
  }
}
