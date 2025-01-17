import { Injectable } from '@nestjs/common';

import { PrismaService } from '@rumsan/prisma';
import { paginate } from '../utils/paginate';
import {
  CreateFieldDefinitionDto,
  UpdateFieldDefinitionDto,
  updateFieldStatusDto,
} from '@rahataid/community-tool-extensions';
import { convertToValidString } from '../utils';

@Injectable()
export class FieldDefinitionsService {
  constructor(private prisma: PrismaService) {}
  create(dto: CreateFieldDefinitionDto) {
    const payload = {
      ...dto,
      name: convertToValidString(dto.name),
      fieldPopulate:
        dto?.fieldPopulate?.data?.length > 0
          ? {
              data: dto.fieldPopulate.data.map((item) => ({
                key: convertToValidString(item.key),
                value: convertToValidString(item.value),
              })),
            }
          : [],
    };

    return this.prisma.fieldDefinition.create({
      data: payload,
    });
  }

  listActive() {
    return this.prisma.fieldDefinition.findMany({
      where: { isActive: true },
    });
  }

  findAll(query) {
    const select = {
      id: true,
      name: true,
      fieldType: true,
      isActive: true,
      isTargeting: true,
    };

    const isTargeting =
      query.isTargeting === 'true'
        ? true
        : query.isTargeting === 'false'
        ? false
        : undefined;

    return paginate(
      this.prisma.fieldDefinition,
      { select, where: { isTargeting: isTargeting } },
      {
        page: query?.page,
        perPage: query?.perPage,
      },
    );
  }

  async findOne(id: number) {
    const data = await this.prisma.fieldDefinition.findUnique({
      where: { id },
    });
    if (!data) return { status: 404, message: 'Data not found!' };
    return data;
  }

  update(id: number, dto: UpdateFieldDefinitionDto) {
    const payload = {
      ...dto,
      name: convertToValidString(dto.name),
      fieldPopulate:
        dto?.fieldPopulate?.data?.length > 0
          ? {
              data: dto.fieldPopulate.data.map((item) => ({
                key: convertToValidString(item.key),
                value: convertToValidString(item.value),
              })),
            }
          : [],
    };
    return this.prisma.fieldDefinition.update({
      where: { id },
      data: payload,
    });
  }

  updateStatus(id: number, dto: updateFieldStatusDto) {
    return this.prisma.fieldDefinition.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} fieldDefinition`;
  }
}
