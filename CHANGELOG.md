# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2022-04-14
### Breaking Changes
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
- The deprecated `IPaginatedDto` interface has been removed.

### Added
- New `AllFilterPipe` that allows filtering all model keys without specifying them.
- Support for booleans in `Eq`, `Neq` filters.
- Add `InStrings`, `EqString`, `NeqString` filters to explicitly filter by string instead of using auto conversion.

### Changed
- Split up `Like`, `Ilike` filters.

### Removed
- Removed deprecated `IPaginatedDto` interface.
