import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ScholarshipCountOutputTypeSelect, z.ZodTypeDef, Prisma.ScholarshipCountOutputTypeSelect> = z.object({
  applications: z.boolean().optional()
}).strict();
export const ScholarshipCountOutputTypeSelectObjectZodSchema = z.object({
  applications: z.boolean().optional()
}).strict();
