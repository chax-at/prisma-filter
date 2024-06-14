import { FilterParser } from '../src/filter.parser';

const filterParser = new FilterParser<any, any>({ test: 'test', test2: 'test2' });
const filterParserWithDefault = new FilterParser<any, any>(
  { test: 'test', test2: 'test2' },
  false,
  [
    {
      test: 'asc',
    },
  ],
);

const filterParserWithMultipleFieldDefault = new FilterParser<any, any>(
  { test: 'test', test2: 'test2' },
  false,
  [{ test: 'asc' }, { test2: 'desc' }],
);

test('Order asc', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    order: [{ field: 'test', dir: 'asc' }],
  });
  expect(findOptions.orderBy[0]).toEqual({ test: 'asc' });
});

test('Order multiple fields', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    order: [
      { field: 'test', dir: 'asc' },
      { field: 'test2', dir: 'desc' },
    ],
  });
  expect(findOptions.orderBy[0]).toEqual({ test: 'asc' });
  expect(findOptions.orderBy[1]).toEqual({ test2: 'desc' });
});

test('Default order', () => {
  const findOptions = filterParserWithDefault.generateQueryFindOptions({});
  expect(findOptions.orderBy[0]).toEqual({ test: 'asc' });
});

test('Default order can be overwritten', () => {
  const findOptions = filterParserWithDefault.generateQueryFindOptions({
    order: [{ field: 'test', dir: 'desc' }],
  });
  expect(findOptions.orderBy[0]).toEqual({ test: 'desc' });
});

test('Default order is added', () => {
  const findOptions = filterParserWithDefault.generateQueryFindOptions({
    order: [{ field: 'test2', dir: 'desc' }],
  });
  expect(findOptions.orderBy[0]).toEqual({ test2: 'desc' });
  expect(findOptions.orderBy[1]).toEqual({ test: 'asc' });
});

test('Default order multiple fields', () => {
  const findOptions = filterParserWithMultipleFieldDefault.generateQueryFindOptions({});
  expect(findOptions.orderBy[0]).toEqual({ test: 'asc' });
  expect(findOptions.orderBy[1]).toEqual({ test2: 'desc' });
});

test('Multiplpe Default orders: Fields are added', () => {
  const findOptions = filterParserWithMultipleFieldDefault.generateQueryFindOptions({
    order: [{ field: 'test2', dir: 'asc' }],
  });
  expect(findOptions.orderBy[0]).toEqual({ test2: 'asc' });
  expect(findOptions.orderBy[1]).toEqual({ test: 'asc' });
});

test('Multiplpe Default orders: Fields are added 2', () => {
  const findOptions = filterParserWithMultipleFieldDefault.generateQueryFindOptions({
    order: [{ field: 'test', dir: 'desc' }],
  });
  expect(findOptions.orderBy[0]).toEqual({ test: 'desc' });
  expect(findOptions.orderBy[1]).toEqual({ test2: 'desc' });
});
