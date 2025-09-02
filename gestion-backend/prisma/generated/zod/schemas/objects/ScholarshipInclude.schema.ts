import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearArgsObjectSchema } from './AcademicYearArgs.schema';
import { ScholarshipApplicationFindManySchema } from '../findManyScholarshipApplication.schema';
import { ScholarshipCountOutputTypeArgsObjectSchema } from './ScholarshipCountOutputTypeArgs.schema'

export const ScholarshipIncludeObjectSchema: z.ZodType<Prisma.ScholarshipInclude, z.ZodTypeDef, Prisma.ScholarshipInclude> = z.object({
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  applications: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScholarshipCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ScholarshipIncludeObjectZodSchema = z.object({
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  applications: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScholarshipCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
