import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentArgsObjectSchema } from './StudentArgs.schema';
import { GradeFindManySchema } from '../findManyGrade.schema';
import { TranscriptCountOutputTypeArgsObjectSchema } from './TranscriptCountOutputTypeArgs.schema'

export const TranscriptSelectObjectSchema: z.ZodType<Prisma.TranscriptSelect, z.ZodTypeDef, Prisma.TranscriptSelect> = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  semester: z.boolean().optional(),
  academicYear: z.boolean().optional(),
  gpa: z.boolean().optional(),
  totalCredits: z.boolean().optional(),
  creditsEarned: z.boolean().optional(),
  generatedDate: z.boolean().optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TranscriptCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TranscriptSelectObjectZodSchema = z.object({
  id: z.boolean().optional(),
  student: z.union([z.boolean(), z.lazy(() => StudentArgsObjectSchema)]).optional(),
  studentId: z.boolean().optional(),
  semester: z.boolean().optional(),
  academicYear: z.boolean().optional(),
  gpa: z.boolean().optional(),
  totalCredits: z.boolean().optional(),
  creditsEarned: z.boolean().optional(),
  generatedDate: z.boolean().optional(),
  grades: z.union([z.boolean(), z.lazy(() => GradeFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TranscriptCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
