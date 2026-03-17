import { ApiPropertyOptional } from '@nestjs/swagger';
import { DumpsterStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class FilterDumpstersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  serialNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({ enum: DumpsterStatus })
  @IsOptional()
  @IsEnum(DumpsterStatus)
  status?: DumpsterStatus;
}
