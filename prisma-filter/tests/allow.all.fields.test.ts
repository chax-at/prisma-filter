import { FilterOperationType } from '@chax-at/prisma-filter-common';
import { FilterParser } from '../src/filter.parser';

const filterParser = new FilterParser<any, any>({ 'user.some.email': 'user.some.email' }, true);

test('Allow all fields allows all fields + custom fields', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [
      { field: 'user.some.email', type: FilterOperationType.Eq, value: 'value' },
      { field: 'someRandomKey', type: FilterOperationType.Eq, value: 'value2' },
    ],
    order: [
      { field: 'user.some.email', dir: 'asc' },
      { field: 'someRandomKey', dir: 'desc' },
    ],
  });
  expect(findOptions.where).toEqual({
    someRandomKey: { equals: 'value2' },
    user: {
      some: {
        email: {
          equals: 'value',
        },
      },
    },
  });

  expect(findOptions.orderBy[0]).toEqual({ user: { some: { email: 'asc' } } });
  expect(findOptions.orderBy[1]).toEqual({ someRandomKey: 'desc' });
});

test('Allow all fields does not allow filtering field with dot in the name', () => {
  expect(() =>
    filterParser.generateQueryFindOptions({
      filter: [{ field: 'user.some.password', type: FilterOperationType.Eq, value: 'value' }],
    }),
  ).toThrow(`user.some.password is not filterable`);
});

test('Allow all fields does not allow sorting field with dot in the name', () => {
  expect(() =>
    filterParser.generateQueryFindOptions({
      order: [{ field: 'user.some.password', dir: 'asc' }],
    }),
  ).toThrow(`user.some.password is not sortable`);
});
