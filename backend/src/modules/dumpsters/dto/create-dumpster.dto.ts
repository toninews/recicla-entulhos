import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateDumpsterDto {
  @ApiProperty({ example: 'CAC-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9-]+$/, {
    message: 'O número de série deve conter apenas letras, números e hífen.',
  })
  serialNumber: string;

  @ApiProperty({ example: 'Azul' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  color: string;
}
