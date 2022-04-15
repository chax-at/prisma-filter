import { FilterOperationType } from '@chax-at/prisma-filter-common';
import { FilterParser } from '../src/filter.parser';

const filterParser = new FilterParser<any, any>({ '!virtualField': '!virtualField' });

test('Virtual Field is ignored', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: '!virtualField', type: FilterOperationType.Eq, value: 'value' }],
    order: [{ field: '!virtualField', dir: 'asc' }],
  });
  expect(findOptions.orderBy.length).toBe(0);
  expect(Object.keys(findOptions.where).length).toBe(0);
});
