import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { UEArgsObjectSchema } from './UEArgs.schema';
import { AcademicYearArgsObjectSchema } from './AcademicYearArgs.schema';
import { TranscriptArgsObjectSchema } from './TranscriptArgs.schema';
import { ProfesseurArgsObjectSchema } from './ProfesseurArgs.schema'

export const GradeIncludeObjectSchema: z.ZodType<Prisma.GradeInclude, z.ZodTypeDef, Prisma.GradeInclude> = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  transcript: z.union([z.boolean(), z.lazy(() => TranscriptArgsObjectSchema)]).optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional()
}).strict();
export const GradeIncludeObjectZodSchema = z.object({
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  transcript: z.union([z.boolean(), z.lazy(() => TranscriptArgsObjectSchema)]).optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional()
}).strict();
