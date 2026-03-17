import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateDumpsterDto {
  @ApiProperty({ example: 'CAC-001' })
  @IsString({ message: 'O número de série deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O número de série é obrigatório.' })
  @MaxLength(50, {
    message: 'O número de série deve ter no máximo 50 caracteres.',
  })
  @Matches(/^[A-Za-z0-9-]+$/, {
    message: 'O número de série deve conter apenas letras, números e hífen.',
  })
  serialNumber: string;

  @ApiProperty({ example: 'Azul' })
  @IsString({ message: 'A cor deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A cor é obrigatória.' })
  @MaxLength(50, { message: 'A cor deve ter no máximo 50 caracteres.' })
  color: string;
}
