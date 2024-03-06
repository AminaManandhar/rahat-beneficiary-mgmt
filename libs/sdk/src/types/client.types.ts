import { Pagination } from '@rumsan/sdk/types';
import { FormattedResponse } from '@rumsan/sdk/utils';
import { AxiosRequestConfig } from 'axios';
import { UUID } from 'crypto';
import {
  Beneficiary,
  ImportBeneficiary,
} from '../beneficiary/beneficiary.types';
import { FileResponse, Stats } from './response.types';
import { TFile } from './file.types';

export type BeneficiaryClient = {
  create: (
    data: Beneficiary,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<Beneficiary>>;

  createBulk: (
    data: Beneficiary[],
    config?: AxiosRequestConfig,
  ) => Promise<any>;

  list: (
    data?: Pagination,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<Beneficiary[]>>;

  listById: (
    uuid: string,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<Beneficiary>>;

  upload: (
    file: TFile,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<FileResponse>>;

  update: (
    { uuid, data }: { uuid: UUID; data: Beneficiary },
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<Beneficiary>>;

  remove: (
    uuid: UUID,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<Beneficiary>>;

  import_beneficiary: (
    source_uuid: UUID,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<ImportBeneficiary>>;
};
