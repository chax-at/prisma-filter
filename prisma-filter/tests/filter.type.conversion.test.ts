import { FilterOperationType } from '@chax-at/prisma-filter-common';
import { FilterParser } from '../src/filter.parser';

const filterParser = new FilterParser<any, any>({ test: 'test' });

test('Eq number', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Eq, value: '13.5' }],
  });
  expect(findOptions.where.test).toEqual({ equals: 13.5 });
});

test('Ne number', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Ne, value: '13.5' }],
  });
  expect(findOptions.where.test).toEqual({ not: 13.5 });
});

test('Eq true', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Eq, value: 'true' }],
  });
  expect(findOptions.where.test).toEqual({ equals: true });
});

test('Ne false', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Ne, value: 'false' }],
  });
  expect(findOptions.where.test).toEqual({ not: false });
});

test('In number array', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [
      { field: 'test', type: FilterOperationType.In, value: ['1', '2', '3.5'] },
    ],
  });
  expect(findOptions.where.test).toEqual({ in: [1, 2, 3.5] });
});

// String functions

test('Eq number string', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [
      { field: 'test', type: FilterOperationType.EqString, value: '13.5' },
    ],
  });
  expect(findOptions.where.test).toEqual({ equals: '13.5' });
});

test('Ne number string', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [
      { field: 'test', type: FilterOperationType.NeString, value: '13.5' },
    ],
  });
  expect(findOptions.where.test).toEqual({ not: '13.5' });
});

test('Eq true string', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [
      { field: 'test', type: FilterOperationType.EqString, value: 'true' },
    ],
  });
  expect(findOptions.where.test).toEqual({ equals: 'true' });
});

test('Ne false string', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [
      { field: 'test', type: FilterOperationType.NeString, value: 'false' },
    ],
  });
  expect(findOptions.where.test).toEqual({ not: 'false' });
});

test('In number array string', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [
      {
        field: 'test',
        type: FilterOperationType.InStrings,
        value: ['1', '2', '3.5'],
      },
    ],
  });
  expect(findOptions.where.test).toEqual({ in: ['1', '2', '3.5'] });
});
