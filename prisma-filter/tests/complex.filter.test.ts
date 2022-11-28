import { FilterOperationType } from '@chax-at/prisma-filter-common';
import { FilterParser } from '../src/filter.parser';

const filterParser = new FilterParser<any, any>({
  'user.some.email': 'user.some.email',
  'order.someValue': 'order.someValue',
});

test('Complex eq', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [
      {
        field: 'user.some.email',
        type: FilterOperationType.Eq,
        value: 'value',
      },
    ],
  });
  expect(findOptions.where.user).toEqual({
    some: { email: { equals: 'value' } },
  });
});

test('Complex order', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    order: [{ field: 'order.someValue', dir: 'desc' }],
  });
  expect(findOptions.orderBy[0]).toEqual({ order: { someValue: 'desc' } });
});

test('Complex order', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    order: [{ field: 'order.someValue', dir: 'desc' }],
  });
  expect(findOptions.orderBy[0]).toEqual({ order: { someValue: 'desc' } });
});
