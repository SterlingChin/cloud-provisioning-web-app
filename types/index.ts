export interface Server {
  id: string;
  name: string;
  status: string;
  ipAddress: string;
}

export interface Database {
  id: string;
  name: string;
  engine: string;
  version: string;
}

export interface NetworkingResource {
  id: string;
  name: string;
  cidrBlock: string;
}

export interface StorageBucket {
  name: string;
  region: string;
  objects?: string[];
}

export type ResourceType = 'server' | 'database' | 'storage' | 'networking';
