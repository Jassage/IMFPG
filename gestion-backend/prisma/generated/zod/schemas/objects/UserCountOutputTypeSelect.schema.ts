import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UserCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect, z.ZodTypeDef, Prisma.UserCountOutputTypeSelect> = z.object({
  createdUEs: z.boolean().optional()
}).strict();
export const UserCountOutputTypeSelectObjectZodSchema = z.object({
  createdUEs: z.boolean().optional()
}).strict();
