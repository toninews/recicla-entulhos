import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateRentalDto {
  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  customerName: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsPhoneNumber('BR')
  customerPhone: string;

  @ApiProperty({ example: '01310100' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 8)
  @Matches(/^\d{8}$/, {
    message: 'O CEP deve conter exatamente 8 dígitos numéricos.',
  })
  zipCode: string;

  @ApiProperty({ example: 'Avenida Paulista' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  street: string;

  @ApiProperty({ example: '1000' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  number: string;

  @ApiProperty({ required: false, example: 'Apto 12' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  complement?: string;

  @ApiProperty({ example: 'Bela Vista' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  district: string;

  @ApiProperty({ example: 'Sao Paulo' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  @Matches(/^[A-Za-z]{2}$/, {
    message: 'A UF deve conter exatamente 2 letras.',
  })
  state: string;

  @ApiProperty({ required: false, example: 'Próximo à padaria' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  reference?: string;

  @ApiProperty({ required: false, example: '2026-03-24T00:00:00.000Z' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T/, {
    message: 'A previsão de término deve estar em formato de data válido.',
  })
  endDate?: Date;

  @ApiProperty({ required: false, example: 'Cliente precisa da entrega pela manhã' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;

  @ApiProperty({ example: '5d6ce0ef-26eb-4e65-8d14-a196e6f16d2a' })
  @IsUUID()
  dumpsterId: string;
}
