import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipApplicationCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCountOutputTypeSelect, z.ZodTypeDef, Prisma.ScholarshipApplicationCountOutputTypeSelect> = z.object({
  documents: z.boolean().optional()
}).strict();
export const ScholarshipApplicationCountOutputTypeSelectObjectZodSchema = z.object({
  documents: z.boolean().optional()
}).strict();
