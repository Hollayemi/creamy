export type BaseResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  code: number;
};

// export type User = {
//   id: string,
//   name: string,
//   fullname: string,
//   permission: [string],
//   email: string,
//   phoneNumber: string,
//   role: string,
//   avatar: string | null,
//   isPhoneVerified: boolean,
//   referralCode: string
// };

export type User = {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  roleName: string;
  status: string;
  permissions: string[];
  customPermissions: string[];
  joinedDate: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string | null;
};
