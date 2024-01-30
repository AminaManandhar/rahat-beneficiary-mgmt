import { Module } from '@nestjs/common';
import { BeneficiaryImportService } from './beneficiary-import.service';
import { BeneficiaryImportController } from './beneficiary-import.controller';
import { PrismaService } from '@rahat/prisma';
import { SourceService } from '../source/source.service';
import { BeneficiariesService } from '../beneficiaries/beneficiaries.service';
import { FieldDefinitionsService } from '../field-definitions/field-definitions.service';
import { BeneficiarySourceService } from '../beneficiary-source/beneficiary-source.service';

@Module({
  controllers: [BeneficiaryImportController],
  providers: [
    FieldDefinitionsService,
    BeneficiaryImportService,
    BeneficiariesService,
    BeneficiarySourceService,
    PrismaService,
    SourceService,
  ],
})
export class BeneficiaryImportModule {}