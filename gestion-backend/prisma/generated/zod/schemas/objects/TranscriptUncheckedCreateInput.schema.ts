import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeUncheckedCreateNestedManyWithoutTranscriptInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutTranscriptInput.schema'

export const TranscriptUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TranscriptUncheckedCreateInput, z.ZodTypeDef, Prisma.TranscriptUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutTranscriptInputObjectSchema).optional()
}).strict();
export const TranscriptUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutTranscriptInputObjectSchema).optional()
}).strict();
