import {
  FilterOperationType,
  FilterOrder,
  IFilter,
  ISingleCursor,
  ISingleFilter,
  ISingleOrder,
} from '@chax-at/prisma-filter-common';
import {
  GeneratedFindOptions,
  IParsedQueryParams,
  TRecursiveField,
} from './filter.interface';
import { IntFilter, StringFilter } from './prisma.type';
import { set } from 'lodash';

export class FilterParser<
  TDto,
  TFindManyArgs extends {
    where?: unknown;
    select?: unknown;
    orderBy?: unknown;
    cursor?: unknown;
  }
> {
  /**
   *
   * @param mapping - An object mapping from Dto key to database key
   * @param allowAllFields - Allow filtering on *all* top-level keys. Warning! Only use this if the user should have access to ALL data of the column
   * @param defaultIncludes - Keys in the form of 'roles' (-to-many relation) or 'roles.permissions' (-to-many relation) which will include related records in prisma query by default.
   */
  constructor(
    private readonly mapping: {
      [p in keyof TDto]?: keyof TFindManyArgs['where'] & string;
    },
    private readonly allowAllFields = false,
    private readonly defaultIncludes?: string[]
  ) {}

  public generateQueryFindOptions(
    filterDto: IFilter<TDto>
  ): GeneratedFindOptions<TFindManyArgs> {
    if (filterDto.filter == null) {
      filterDto.filter = [];
    }
    if (filterDto.sort == null) {
      filterDto.sort = [];
    }
    if (filterDto.order == null) {
      filterDto.order = [];
    }
    const order = filterDto.order.concat(filterDto.sort);
    const where = this.generateWhere(filterDto.filter);
    const generatedOrder = this.generateOrder(order);
    const skip = this.calculateSkip(
      filterDto.limit,
      filterDto.page,
      filterDto.offset,
      filterDto.skip
    );

    // if select defined, add select
    // if include defined, add include
    // if neither select or include defined, add default include
    const selectIncludeOptions: IParsedQueryParams = this.generateSelectInclude(
      filterDto.select,
      this.defaultIncludes
    );
    const cursor = this.generateCursor(filterDto.cursor);
    return {
      where: where as TFindManyArgs['where'],
      skip: skip,
      take: filterDto.limit,
      orderBy: generatedOrder,
      select: selectIncludeOptions['select'],
      include: selectIncludeOptions['include'],
      cursor: cursor,
    };
  }

  private calculateSkip(
    limit?: number,
    page?: number,
    offset?: number,
    skip?: number
  ): number {
    if (limit && page) {
      return (page - 1) * limit;
    }

    if (offset) {
      return offset;
    }

    if (skip) {
      return skip;
    }
    return 0;
  }

  private generateWhere(filter: Array<ISingleFilter<TDto>>): {
    [p in keyof TFindManyArgs['where']]?: any;
  } {
    const where: { [p in keyof TFindManyArgs['where']]?: any } =
      Object.create(null);
    for (const filterEntry of filter) {
      const fieldName = filterEntry.field;
      let dbFieldName = this.mapping[filterEntry.field];

      if (dbFieldName == null) {
        if (this.allowAllFields && !fieldName.includes('.')) {
          dbFieldName = fieldName as unknown as keyof TFindManyArgs['where'] &
            string;
        } else {
          throw new Error(`${fieldName} is not filterable`);
        }
      }
      if (dbFieldName.length > 0 && dbFieldName[0] === '!') {
        continue;
      }
      const dbFieldNameParts = dbFieldName.split('.');
      let currentWhere: any = where;

      for (const dbFieldPart of dbFieldNameParts) {
        if (currentWhere[dbFieldPart] == null) {
          currentWhere[dbFieldPart] = Object.create(null);
        }
        currentWhere = currentWhere[dbFieldPart];
      }
      Object.assign(
        currentWhere,
        this.generateWhereValue(filterEntry.type, filterEntry.value)
      );
    }
    return where;
  }

  private generateWhereValue(
    type: FilterOperationType,
    value: any
  ): { [p in keyof IntFilter | keyof StringFilter]?: any } {
    const queryValue = this.getFormattedQueryValueForType(value, type);
    if (type === FilterOperationType.Ilike) {
      return {
        [this.getOpByType(type)]: queryValue,
        mode: 'insensitive',
      };
    }
    return {
      [this.getOpByType(type)]: queryValue,
    };
  }

  private getFormattedQueryValueForType(
    rawValue: any,
    type: FilterOperationType
  ): string | number | string[] | number[] | boolean | null {
    if (Array.isArray(rawValue)) {
      if (
        rawValue.some(
          (value) =>
            typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        )
      ) {
        throw new Error(
          `Array filter value must be an Array<string|number|boolean>`
        );
      }
      if (type === FilterOperationType.InStrings) return rawValue;
      if (type !== FilterOperationType.In) {
        throw new Error(`Filter type ${type} does not support array values`);
      }
      return rawValue.map((v) => (!isNaN(+v) ? +v : v));
    }

    if (
      typeof rawValue !== 'string' &&
      typeof rawValue !== 'number' &&
      typeof rawValue !== 'boolean'
    ) {
      throw new Error(`Filter value must be a string, a number or a boolean`);
    }

    if (
      type === FilterOperationType.EqNull ||
      type === FilterOperationType.NeNull
    ) {
      // When the operator is of type equal/not equal null: ignore the filter value and set it to null. Otherwise, the value will be taken as a string ('null')
      return null;
    }

    if (type === FilterOperationType.Eq || type === FilterOperationType.Ne) {
      // If we filter for equality and the value looks like a boolean, then cast it into a boolean
      if (rawValue === 'true') return true;
      else if (rawValue === 'false') return false;
    }

    if (
      type === FilterOperationType.Like ||
      type === FilterOperationType.EqString ||
      type === FilterOperationType.NeString
    ) {
      // Never cast this value for a like filter because this only applies to strings
      return rawValue;
    }

    return !isNaN(+rawValue) ? +rawValue : rawValue;
  }

  private getOpByType(
    type: FilterOperationType
  ): keyof IntFilter | keyof StringFilter {
    switch (type) {
      case FilterOperationType.Eq:
      case FilterOperationType.EqNull:
      case FilterOperationType.EqString:
        return 'equals';
      case FilterOperationType.Lt:
        return 'lt';
      case FilterOperationType.Lte:
        return 'lte';
      case FilterOperationType.Gt:
        return 'gt';
      case FilterOperationType.Gte:
        return 'gte';
      case FilterOperationType.Ne:
      case FilterOperationType.NeNull:
      case FilterOperationType.NeString:
        return 'not';
      case FilterOperationType.Like:
      case FilterOperationType.Ilike:
        return 'contains';
      case FilterOperationType.In:
      case FilterOperationType.InStrings:
        return 'in';
      default:
        throw new Error(`${type} is not a valid filter type`);
    }
  }

  private generateOrder(
    order: Array<ISingleOrder<TDto>>
  ): Array<TFindManyArgs['orderBy']> {
    const generatedOrder = [];
    for (const orderEntry of order) {
      const fieldName = orderEntry.field;
      let dbFieldName = this.mapping[fieldName];

      if (dbFieldName == null) {
        if (this.allowAllFields && !fieldName.includes('.')) {
          dbFieldName = fieldName as unknown as keyof TFindManyArgs['where'] &
            string;
        } else {
          throw new Error(`${fieldName} is not orderable`);
        }
      }

      if (dbFieldName.length > 0 && dbFieldName[0] === '!') {
        continue;
      }

      const dbFieldNameParts = dbFieldName.split('.');
      const orderObjToAdd = Object.create(null);
      let currentObj: any = orderObjToAdd;

      for (let i = 0; i < dbFieldNameParts.length; i++) {
        const dbFieldPart = dbFieldNameParts[i];
        if (currentObj[dbFieldPart] == null) {
          currentObj[dbFieldPart] = Object.create(null);
        }
        if (i < dbFieldNameParts.length - 1) {
          currentObj = currentObj[dbFieldPart];
        } else {
          currentObj[dbFieldPart] = orderEntry.dir;
        }
      }

      generatedOrder.push(orderObjToAdd);
    }
    return generatedOrder as Array<{
      [p in keyof TFindManyArgs['where']]?: FilterOrder;
    }>;
  }

  private generateCursor(
    cursor?: ISingleCursor<TDto>
  ): TFindManyArgs['cursor'] {
    if (!cursor) {
      return undefined;
    }

    const fieldName = cursor.field;
    let dbFieldName = this.mapping[fieldName];

    if (dbFieldName == null) {
      if (this.allowAllFields && !fieldName.includes('.')) {
        dbFieldName = fieldName as unknown as keyof TFindManyArgs['cursor'] &
          string;
      } else {
        throw new Error(`${fieldName} is not orderable`);
      }
    }

    if (dbFieldName.length > 0 && dbFieldName[0] === '!') {
      return undefined;
    }

    const generatedcursor = {} as unknown as {
      [p in keyof TFindManyArgs['cursor']]?: any;
    };
    set(generatedcursor, cursor.field, cursor.value);

    return generatedcursor as {
      [p in keyof TFindManyArgs['cursor']]?: any;
    };
  }

  // select parsing
  private generateSelectInclude = (
    selectFields?: string[],
    defaultIncludes?: string[]
  ): TRecursiveField => {
    if (!selectFields && (!defaultIncludes || defaultIncludes.length == 0)) {
      return {
        select: false,
        include: false,
      };
    }

    if (!selectFields && defaultIncludes) {
      const includeQuery: TRecursiveField = {};
      defaultIncludes.forEach((field) => {
        field = field.replace('.', '.include.');
        field ? set(includeQuery, field, true) : null;
      });
      return {
        select: false,
        include: includeQuery,
      };
    }

    if (selectFields) {
      const selectFieldsQuery: TRecursiveField = {};
      selectFields.forEach((field) => {
        field = field.replace('.', '.select.');
        field ? set(selectFieldsQuery, field, true) : null;
      });
      return {
        select: selectFieldsQuery,
        include: false,
      };
    }
    return {};
  };
}
