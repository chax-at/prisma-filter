import { FilterOperationType, FilterOrder, IFilter, ISingleFilter, ISingleFilterOrder } from '@chax-at/prisma-filter-common';
import { GeneratedFindOptions } from './filter.interface';
import { IntFilter, StringFilter } from './prisma.type';

export class FilterParser<TDto, TWhereInput> {
  constructor(
    private readonly mapping: { [p in keyof TDto]?: keyof TWhereInput & string },
  ) { }

  public generateQueryFindOptions(filterDto: IFilter<TDto>): GeneratedFindOptions<TWhereInput> {
    if(filterDto.filter == null) {
      filterDto.filter = [];
    }
    if(filterDto.order == null) {
      filterDto.order = [];
    }

    const where = this.generateWhere(filterDto.filter);
    const generatedOrder = this.generateOrder(filterDto.order);
    return {
      where: where as TWhereInput,
      skip: filterDto.offset,
      take: filterDto.limit,
      orderBy: generatedOrder,
    };
  }

  private generateWhere(filter: Array<ISingleFilter<TDto>>): { [p in keyof TWhereInput]?: any } {
    const where: { [p in keyof TWhereInput]?: any } = {};
    for(const filterEntry of filter) {
      const fieldName = filterEntry.field;
      const dbFieldName = this.mapping[filterEntry.field];

      if(dbFieldName == null) {
        throw new Error(`${fieldName} is not filterable`);
      }
      if(dbFieldName.length > 0 && dbFieldName[0] === '!') {
        continue;
      }
      const dbFieldNameParts = dbFieldName.split('.');
      let currentWhere: any = where;

      for(const dbFieldPart of dbFieldNameParts) {
        if(currentWhere[dbFieldPart] == null) {
          currentWhere[dbFieldPart] = {};
        }
        currentWhere = currentWhere[dbFieldPart];
      }
      Object.assign(currentWhere, this.generateWhereValue(filterEntry.type, filterEntry.value));
    }
    return where;
  }

  private generateWhereValue(type: FilterOperationType, value: any): { [p in keyof IntFilter | keyof StringFilter]?: any } {
    const queryValue = this.getFormattedQueryValueForType(value, type);
    if(type === FilterOperationType.Like) {
      return {
        [this.getOpByType(type)]: queryValue,
        mode: 'insensitive',
      };
    }
    return {
      [this.getOpByType(type)]: queryValue,
    };
  }

  private getFormattedQueryValueForType(rawValue: any, type: FilterOperationType): string | number | string[] | number[] | null {
    if(Array.isArray(rawValue)) {
      if(type !== FilterOperationType.In) {
        throw new Error(`Filter type ${type} does not support array values`);
      }
      return rawValue.map(v => !isNaN(+v) ? +v : v);
    }

    if(type === FilterOperationType.EqNull || type === FilterOperationType.NeqNull) {
      // When the operator is of type equal/not equal null: ignore the filter value and set it to null. Otherwise, the value will be taken as a string ('null')
      return null;
    }

    return !isNaN(+rawValue) ? +rawValue : rawValue;
  }

  private getOpByType(type: FilterOperationType): keyof IntFilter | keyof StringFilter {
    switch(type) {
      case FilterOperationType.Eq:
      case FilterOperationType.EqNull:
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
      case FilterOperationType.NeqNull:
        return 'not';
      case FilterOperationType.Like:
        return 'contains';
      case FilterOperationType.In:
        return 'in';
      default:
        throw new Error(`${type} is not a valid filter type`);
    }
  }

  private generateOrder(order: Array<ISingleFilterOrder<TDto>>): Array<{ [p in keyof TWhereInput]?: FilterOrder }> {
    const generatedOrder = [];
    for(const orderEntry of order) {
      const dbFieldName = this.mapping[orderEntry.field];

      if(dbFieldName == null) {
        throw new Error(`${orderEntry.field} is not sortable`);
      }

      if(dbFieldName.length > 0 && dbFieldName[0] === '!') {
        continue;
      }

      const dbFieldNameParts = dbFieldName.split('.');
      const sortObjToAdd = {};
      let currentObj: any = sortObjToAdd;

      for(let i = 0; i < dbFieldNameParts.length; i++) {
        const dbFieldPart = dbFieldNameParts[i];
        if(currentObj[dbFieldPart] == null) {
          currentObj[dbFieldPart] = {};
        }
        if(i < dbFieldNameParts.length - 1) {
          currentObj = currentObj[dbFieldPart];
        } else {
          currentObj[dbFieldPart] = orderEntry.dir;
        }
      }

      generatedOrder.push(sortObjToAdd);
    }
    return generatedOrder as Array<{ [p in keyof TWhereInput]?: FilterOrder }>;
  }
}
