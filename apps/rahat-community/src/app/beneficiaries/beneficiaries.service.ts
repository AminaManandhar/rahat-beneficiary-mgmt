import { Injectable } from '@nestjs/common';
import { uuid } from 'uuidv4';

import {
  BulkInsertDto,
  CreateBeneficiaryDto,
  UpdateBeneficiaryDto,
} from '@rahataid/community-tool-extensions';
import { PrismaService } from '@rumsan/prisma';
import XLSX from 'xlsx';
import { FieldDefinitionsService } from '../field-definitions/field-definitions.service';
import { validateAllowedFieldAndTypes } from '../field-definitions/helpers';
import { deleteFileFromDisk } from '../utils/multer';
import { paginate } from '../utils/paginate';
import { createSearchQuery } from './helpers';
import { DB_MODELS } from '../../constants';
import { fetchSchemaFields } from '../beneficiary-import/helpers';
import { convertDateToISO } from '../utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BeneficiaryEvents } from '@rahataid/community-tool-sdk';

@Injectable()
export class BeneficiariesService {
  constructor(
    private prisma: PrismaService,
    private fieldDefService: FieldDefinitionsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async fetchDBFields() {
    const dbFields = fetchSchemaFields(DB_MODELS.TBL_BENEFICIARY);
    if (!dbFields.length) return [];
    const scalarFields = dbFields.filter((f) => f.kind === 'scalar');
    const extraFields = dbFields.filter((f) => f.type.toLowerCase() === 'json');
    return { scalarFields, extraFields };
  }

  async upsertByCustomID(payload: any) {
    if (payload.birthDate) {
      payload.birthDate = convertDateToISO(payload.birthDate);
    }
    return this.prisma.beneficiary.upsert({
      where: { customId: payload.customId.toString() },
      update: payload,
      create: payload,
    });
  }

  async create(dto: CreateBeneficiaryDto) {
    const { birthDate, extras } = dto;
    if (birthDate) dto.birthDate = convertDateToISO(birthDate);

    if (extras) {
      const fields = await this.fieldDefService.listActive();
      if (!fields.length) throw new Error('Please setup allowed fields first!');
      const nonMatching = validateAllowedFieldAndTypes(extras, fields);
      if (nonMatching.length)
        throw new Error(
          `[${nonMatching.toString()}] field/type are not allowed inside extras!`,
        );
    }

    const createdData = await this.prisma.beneficiary.create({
      data: {
        customId: uuid(),
        ...dto,
      },
    });
    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_CREATED);
    return createdData;
  }

  async searchTargets(filters: any) {
    const search_conditions = createSearchQuery(filters);
    return paginate(
      this.prisma.beneficiary,
      { where: search_conditions },
      {
        page: +filters?.page,
        perPage: +filters?.perPage || 500,
      },
    );
  }

  async findAll(filters: any) {
    const OR_CONDITIONS = [];
    let conditions = {};

    const fields = await this.fieldDefService.listActive();
    const fieldNames = fields.map((f) => f.name);

    const keys = Object.keys(filters);
    const values = Object.values(filters);
    for (let i = 0; i < keys.length; i++) {
      const searchField = keys[i].toLocaleLowerCase();
      const found = fieldNames.includes(searchField);
      if (found) {
        const fieldName = keys[i];
        OR_CONDITIONS.push({
          extras: {
            path: [fieldName],
            string_contains: values[i],
          },
        });
      }
    }

    if (OR_CONDITIONS.length) conditions = { OR: OR_CONDITIONS };

    if (filters.firstName) {
      OR_CONDITIONS.push({
        firstName: { contains: filters.firstName, mode: 'insensitive' },
      });
      conditions = { OR: OR_CONDITIONS };
    }

    if (filters.lastName) {
      OR_CONDITIONS.push({
        lastName: { contains: filters.lastName, mode: 'insensitive' },
      });
      conditions = { OR: OR_CONDITIONS };
    }

    return paginate(
      this.prisma.beneficiary,
      { where: conditions },
      {
        page: +filters?.page,
        perPage: +filters?.perPage,
      },
    );
  }

  async findOne(uuid: string) {
    const findUuid = await this.prisma.beneficiary.findUnique({
      where: {
        uuid,
      },
    });

    if (!findUuid) throw new Error('Data not Found');
    return await this.prisma.beneficiary.findUnique({
      where: {
        uuid,
      },
    });
  }

  async update(uuid: string, dto: UpdateBeneficiaryDto) {
    const findUuid = await this.prisma.beneficiary.findUnique({
      where: {
        uuid,
      },
    });

    if (!findUuid) throw new Error('Not Found');
    const { birthDate, extras } = dto;
    if (birthDate) {
      const formattedDate = new Date(dto.birthDate).toISOString();
      dto.birthDate = formattedDate;
    }
    if (extras) {
      const fields = await this.fieldDefService.listActive();
      if (!fields.length) throw new Error('Please setup allowed fields first!');
      const nonMatching = validateAllowedFieldAndTypes(extras, fields);
      if (nonMatching.length)
        throw new Error(
          `[${nonMatching.toString()}] field/type are not allowed inside extras!`,
        );
    }

    const beneficiaryData = await this.prisma.beneficiary.update({
      where: {
        uuid,
      },
      data: dto,
    });

    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_UPDATED);

    return beneficiaryData;
  }

  async remove(uuid: string) {
    const findUuid = await this.prisma.beneficiary.findUnique({
      where: {
        uuid,
      },
    });

    if (!findUuid) throw new Error('Not Found');
    const rData = await this.prisma.beneficiary.delete({
      where: {
        uuid,
      },
    });
    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_REMOVED);

    return rData;
  }

  addBulk(dto: BulkInsertDto) {
    const withCustomID = dto.data.map((d: any) => {
      return { ...d, customId: uuid() };
    });
    const rdata = this.prisma.beneficiary.createMany({ data: withCustomID });
    this.eventEmitter.emit(BeneficiaryEvents.BENEFICIARY_CREATED);
    return rdata;
  }

  async uploadFile(file: any) {
    const workbook = XLSX.readFile(file.path);
    await deleteFileFromDisk(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const sheetId = workbook.SheetNames[0].toLowerCase().replace(/\s/g, '_');
    const data = {
      workbookData: XLSX.utils.sheet_to_json(sheet),
      sheetId,
    };

    return data;
  }
}
