import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRentalDto } from './dto/create-rental.dto';
import { FilterRentalsDto } from './dto/filter-rentals.dto';
import { RentalsService } from './rentals.service';

@ApiTags('Rentals')
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um aluguel e reservar uma caçamba' })
  create(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalsService.create(createRentalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar aluguéis com filtros opcionais' })
  findAll(@Query() filters: FilterRentalsDto) {
    return this.rentalsService.findAll(filters);
  }

  @Get('history')
  @ApiOperation({ summary: 'Listar histórico completo de aluguéis' })
  history(@Query() filters: FilterRentalsDto) {
    return this.rentalsService.history(filters);
  }

  @Patch(':id/finish')
  @ApiOperation({ summary: 'Encerrar um aluguel e liberar a caçamba' })
  finish(@Param('id') id: string) {
    return this.rentalsService.finish(id);
  }
}
