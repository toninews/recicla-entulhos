import { Module } from '@nestjs/common';
import { DumpstersModule } from '../dumpsters/dumpsters.module';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';

@Module({
  imports: [DumpstersModule],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
