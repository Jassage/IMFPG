import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { UEArgsObjectSchema } from './UEArgs.schema';
import { AcademicYearArgsObjectSchema } from './AcademicYearArgs.schema';
import { TranscriptArgsObjectSchema } from './TranscriptArgs.schema';
import { ProfesseurArgsObjectSchema } from './ProfesseurArgs.schema'

export const GradeSelectObjectSchema: z.ZodType<Prisma.GradeSelect, z.ZodTypeDef, Prisma.GradeSelect> = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  ueId: z.boolean().optional(),
  grade: z.boolean().optional(),
  status: z.boolean().optional(),
  session: z.boolean().optional(),
  semester: z.boolean().optional(),
  level: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  createdAt: z.boolean().optional(),
  transcript: z.union([z.boolean(), z.lazy(() => TranscriptArgsObjectSchema)]).optional(),
  transcriptId: z.boolean().optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  professeurId: z.boolean().optional()
}).strict();
export const GradeSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  ue: z.union([z.boolean(), z.lazy(() => UEArgsObjectSchema)]).optional(),
  ueId: z.boolean().optional(),
  grade: z.boolean().optional(),
  status: z.boolean().optional(),
  session: z.boolean().optional(),
  semester: z.boolean().optional(),
  level: z.boolean().optional(),
  academicYearId: z.boolean().optional(),
  academicYear: z.union([z.boolean(), z.lazy(() => AcademicYearArgsObjectSchema)]).optional(),
  createdAt: z.boolean().optional(),
  transcript: z.union([z.boolean(), z.lazy(() => TranscriptArgsObjectSchema)]).optional(),
  transcriptId: z.boolean().optional(),
  professeur: z.union([z.boolean(), z.lazy(() => ProfesseurArgsObjectSchema)]).optional(),
  professeurId: z.boolean().optional()
}).strict();
