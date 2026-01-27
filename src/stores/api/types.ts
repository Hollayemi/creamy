export type BaseResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  code: number;
};

export type User = {
  id: string,
  name: string,
  email: string,
  phoneNumber: string,
  role: string,
  avatar: string | null,
  isPhoneVerified: boolean,
  referralCode: string
};
