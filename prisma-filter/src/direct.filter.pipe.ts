import { IFilter } from '@chax-at/prisma-filter-common';
import { Injectable, PipeTransform } from '@nestjs/common';
import { IGeneratedFilter } from './filter.interface';
import { FilterParser } from './filter.parser';

/**
 * This pipe transforms Tabulator-like filters (usually in query parameters) to a generated filter with prisma WhereInput for a specified model assuming you
 * have a direct 1:1 mapping (i.e. the filter field names are the same as the database field names).
 *
 * This pipe is easier to use than FilterPipe, but cannot contain custom mappings.
 *
 * In most cases, this pipe can be used by using new DirectFilterPipe<any, Prisma.MyWhereInput>(['field1', 'field2'])
 **
 * See comment in filter.pipe.ts for further explanation how this pipe works (except that the constructor takes an array of strings instead of a mapping)
 * See filter.parser.ts for FilterParser implementation details.
 */
 @Injectable()
 export class DirectFilterPipe<
   TDto,
   TFindManyArgs extends {
     where?: unknown;
     select?: unknown;
     orderBy?: unknown;
     cursor?: unknown;
   }
 > implements PipeTransform<IFilter<TDto>, IGeneratedFilter<TFindManyArgs>>
 {
   private readonly filterParser: FilterParser<TDto, TFindManyArgs>;
 
   /**
    * Create a new filter pipe that transforms Tabulator-like filters (usually in query parameters) to a generated filter with prisma WhereInput for a specified
    * model assuming you have a direct 1:1 mapping (i.e. the filter field names are the same as the database field names).
    *
    * @example new DirectFilterPipe<any, Prisma.OrderInput>(['id', 'createdAt'], ['user.name', 'articles.some.name'])
    *
    * @param keys - Keys that are mapped 1:1
    * @param compoundKeys - Keys in the form of 'user.firstname' (-to-one relation) or 'articles.some.name' (-to-many relation) which will be mapped to relations. Keys starting with ! are ignored.
    * @param defaultIncludes - Keys in the form of 'roles' (-to-many relation) or 'roles.permissions' (-to-many relation) which will include related records in prisma query by default.
    */
   constructor(
     keys: Array<keyof TDto & keyof TFindManyArgs['where'] & string>,
     compoundKeys: string[] = [],
     defaultIncludes: string[] = []
   ) {
     const mapping: {
       [p in keyof TDto]?: keyof TFindManyArgs['where'] & string;
     } = Object.create(null);
     for (const key of keys) {
       mapping[key] = key;
     }
     for (const untypedKey of compoundKeys) {
       (mapping as any)[untypedKey] = untypedKey;
     }
     this.filterParser = new FilterParser<TDto, TFindManyArgs>(
       mapping,
       false,
       defaultIncludes
     );
   }
 
   public transform(value: IFilter<TDto>): IGeneratedFilter<TFindManyArgs> {
     return {
       ...value,
       findOptions: this.filterParser.generateQueryFindOptions(value),
     };
   }
 }
 