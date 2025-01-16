import { ZodType } from 'zod';

export function validate<T>(zodType: ZodType, data: T): T {
  return zodType.parse(data);
}
