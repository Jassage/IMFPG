import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeUncheckedCreateNestedManyWithoutTranscriptInputObjectSchema } from './GradeUncheckedCreateNestedManyWithoutTranscriptInput.schema'

export const TranscriptUncheckedCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.TranscriptUncheckedCreateWithoutStudentInput, z.ZodTypeDef, Prisma.TranscriptUncheckedCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutTranscriptInputObjectSchema).optional()
}).strict();
export const TranscriptUncheckedCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  grades: z.lazy(() => GradeUncheckedCreateNestedManyWithoutTranscriptInputObjectSchema).optional()
}).strict();
