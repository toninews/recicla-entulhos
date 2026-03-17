import { Module } from '@nestjs/common';
import { ViacepController } from './viacep.controller';
import { ViacepService } from './viacep.service';

@Module({
  controllers: [ViacepController],
  providers: [ViacepService],
})
export class ViacepModule {}
