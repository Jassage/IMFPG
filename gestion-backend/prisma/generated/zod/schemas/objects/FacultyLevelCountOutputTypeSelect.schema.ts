import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const FacultyLevelCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.FacultyLevelCountOutputTypeSelect, z.ZodTypeDef, Prisma.FacultyLevelCountOutputTypeSelect> = z.object({
  assignments: z.boolean().optional()
}).strict();
export const FacultyLevelCountOutputTypeSelectObjectZodSchema = z.object({
  assignments: z.boolean().optional()
}).strict();
