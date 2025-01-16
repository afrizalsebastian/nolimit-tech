import { z, ZodType } from 'zod';

export class PostValidation {
  static readonly CREATE: ZodType = z.object({
    userId: z.number().min(1),
    content: z.string().min(1),
  });

  static readonly LOGIN: ZodType = z.object({
    email: z.string().min(1).max(250),
    password: z.string().min(1),
  });
}
