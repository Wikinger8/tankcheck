import { IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { FuelType, SortOption } from '@tankcheck/shared';

export class SearchStationsDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(90)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  lng: number;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(25)
  rad: number;

  @IsEnum(FuelType)
  type: FuelType;

  @IsOptional()
  @IsEnum(SortOption)
  sort: SortOption = SortOption.DISTANCE;
}
