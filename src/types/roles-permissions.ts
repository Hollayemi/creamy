export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Array of permission IDs
  userCount: number;
  createdAt: string;
  updatedAt: string;
}
