export type BaseResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  code: number;
};

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: string | null;
  email_verified_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};
