import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { GroupClient } from '../types';
import {
  GroupInput,
  GroupResponseById,
  GroupResponse,
  ListGroup,
} from '../groups';
import { formatResponse } from '@rumsan/sdk/utils';
import { Pagination } from '@rumsan/sdk/types';

export const getGroupClient = (client: AxiosInstance): GroupClient => {
  return {
    create: async (data?: GroupInput, config?: AxiosRequestConfig) => {
      const response = await client.post('/group', data, config);
      return formatResponse<GroupResponse>(response);
    },

    list: async (data?: Pagination, config?: AxiosRequestConfig) => {
      const response = await client.get('/group', { params: data, ...config });
      return formatResponse<ListGroup[]>(response);
    },

    listById: async (uuid: string, config?: AxiosRequestConfig) => {
      const response = await client.get(`/group/${uuid}`, config);
      return formatResponse<GroupResponseById>(response);
    },

    update: async (
      { uuid, data }: { uuid?: string; data?: GroupInput },
      config?: AxiosRequestConfig,
    ) => {
      const response = await client.put(`/group/${uuid}`, data, config);
      return formatResponse<GroupResponse>(response);
    },

    remove: async (uuid: string, config?: AxiosRequestConfig) => {
      const response = await client.delete(`/group/${uuid}`, config);
      return formatResponse<GroupResponse>(response);
    },

    download: async ({
      groupedBeneficiaries,
      // responseType,
      config,
    }: {
      groupedBeneficiaries: any[];
      // responseType: string;
      config?: AxiosRequestConfig;
    }) => {
      const response = await client.post(
        `/group/download`,
        groupedBeneficiaries,
        {
          ...config,
          responseType:
            config?.responseType === 'arraybuffer' ? 'arraybuffer' : 'blob',
        },
      );
      return response;
    },
  };
};
