import { UUID } from 'crypto';
import { Beneficiary } from '../beneficiary';
import { TargetQueryStatus } from '../enums';

export type TargetPost = {
  filterOptions?: any;
};

export type TargetList = {
  id: number;
  benefUuid?: UUID;
  targetUuid: UUID;
  createdAt: Date;
  updatedAt: Date;
};

export type TargetResults = {
  message: string;
};

export type Result = {
  id: number;
  benefUuid?: UUID;
  targetUuid: UUID;
  createdAt: Date;
  updatedAt: Date;
  beneficiary: Beneficiary;
};

export type TargetResult = {
  targetUuid: UUID;
  filterOption?: any;
};

export type PatchResult = {
  id?: number;
  uuid?: UUID;
  label?: string;
  filterOption: any;
  status: TargetQueryStatus;
  createdAt: Date;
  updatedAt: Date;
};
