import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutTranscriptsInputObjectSchema } from './StudentCreateNestedOneWithoutTranscriptsInput.schema'

export const TranscriptCreateWithoutGradesInputObjectSchema: z.ZodType<Prisma.TranscriptCreateWithoutGradesInput, z.ZodTypeDef, Prisma.TranscriptCreateWithoutGradesInput> = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutTranscriptsInputObjectSchema)
}).strict();
export const TranscriptCreateWithoutGradesInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutTranscriptsInputObjectSchema)
}).strict();
