import { Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  FilterOperationType,
  FilterOrder,
  IFilter,
  ISingleFilter,
  ISingleOrder,
} from '.';

// The fields are also validated in filter.parser.ts to make sure that only correct fields are used to filter
export class SingleFilter<T> implements ISingleFilter<T> {
  constructor(partial: Partial<SingleFilter<T>>) {
    Object.assign(this, partial);
  }
  @Expose()
  @IsString()
  field!: keyof T & string;

  @Expose()
  @IsEnum(FilterOperationType)
  type!: FilterOperationType;

  @Expose()
  @IsDefined()
  value: any;
}

export class SingleFilterOrder<T> implements ISingleOrder<T> {
  constructor(partial: Partial<SingleFilterOrder<T>>) {
    Object.assign(this, partial);
  }
  @Expose()
  @IsString()
  field!: keyof T & string;

  @Expose()
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
  sort?: Array<SingleFilterOrder<T>>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleFilterOrder)
  @IsOptional()
  order?: Array<SingleFilterOrder<T>>;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  offset?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number;

  @IsString()
  @IsOptional()
  cursor?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  skip?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => String(value).split(','))
  select?: string[];
}
