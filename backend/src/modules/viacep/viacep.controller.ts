import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ViacepService } from './viacep.service';

@ApiTags('ViaCEP')
@Controller('viacep')
export class ViacepController {
  constructor(private readonly viacepService: ViacepService) {}

  @Get(':zipCode')
  @ApiOperation({ summary: 'Consultar endereço pelo CEP' })
  findAddress(@Param('zipCode') zipCode: string) {
    return this.viacepService.findAddress(zipCode);
  }
}
