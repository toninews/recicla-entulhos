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
  @IsString({ message: 'O nome do cliente deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O nome do cliente é obrigatório.' })
  @MaxLength(120, {
    message: 'O nome do cliente deve ter no máximo 120 caracteres.',
  })
  customerName: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsPhoneNumber('BR', {
    message: 'O telefone deve ser um número brasileiro válido.',
  })
  customerPhone: string;

  @ApiProperty({ example: '01310100' })
  @IsString({ message: 'O CEP deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  @Length(8, 8, { message: 'O CEP deve conter exatamente 8 caracteres.' })
  @Matches(/^\d{8}$/, {
    message: 'O CEP deve conter exatamente 8 dígitos numéricos.',
  })
  zipCode: string;

  @ApiProperty({ example: 'Avenida Paulista' })
  @IsString({ message: 'O logradouro deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O logradouro é obrigatório.' })
  @MaxLength(150, {
    message: 'O logradouro deve ter no máximo 150 caracteres.',
  })
  street: string;

  @ApiProperty({ example: '1000' })
  @IsString({ message: 'O número deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O número é obrigatório.' })
  @MaxLength(20, { message: 'O número deve ter no máximo 20 caracteres.' })
  number: string;

  @ApiProperty({ required: false, example: 'Apto 12' })
  @IsOptional()
  @IsString({ message: 'O complemento deve ser um texto válido.' })
  @MaxLength(100, {
    message: 'O complemento deve ter no máximo 100 caracteres.',
  })
  complement?: string;

  @ApiProperty({ example: 'Bela Vista' })
  @IsString({ message: 'O bairro deve ser um texto válido.' })
  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  @MaxLength(100, {
    message: 'O bairro deve ter no máximo 100 caracteres.',
  })
  district: string;

  @ApiProperty({ example: 'Sao Paulo' })
  @IsString({ message: 'A cidade deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  @MaxLength(100, {
    message: 'A cidade deve ter no máximo 100 caracteres.',
  })
  city: string;

  @ApiProperty({ example: 'SP' })
  @IsString({ message: 'A UF deve ser um texto válido.' })
  @IsNotEmpty({ message: 'A UF é obrigatória.' })
  @MaxLength(2, { message: 'A UF deve conter no máximo 2 caracteres.' })
  @Matches(/^[A-Za-z]{2}$/, {
    message: 'A UF deve conter exatamente 2 letras.',
  })
  state: string;

  @ApiProperty({ required: false, example: 'Próximo à padaria' })
  @IsOptional()
  @IsString({ message: 'A referência deve ser um texto válido.' })
  @MaxLength(150, {
    message: 'A referência deve ter no máximo 150 caracteres.',
  })
  reference?: string;

  @ApiProperty({ required: false, example: '2026-03-24T00:00:00.000Z' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}T/, {
    message: 'A previsão de término deve estar em formato de data válido.',
  })
  endDate?: Date;

  @ApiProperty({ required: false, example: 'Cliente precisa da entrega pela manhã' })
  @IsOptional()
  @IsString({ message: 'As observações devem ser um texto válido.' })
  @MaxLength(300, {
    message: 'As observações devem ter no máximo 300 caracteres.',
  })
  notes?: string;

  @ApiProperty({ example: '5d6ce0ef-26eb-4e65-8d14-a196e6f16d2a' })
  @IsUUID('4', { message: 'A caçamba selecionada é inválida.' })
  dumpsterId: string;
}
