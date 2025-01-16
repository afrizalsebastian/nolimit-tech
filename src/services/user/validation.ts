import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    name: z.string().min(1).max(250),
    email: z.string().min(1).max(250),
    password: z.string().min(1),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(250),
    password: z.string().min(1),
  });
}
