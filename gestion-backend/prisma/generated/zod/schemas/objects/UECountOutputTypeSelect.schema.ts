import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const UECountOutputTypeSelectObjectSchema: z.ZodType<Prisma.UECountOutputTypeSelect, z.ZodTypeDef, Prisma.UECountOutputTypeSelect> = z.object({
  prerequisites: z.boolean().optional(),
  requiredFor: z.boolean().optional(),
  assignments: z.boolean().optional(),
  grades: z.boolean().optional(),
  retakes: z.boolean().optional()
}).strict();
export const UECountOutputTypeSelectObjectZodSchema = z.object({
  prerequisites: z.boolean().optional(),
  requiredFor: z.boolean().optional(),
  assignments: z.boolean().optional(),
  grades: z.boolean().optional(),
  retakes: z.boolean().optional()
}).strict();
