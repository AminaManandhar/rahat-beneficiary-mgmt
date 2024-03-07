import { AxiosRequestConfig } from 'axios';
import { BeneficiaryGroup } from '../beneficiarygroup';
import { FormattedResponse } from '@rumsan/sdk/utils';

export type BeneficiaryGroupClient = {
  create: (
    data?: BeneficiaryGroup,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<BeneficiaryGroup>>;

  list: (
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<BeneficiaryGroup[]>>;

  listById: (
    id: string,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<BeneficiaryGroup>>;

  update: (
    {
      id,
      data,
    }: {
      id: string;
      data: BeneficiaryGroup;
    },
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<BeneficiaryGroup>>;

  remove: (
    id: string,
    config?: AxiosRequestConfig,
  ) => Promise<FormattedResponse<BeneficiaryGroup>>;
};