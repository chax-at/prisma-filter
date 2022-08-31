import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';

test('Builds a simple filter', () => {
  const queryString = FilterBuilder.buildFilterQueryString({
    limit: 20,
    offset: 30,
    filter: [
      { field: 'field1', type: FilterOperationType.NeNull, value: 'val1' },
      { field: 'field2', type: FilterOperationType.InStrings, value: ['str1', 'str2'] },
    ],
    order: [
      { field: 'field1', dir: 'asc' },
      { field: 'field2', dir: 'desc' },
    ],
  });
  expect(queryString).toEqual('?offset=30&limit=20&filter[0][field]=field1&filter[0][type]=nenull&filter[0][value]=val1&filter[1][field]=field2&filter[1][type]=instrings&filter[1][value][0]=str1&filter[1][value][1]=str2&order[0][field]=field1&order[0][dir]=asc&order[1][field]=field2&order[1][dir]=desc');
});
