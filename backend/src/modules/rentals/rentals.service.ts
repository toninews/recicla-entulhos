import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RentalStatus } from '@prisma/client';
import { DumpstersService } from '../dumpsters/dumpsters.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { FilterRentalsDto } from './dto/filter-rentals.dto';

@Injectable()
export class RentalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dumpstersService: DumpstersService,
  ) {}

  async create(createRentalDto: CreateRentalDto) {
    await this.dumpstersService.ensureAvailable(createRentalDto.dumpsterId);

    return this.prisma.$transaction(async (tx) => {
      const rental = await tx.rental.create({
        data: {
          ...createRentalDto,
          startDate: new Date(),
          zipCode: this.normalizeZipCode(createRentalDto.zipCode),
          state: createRentalDto.state.toUpperCase(),
        },
        include: {
          dumpster: true,
        },
      });

      await tx.dumpster.update({
        where: { id: createRentalDto.dumpsterId },
        data: { status: 'RENTED' },
      });

      return rental;
    });
  }

  findAll(filters: FilterRentalsDto) {
    const where: Prisma.RentalWhereInput = {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.dumpsterId ? { dumpsterId: filters.dumpsterId } : {}),
      ...(filters.customerName
        ? {
            customerName: {
              contains: filters.customerName,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    return this.prisma.rental.findMany({
      where,
      include: {
        dumpster: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  history(filters?: FilterRentalsDto) {
    const where: Prisma.RentalWhereInput = {
      ...(filters?.dumpsterId ? { dumpsterId: filters.dumpsterId } : {}),
      ...(filters?.customerName
        ? {
            customerName: {
              contains: filters.customerName,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    return this.prisma.rental.findMany({
      where,
      include: {
        dumpster: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async finish(id: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
    });

    if (!rental) {
      throw new NotFoundException('Aluguel não encontrado.');
    }

    if (rental.status === RentalStatus.FINISHED) {
      throw new BadRequestException('Este aluguel já foi encerrado.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedRental = await tx.rental.update({
        where: { id },
        data: {
          status: RentalStatus.FINISHED,
          finishedAt: new Date(),
        },
        include: {
          dumpster: true,
        },
      });

      await tx.dumpster.update({
        where: { id: rental.dumpsterId },
        data: {
          status: 'AVAILABLE',
        },
      });

      return updatedRental;
    });
  }

  private normalizeZipCode(zipCode: string) {
    return zipCode.replace(/\D/g, '');
  }
}
