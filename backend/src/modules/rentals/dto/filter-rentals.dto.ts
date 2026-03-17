import { ApiPropertyOptional } from '@nestjs/swagger';
import { RentalStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class FilterRentalsDto {
  @ApiPropertyOptional({ enum: RentalStatus })
  @IsOptional()
  @IsEnum(RentalStatus, {
    message: 'O status informado para filtro é inválido.',
  })
  status?: RentalStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { message: 'A caçamba informada para filtro é inválida.' })
  dumpsterId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ message: 'O filtro de cliente deve ser um texto válido.' })
  @MaxLength(120, {
    message: 'O filtro de cliente deve ter no máximo 120 caracteres.',
  })
  customerName?: string;
}
