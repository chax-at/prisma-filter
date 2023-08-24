import { FilterOperationType } from '@chax-at/prisma-filter-common';
import { FilterParser } from '../src/filter.parser';

const filterParser = new FilterParser<any, any>({ test: 'test' });

test('Eq', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Eq, value: 'value' }],
  });
  expect(findOptions.where.test).toEqual({ equals: 'value' });
});

test('Ne', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Ne, value: 'value' }],
  });
  expect(findOptions.where.test).toEqual({ not: 'value' });
});

test('Lt', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Lt, value: '17' }],
  });
  expect(findOptions.where.test).toEqual({ lt: 17 });
});

test('Lte', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Lte, value: '17' }],
  });
  expect(findOptions.where.test).toEqual({ lte: 17 });
});

test('Gt', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Gt, value: '17' }],
  });
  expect(findOptions.where.test).toEqual({ gt: 17 });
});

test('Gte', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Gte, value: '17' }],
  });
  expect(findOptions.where.test).toEqual({ gte: 17 });
});

test('Like', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Contains, value: '%val%' }],
  });
  expect(findOptions.where.test).toEqual({ contains: '%val%' });
});

test('Like for number', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Contains, value: '5' }],
  });
  expect(findOptions.where.test).toEqual({ contains: '5' });
});

test('Ilike', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.IContains, value: '%val%' }],
  });
  expect(findOptions.where.test).toEqual({ contains: '%val%', mode: 'insensitive' });
});

test('Ilike for number', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.IContains, value: '5' }],
  });
  expect(findOptions.where.test).toEqual({ contains: '5', mode: 'insensitive' });
});

test('In', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.In, value: ['val1', 'val2'] }],
  });
  expect(findOptions.where.test).toEqual({ in: ['val1', 'val2'] });
});

test('InStrings', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.InStrings, value: ['val1', 'val2'] }],
  });
  expect(findOptions.where.test).toEqual({ in: ['val1', 'val2'] });
});

test('EqNull', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.EqNull, value: 'irrelevant' }],
  });
  expect(findOptions.where.test).toEqual({ equals: null });
});

test('NeNull', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.NeNull, value: 'irrelevant' }],
  });
  expect(findOptions.where.test).toEqual({ not: null });
});

test('EqString', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.EqString, value: 'value' }],
  });
  expect(findOptions.where.test).toEqual({ equals: 'value' });
});

test('NeString', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.NeString, value: 'value' }],
  });
  expect(findOptions.where.test).toEqual({ not: 'value' });
});

test('StartsWith', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.StartsWith, value: '5' }],
  });
  expect(findOptions.where.test).toEqual({ startsWith: '5' });
});

test('IStartsWith', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.IStartsWith, value: '5' }],
  });
  expect(findOptions.where.test).toEqual({ startsWith: '5', mode: 'insensitive' });
});

test('EndsWith', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.EndsWith, value: '5' }],
  });
  expect(findOptions.where.test).toEqual({ endsWith: '5' });
});

test('IEndsWith', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.IEndsWith, value: '5' }],
  });
  expect(findOptions.where.test).toEqual({ endsWith: '5', mode: 'insensitive' });
});


test('Search', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.Search, value: '5' }],
  });
  expect(findOptions.where.test).toEqual({ search: '5' });
});

test('ISearch', () => {
  const findOptions = filterParser.generateQueryFindOptions({
    filter: [{ field: 'test', type: FilterOperationType.ISearch, value: '5' }],
  });
  expect(findOptions.where.test).toEqual({ search: '5', mode: 'insensitive' });
});
