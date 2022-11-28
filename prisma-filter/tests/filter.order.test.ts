import { FilterParser } from '../src/filter.parser';

const filterParser = new FilterParser<any, any>({
  test: 'test',
  test2: 'test2',
});

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

test('Sort asc', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    sort: [{ field: 'test', dir: 'asc' }],
  });
  expect(findOptions.orderBy[0]).toEqual({ test: 'asc' });
});

test('Sort multiple fields', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    sort: [
      { field: 'test', dir: 'asc' },
      { field: 'test2', dir: 'desc' },
    ],
  });
  expect(findOptions.orderBy[0]).toEqual({ test: 'asc' });
  expect(findOptions.orderBy[1]).toEqual({ test2: 'desc' });
});
