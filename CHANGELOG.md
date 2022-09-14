# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2022-08-31
### :warning: Breaking Changes
- The `prisma-filter-common` should now be installed in `dependencies` instead of `devDependencies` so that the new `FilterBuilder` can be used.
  - This is not a real breaking change, but is important to use new features.

### Added
- Added new `FilterBuilder` class to `prisma-filter-common` which provides a `buildFilterQueryString` method 
to transform a filter into a query string.

## [2.1.0] - 2022-07-18
### Added
- Added support for NestJS 9.

## [2.0.0] - 2022-04-14
### :warning: Breaking Changes
- The typing of `ISingleOrder.field` changed from `keyof T` to `keyof T & string`.

If you use the recommended file with class-validator, then you have to adapt the `SingleFilterOrder` class:
```typescript
export class SingleFilterOrder<T> implements ISingleOrder<T> {
  @IsString()
  field!: keyof T & string;

  @IsIn(['asc', 'desc'])
  dir!: FilterOrder;
}
```
- The `Like` filter is now case-sensitive, use the new `Ilike` filter instead to keep the old behaviour.
- The `NeqNull` filter has been renamed to `NeNull`.
- The deprecated `IPaginatedDto` interface has been removed.

### Added
- New `AllFilterPipeUnsafe` that allows filtering all model keys without specifying them.
- Support for booleans in `Eq`, `Ne` filters.
- `InStrings`, `EqString`, `NeString` filters to explicitly filter by string instead of using auto conversion.

### Changed
- Split up `Like`, `Ilike` filters.
- Renamed `NeqNull` to `NeNull` to be more consistent.

### Removed
- `IPaginatedDto` interface.

[2.2.0]: https://github.com/chax-at/prisma-filter/compare/2.1.0...2.2.0
[2.1.0]: https://github.com/chax-at/prisma-filter/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/chax-at/prisma-filter/releases/tag/2.0.0
