# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.2.0 - 2025-02-27
### Added
- Added support for NestJS 11

## 4.1.0 - 2024-06-14
### Added
- Added a new parameter to `DirectFilterPipe`, `AllFilterPipeUnsafe` and `FilterParser`, allowing you to define a default sort order that is always appended unless the keys are set by the request.

### Changed
- Minimum required node version increased to 18 (which should not be breaking because node 16 is EOL since 2023-09-11)

## [4.0.0] - 2024-02-21
### :warning: Breaking Changes
Added new filter operations. Make sure that both the common-package and the prisma-filter-package in your Frontend and Backend are on version 4.

### Added
- Added `ArrayContains`, `ArrayStartsWith`, `ArrayEndsWith` filters (by @memicmiralem).

## [3.0.0] - 2023-08-24
### :warning: Breaking Changes
Added new filter operations. Make sure that both the common-package and the prisma-filter-package in your Frontend and Backend are on version 3.

### Added
- Added `(I)Search`, `(I)StartsWith`, `(I)EndsWith`, `(I)Contains`, `NotIn`, `NotInStrings` filters.
- `(I)Like` is now deprecated, `(I)Contains` should be used instead to better match the Prisma operation.

## [2.5.0] - 2023-06-16
### Added
- Added support for NestJS 10

## [2.4.0] - 2023-06-06
### Fixed
- `Ilike` filter now correctly always converts the value to a string (like `Like`)

### Changed
- `FilterBuilder` now builds value arrays in the form of `filter[0][value][]=13` instead of `filter[0][value][0]=13` to
  save some characters and fix a bug where large arrays might be parsed as objects instead of arrays.


## [2.3.0] - 2022-09-20
### Added
- Added new `FilterBuilder` functionality to build a filter using a builder pattern.

### Changed
- Removed source maps to reduce package size.
- Objects are now created using `Object.create(null)` as additional hardening against prototype pollution.

## [2.2.0] - 2022-08-31
### :warning: Important Changes
- The `prisma-filter-common` should now be installed in `dependencies` instead of `devDependencies` so that the new `FilterBuilder` can be used.
  - This is not a real breaking change, but is important to be able to use new features.

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

[4.0.0]: https://github.com/chax-at/prisma-filter/compare/3.0.0...4.0.0
[3.0.0]: https://github.com/chax-at/prisma-filter/compare/2.5.0...3.0.0
[2.5.0]: https://github.com/chax-at/prisma-filter/compare/2.4.0...2.5.0
[2.4.0]: https://github.com/chax-at/prisma-filter/compare/2.3.0...2.4.0
[2.3.0]: https://github.com/chax-at/prisma-filter/compare/2.2.0...2.3.0
[2.2.0]: https://github.com/chax-at/prisma-filter/compare/2.1.0...2.2.0
[2.1.0]: https://github.com/chax-at/prisma-filter/compare/2.0.0...2.1.0
[2.0.0]: https://github.com/chax-at/prisma-filter/releases/tag/2.0.0
