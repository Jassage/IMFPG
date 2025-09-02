import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateNestedManyWithoutTranscriptInputObjectSchema } from './GradeCreateNestedManyWithoutTranscriptInput.schema'

export const TranscriptCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.TranscriptCreateWithoutStudentInput, z.ZodTypeDef, Prisma.TranscriptCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutTranscriptInputObjectSchema).optional()
}).strict();
export const TranscriptCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  grades: z.lazy(() => GradeCreateNestedManyWithoutTranscriptInputObjectSchema).optional()
}).strict();
