export interface Account {
  $type: string;
  $value: string;
}

export interface Properties {
  Account: Account;
}

export interface AuthenticatedUser {
  id: string;
  descriptor: string;
  subjectDescriptor: string;
  providerDisplayName: string;
  isActive: boolean;
  properties: Properties;
  resourceVersion: number;
  metaTypeId: number;
}

export interface Account2 {
  $type: string;
  $value: string;
}

export interface Properties2 {
  Account: Account2;
}

export interface AuthorizedUser {
  id: string;
  descriptor: string;
  subjectDescriptor: string;
  providerDisplayName: string;
  isActive: boolean;
  properties: Properties2;
  resourceVersion: number;
  metaTypeId: number;
}

export interface LocationServiceData {
  serviceOwner: string;
  defaultAccessMappingMoniker: string;
  lastChangeId: number;
  lastChangeId64: number;
}

export interface AuthoricatedUserContext {
  authenticatedUser: AuthenticatedUser;
  authorizedUser: AuthorizedUser;
  instanceId: string;
  deploymentId: string;
  deploymentType: string;
  locationServiceData: LocationServiceData;
}

export interface DevOpsAccount {
  AccountId: string;
  NamespaceId: string;
  AccountName: string;
  OrganizationName?: string;
  AccountType: number;
  AccountOwner: string;
  CreatedBy: string;
  CreatedDate: Date;
  AccountStatus: number;
  StatusReason?: string;
  LastUpdatedBy: string;
  Properties: any;
}
