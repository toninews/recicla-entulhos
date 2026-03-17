import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DumpsterStatus, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDumpsterDto } from './dto/create-dumpster.dto';
import { FilterDumpstersDto } from './dto/filter-dumpsters.dto';
import { UpdateDumpsterDto } from './dto/update-dumpster.dto';

@Injectable()
export class DumpstersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDumpsterDto: CreateDumpsterDto) {
    try {
      return await this.prisma.dumpster.create({
        data: {
          serialNumber: createDumpsterDto.serialNumber.trim(),
          color: createDumpsterDto.color.trim(),
          status: DumpsterStatus.AVAILABLE,
        },
      });
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }

  findAll(filters: FilterDumpstersDto) {
    const where: Prisma.DumpsterWhereInput = {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.serialNumber
        ? {
            serialNumber: {
              contains: filters.serialNumber,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(filters.color
        ? {
            color: {
              contains: filters.color,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    return this.prisma.dumpster.findMany({
      where,
      include: {
        rentals: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            customerName: true,
            startDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const dumpster = await this.prisma.dumpster.findUnique({
      where: { id },
      include: {
        rentals: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!dumpster) {
      throw new NotFoundException('Caçamba não encontrada.');
    }

    return dumpster;
  }

  async update(id: string, updateDumpsterDto: UpdateDumpsterDto) {
    const dumpster = await this.ensureExists(id);

    if (dumpster.status === DumpsterStatus.RENTED) {
      throw new BadRequestException(
        'Não é possível editar uma caçamba que está alugada.',
      );
    }

    try {
      return await this.prisma.dumpster.update({
        where: { id },
        data: {
          serialNumber: updateDumpsterDto.serialNumber?.trim(),
          color: updateDumpsterDto.color?.trim(),
        },
      });
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }

  async remove(id: string) {
    const dumpster = await this.ensureExists(id);

    if (dumpster.status === DumpsterStatus.RENTED) {
      throw new BadRequestException(
        'Não é possível excluir uma caçamba que está alugada.',
      );
    }

    const relatedRental = await this.prisma.rental.findFirst({
      where: {
        dumpsterId: id,
      },
    });

    if (relatedRental) {
      throw new BadRequestException(
        'Não é possível excluir uma caçamba que possui histórico de aluguel.',
      );
    }

    return this.prisma.dumpster.delete({
      where: { id },
    });
  }

  async ensureAvailable(id: string) {
    const dumpster = await this.ensureExists(id);

    if (dumpster.status !== DumpsterStatus.AVAILABLE) {
      throw new BadRequestException('A caçamba selecionada não está disponível.');
    }

    return dumpster;
  }

  private async ensureExists(id: string) {
    const dumpster = await this.prisma.dumpster.findUnique({
      where: { id },
    });

    if (!dumpster) {
      throw new NotFoundException('Caçamba não encontrada.');
    }

    return dumpster;
  }

  private handlePersistenceError(error: unknown): never {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new BadRequestException(
        'Já existe uma caçamba cadastrada com esse número de série.',
      );
    }

    throw error;
  }
}
