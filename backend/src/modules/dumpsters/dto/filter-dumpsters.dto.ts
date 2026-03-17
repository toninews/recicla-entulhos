import { ApiPropertyOptional } from '@nestjs/swagger';
import { DumpsterStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class FilterDumpstersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'O filtro de número de série deve ser um texto válido.' })
  @MaxLength(50, {
    message: 'O filtro de número de série deve ter no máximo 50 caracteres.',
  })
  serialNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'O filtro de cor deve ser um texto válido.' })
  @MaxLength(50, {
    message: 'O filtro de cor deve ter no máximo 50 caracteres.',
  })
  color?: string;

  @ApiPropertyOptional({ enum: DumpsterStatus })
  @IsOptional()
  @IsEnum(DumpsterStatus, {
    message: 'O status informado para filtro é inválido.',
  })
  status?: DumpsterStatus;
}
