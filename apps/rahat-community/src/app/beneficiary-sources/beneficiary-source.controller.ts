import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BeneficiarySourceService } from './beneficiary-source.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ACTIONS,
  AbilitiesGuard,
  CheckAbilities,
  JwtGuard,
  SUBJECTS,
} from '@rumsan/user';
import {
  CreateBeneficiarySourceDto,
  UpdateBeneficiarySourceDto,
} from '@rahataid/community-tool-extensions';

@Controller('beneficiarySource')
@ApiBearerAuth('JWT')
@ApiTags('BeneficiarySource')
export class BeneficiarySourceController {
  constructor(
    private readonly beneficiarySourceService: BeneficiarySourceService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ actions: ACTIONS.CREATE, subject: SUBJECTS.USER })
  @UseGuards(JwtGuard, AbilitiesGuard)
  create(@Body() dto: CreateBeneficiarySourceDto) {
    return this.beneficiarySourceService.create(dto);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @UseGuards(JwtGuard, AbilitiesGuard)
  findAll(query: any) {
    return this.beneficiarySourceService.listAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ actions: ACTIONS.READ, subject: SUBJECTS.USER })
  @UseGuards(JwtGuard, AbilitiesGuard)
  findOne(@Param('id') id: string) {
    return this.beneficiarySourceService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ actions: ACTIONS.MANAGE, subject: SUBJECTS.USER })
  @UseGuards(JwtGuard, AbilitiesGuard)
  update(@Param('id') id: number, @Body() dto: UpdateBeneficiarySourceDto) {
    return this.beneficiarySourceService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @CheckAbilities({ actions: ACTIONS.DELETE, subject: SUBJECTS.USER })
  @UseGuards(JwtGuard, AbilitiesGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.beneficiarySourceService.remove(id);
  }
}
