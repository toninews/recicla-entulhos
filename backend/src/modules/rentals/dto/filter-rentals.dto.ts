import { ApiPropertyOptional } from '@nestjs/swagger';
import { RentalStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class FilterRentalsDto {
  @ApiPropertyOptional({ enum: RentalStatus })
  @IsOptional()
  @IsEnum(RentalStatus)
  status?: RentalStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  dumpsterId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  customerName?: string;
}
