import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsInt()
  @Min(1)
  limit?: number;
}
