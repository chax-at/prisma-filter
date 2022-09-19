# @chax-at/prisma-filter
This package provides a <a href="https://github.com/nestjs/nest">NestJS</a> transformation pipe that transforms
REST query parameters into `findOption`s for <a href="https://github.com/prisma/prisma">Prisma</a>.
The query parameters use the same structure as <a href="http://tabulator.info/docs/5.1/filter#ajax-filter">Tabulator</a>.

## Usage - Frontend
First, install all needed types by running
```
npm i @chax-at/prisma-filter-common
```

Then, if you want to filter + paginate the result of a certain request, you can send query parameters that satisfy
the `IFilter` interface from the common library.

```
http://localhost:3000/api/admin/orders?offset=10&limit=10&filter[0][field]=id&filter[0][type]==&filter[0][value]=2&filter[1][field]=name&filter[1][type]=like&filter[1][value]=%Must%&order[0][field]=name&order[0][dir]=asc
```

Check the `FilterOperationType` enum to see all possible filter types. Note that by default, all filter values are
treated as a `string`, `number` (or `string[]`/`number[]` for `in`-filters). If you want to filter by `null` instead
of `'null'`, then use the `EqNull`/`NeNull` filter types (the given value is ignored in this case).

### Building a filter

This package provides a `FilterBuilder<T>` class which can be used to create the filter:

```typescript
import { FilterBuilder, FilterOperationType } from '@chax-at/prisma-filter-common';

const filterBuilder = new FilterBuilder<User>() // create a new filter builder for User entities..
        .addFilter('name', FilterOperationType.Ilike, '%Max%') // ...filter by name ilike '%Max%'
        .orderBy('name', 'asc') // ...order by name, asc
        .setPageSize(40) // ...paginate with a pagesize of 40
        .requestPage(3); // ...return the third page
const filter = filterBuilder.toFilter(); // get the resulting IFilter<User>
const queryString = filterBuilder.toQueryString(); // get the resulting query string (as described below)

// Note that you can also re-use the same filter if you just want to request a different page without changing filter or ordering:
const firstPageFilter = filterBuilder.requestPage(1).toFilter();
```

#### Building a query string

In the end, a query string is required which will be sent to the backend server. To build this query string,
you can use `FilterBuilder.toQueryString()` when building a filter using the FilterBuilder as described above.
However, it is also possible to transform an existing filter into a query string:

```typescript
const queryString = FilterBuilder.buildFilterQueryString({
  limit: 20,
  offset: 30,
  filter: [
    { field: 'field1', type: FilterOperationType.NeNull, value: 'val1' },
    { field: 'field2', type: FilterOperationType.InStrings, value: ['str1', 'str2'] },
  ],
  order: [
    { field: 'field1', dir: 'asc' },
    { field: 'field2', dir: 'desc' },
  ],
});
// queryString is
// ?offset=30&limit=20&filter[0][field]=field1&filter[0][type]=nenull&filter[0][value]=val1&filter[1][field]=field2&filter[1][type]=instrings&filter[1][value][0]=str1&filter[1][value][1]=str2&order[0][field]=field1&order[0][dir]=asc&order[1][field]=field2&order[1][dir]=desc
```

### Filter types

* `Eq`, `Ne` checks for strict (in)equality. Used for numbers and booleans.
* `EqString`, `NeString` string (in)equality check for strings. Does not convert numbers or booleans unlike `Eq` and `Ne`.
* `Lt`, `Lte`, `Gt`, `Gte` is used to filter numbers by checking whether they are greater/less than (or equal to) the value
* `Like` is transformed into a postgres `like`, used to filter for strings. Use `%` as a wildcard, e.g. `%Max%` to find partial matches.
* `Ilike` is like `Like` but case-insensitive
* `In` checks whether the value is in the given numbers array. Use `InStrings` for string arrays.
* `InStrings` checks whether value is in the given string array.
* `EqNull`, `NeNull` checks whether the value is null or not null. Must be used instead of `Eq`, `Ne` because otherwise `null` would be treated as string

### Filter value types
Since the filter is transferred via query parameters, everything will be converted into a string. This library will
automatically convert the filter value following these rules:
* If the filter type is `Eq`, `Ne` and the value is 'true' or 'false', then it's converted into a boolean
  * Use `EqString`, `NeString` if you want to filter strings and don't convert it
* If the filter type is not `Like` or `...String` and the value is a number (or a number array for `In`), then it's converted into a number (or a number array)
* Otherwise, the value is treated as a string

For string filters, the `Like` or `Ilike` filter types are recommended since usually a partial search is required.
But if you want to use a different filter for strings, make sure to use the `...String` variant of it, otherwise
<a href="https://twitter.com/racheltrue/status/1365461618977476610">Rachel True</a> can't filter by her name.

## Usage - Backend

This package exports two <a href="https://docs.nestjs.com/pipes">Pipes</a>, the `DirectFilterPipe` (which is used in most cases)
and the more generic `FilterPipe`. It is also possible to use the exported `FilterParser` class to transform
query parameters manually.

### Prerequisites
First, install the package by running
```
npm i @chax-at/prisma-filter
```

You also need to have `@nestjs/common` installed, currently version 6-9 is supported.
This package also exports everything from the `prisma-filter-common` so it is not necessary to install both packages.

