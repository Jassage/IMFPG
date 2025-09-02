import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearCountOutputTypeSelectObjectSchema } from './AcademicYearCountOutputTypeSelect.schema'

export const AcademicYearCountOutputTypeArgsObjectSchema = z.object({
  select: z.lazy(() => AcademicYearCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const AcademicYearCountOutputTypeArgsObjectZodSchema = z.object({
  select: z.lazy(() => AcademicYearCountOutputTypeSelectObjectSchema).optional()
}).strict();
