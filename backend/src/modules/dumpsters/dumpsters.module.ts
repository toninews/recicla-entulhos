import { Module } from '@nestjs/common';
import { DumpstersController } from './dumpsters.controller';
import { DumpstersService } from './dumpsters.service';

@Module({
  controllers: [DumpstersController],
  providers: [DumpstersService],
  exports: [DumpstersService],
})
export class DumpstersModule {}