To validate the user query input, you might have to provide your own interface implementations with the annotated
validation constraints. If you're using class-validator and class-transformer, this definition can look like this
(set the constraints and default values for offset+limit to sensible values for your project):
```typescript
import { FilterOperationType, FilterOrder, GeneratedFindOptions, IFilter, IGeneratedFilter, ISingleFilter, ISingleOrder } from '@chax-at/prisma-filter';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

// The fields are also validated in filter.parser.ts to make sure that only correct fields are used to filter
export class SingleFilter<T> implements ISingleFilter<T> {
  @IsString()
  field!: keyof T & string;

  @IsEnum(FilterOperationType)
  type!: FilterOperationType;

  @IsDefined()
  value: any;
}

export class SingleFilterOrder<T> implements ISingleOrder<T> {
  @IsString()
  field!: keyof T & string;

  @IsIn(['asc', 'desc'])
  dir!: FilterOrder;
}

export class Filter<T = any> implements IFilter<T> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilter)
  @IsOptional()
  filter?: Array<SingleFilter<T>>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilterOrder)
  @IsOptional()
  order?: Array<SingleFilterOrder<T>>;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit = 100;
}

export class FilterDto<TWhereInput> extends Filter implements IGeneratedFilter<TWhereInput> {
  // This will be set by filter pipe
  findOptions!: GeneratedFindOptions<TWhereInput>;
}
```
This readme assumes that you're using the file above, but you can adapt the types used in the examples below as needed.

### DirectFilterPipe
The direct filter pipe maps fields from the query parameter 1:1 to database fields. This is usually the pipe you
want to use.

To enable filtering, you can import and use the `DirectFilterPipe<TDto, TWhereInput>(keys, compoundKeys?)`. Full example:
```typescript
// Controller
import { Prisma } from '@prisma/client';
// ...

@Controller('/some/path')
export class SomeController {
  constructor(private readonly someService: SomeService) {}

  @Get()
  public async getOrders(
    @Query(new DirectFilterPipe<any, Prisma.OrderWhereInput>(
      ['id', 'status', 'createdAt', 'refundStatus', 'refundedPrice', 'paymentDate', 'totalPrice', 'paymentMethod'],
      ['event.title', 'user.email', 'user.firstname', 'user.lastname', 'contactAddress.firstName', 'contactAddress.lastName', '!paymentInAdvance'],
    )) filterDto: FilterDto<Prisma.OrderWhereInput>,
  ) {
    return this.someService.getOrders(filterDto.findOptions);
  }
}
```

```typescript
// Service

@Injectable()
export class SomeService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getOrders(findOptions: Prisma.OrderFindManyArgs) {
    return this.prismaService.order.findMany({
      ...findOptions,
      // Is is now possible, to add custom options like include
      include: {
        user: true,
      },
      // Note that you cannot simply add `where` here, because you would override the definition from the findOptions
      // Change findOptions.where instead if you want to add additional conditions
    })
  }
}
```

#### Generic types
* `TDto` is a type that describes the filter query parameter. Can be set to `any` since the names are mapped 1:1
* `TWhereInput` is the target prisma type and types the filterable keys.

#### Parameters
* `keys` is the first parameter and is a list of all keys that can be filtered directly in the OrderWhereInput,
  not including any relations. These are type checked.
* `compoundKeys` (optional) can be used to query related fields, e.g. if your `Order` model has a relation `user`, then you can filter on
  `user.email`. If the relation is 1:n or n:n like `articles` in an `Order`, then you can use the
  <a href="https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#filter-on--to-many-relations">
  corresponding prisma syntax
  </a>, e.g. `articles.some.title` to filter for orders that contain at least one article with the given title.
  These are not type checked.

#### Virtual fields
If you prefix your compoundKey with `!`, then it will be ignored by the filter pipe. You can use this, if you
want to implement some custom logic if a certain filter is set, e.g.
```typescript
export class SomeController {
  @Get()
  public async getOrders(
    @Query(new DirectFilterPipe<any, Prisma.OrderWhereInput>(
      [],
      ['!paymentInAdvance'],
    )) filterDto: FilterDto<Prisma.OrderWhereInput>,
  ) {
    if(filterDto.filter?.some(f => f.field === '!paymentInAdvance')) {
      console.log('The paymentInAdvance filter is set, now I can do whatever I want!');
    }
  }
}
```

### AllFilterPipeUnsafe
The `AllFilterPipeUnsafe` is a pipe that can be used more conveniently if you want to allow filtering on all fields of the model.
Compound keys still have to be specified as described above.
> :warning: This allows users to read ALL keys of the model, even if you don't return the data
> (e.g. by sending multiple like filters until the user knows the full value).
>
> Make sure that your model does not contain any sensitive data in fields (e.g. don't use this pipe on a `users` table with
> a `password` field).

```typescript
export class SomeController {
  constructor(private readonly someService: SomeService) {}

  @Get()
  public async getOrders(
    @Query(new AllFilterPipeUnsafe<any, Prisma.OrderWhereInput>(
      ['event.title', 'user.email', 'user.firstname', 'user.lastname', 'contactAddress.firstName', 'contactAddress.lastName', '!paymentInAdvance'],
    )) filterDto: FilterDto<Prisma.OrderWhereInput>,
  ) {
    return this.someService.getOrders(filterDto.findOptions);
  }
}
```

### FilterPipe
The `FilterPipe` works like the `DirectFilterPipe`, however the parameter is an object that can map certain
query parameter names to different key names of the object, e.g.
```
{
  // the query parameter is frontendUsernameFilterName, but will filter on the name field of the object
  'frontendUsernameFilterName': 'name',
}
```

### FilterParser
You can use the `FilterParser` to generate prisma find options without using a pipe.
