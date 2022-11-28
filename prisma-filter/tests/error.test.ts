import { FilterOperationType } from '@chax-at/prisma-filter-common';
import { FilterParser } from '../src/filter.parser';

const filterParser = new FilterParser<any, any>({ test: 'test' });
test('Eq invalid field', () => {
  expect(() =>
    filterParser.generateQueryFindOptions({
      filter: [
        { field: 'nonExistant', type: FilterOperationType.Eq, value: '13.5' },
      ],
    })
  ).toThrow(`nonExistant is not filterable`);
});

test('Order invalid field', () => {
  expect(() =>
    filterParser.generateQueryFindOptions({
      order: [{ field: 'nonExistant', dir: 'asc' }],
    })
  ).toThrow(`nonExistant is not orderable`);
});

test('Eq array', () => {
  expect(() =>
    filterParser.generateQueryFindOptions({
      filter: [
        { field: 'test', type: FilterOperationType.Eq, value: ['13.5', '12'] },
      ],
    })
  ).toThrow(`Filter type = does not support array values`);
});

test('Should not allow an object as filter', () => {
  expect(() =>
    filterParser.generateQueryFindOptions({
      filter: [
        {
          field: 'test',
          type: FilterOperationType.Eq,
          value: { injections: { are: 'bad' } },
        },
      ],
    })
  ).toThrow();
});

test('Should not allow an object array as filter', () => {
  expect(() =>
    filterParser.generateQueryFindOptions({
      filter: [
        {
          field: 'test',
          type: FilterOperationType.InStrings,
          value: [{ injections: { are: 'bad' } }],
        },
      ],
    })
  ).toThrow();
});
