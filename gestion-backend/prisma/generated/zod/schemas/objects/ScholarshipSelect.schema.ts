import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AcademicYearArgsObjectSchema } from './AcademicYearArgs.schema';
import { ScholarshipApplicationFindManySchema } from '../findManyScholarshipApplication.schema';
import { ScholarshipCountOutputTypeArgsObjectSchema } from './ScholarshipCountOutputTypeArgs.schema'

export const ScholarshipSelectObjectSchema: z.ZodType<Prisma.ScholarshipSelect, z.ZodTypeDef, Prisma.ScholarshipSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  amount: z.boolean().optional(),
  criteria: z.boolean().optional(),
  applicationDeadline: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  maxRecipients: z.boolean().optional(),
  currentRecipients: z.boolean().optional(),
  status: z.boolean().optional(),
  applications: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScholarshipCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ScholarshipSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  amount: z.boolean().optional(),
  criteria: z.boolean().optional(),
  applicationDeadline: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  maxRecipients: z.boolean().optional(),
  currentRecipients: z.boolean().optional(),
  status: z.boolean().optional(),
  applications: z.union([z.boolean(), z.lazy(() => ScholarshipApplicationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ScholarshipCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
