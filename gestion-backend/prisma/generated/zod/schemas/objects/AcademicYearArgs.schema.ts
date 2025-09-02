import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearSelectObjectSchema } from './AcademicYearSelect.schema';
import { AcademicYearIncludeObjectSchema } from './AcademicYearInclude.schema'

export const AcademicYearArgsObjectSchema = z.object({
  select: z.lazy(() => AcademicYearSelectObjectSchema).optional(),
  include: z.lazy(() => AcademicYearIncludeObjectSchema).optional()
}).strict();
export const AcademicYearArgsObjectZodSchema = z.object({
  select: z.lazy(() => AcademicYearSelectObjectSchema).optional(),
  include: z.lazy(() => AcademicYearIncludeObjectSchema).optional()
}).strict();
