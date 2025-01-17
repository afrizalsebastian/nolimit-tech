import { z, ZodType } from 'zod';

export class PostValidation {
  static readonly CREATE: ZodType = z.object({
    userId: z.number().min(1),
    content: z.string().min(1),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().min(1),
    userId: z.number().min(1),
    content: z.string().min(1),
  });
}
