import { Module } from '@nestjs/common';
import { DumpstersModule } from './modules/dumpsters/dumpsters.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { ViacepModule } from './modules/viacep/viacep.module';

@Module({
  imports: [PrismaModule, DumpstersModule, RentalsModule, ViacepModule],
})
export class AppModule {}
