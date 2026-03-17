import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDumpsterDto } from './dto/create-dumpster.dto';
import { FilterDumpstersDto } from './dto/filter-dumpsters.dto';
import { UpdateDumpsterDto } from './dto/update-dumpster.dto';
import { DumpstersService } from './dumpsters.service';

@ApiTags('Dumpsters')
@Controller('dumpsters')
export class DumpstersController {
  constructor(private readonly dumpstersService: DumpstersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova caçamba' })
  create(@Body() createDumpsterDto: CreateDumpsterDto) {
    return this.dumpstersService.create(createDumpsterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar caçambas com filtros opcionais' })
  findAll(@Query() filters: FilterDumpstersDto) {
    return this.dumpstersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma caçamba por id' })
  findOne(@Param('id') id: string) {
    return this.dumpstersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma caçamba' })
  update(@Param('id') id: string, @Body() updateDumpsterDto: UpdateDumpsterDto) {
    return this.dumpstersService.update(id, updateDumpsterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma caçamba' })
  remove(@Param('id') id: string) {
    return this.dumpstersService.remove(id);
  }
}
