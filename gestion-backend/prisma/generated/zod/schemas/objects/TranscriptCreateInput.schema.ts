import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutTranscriptsInputObjectSchema } from './StudentCreateNestedOneWithoutTranscriptsInput.schema';
import { GradeCreateNestedManyWithoutTranscriptInputObjectSchema } from './GradeCreateNestedManyWithoutTranscriptInput.schema'

export const TranscriptCreateInputObjectSchema: z.ZodType<Prisma.TranscriptCreateInput, z.ZodTypeDef, Prisma.TranscriptCreateInput> = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutTranscriptsInputObjectSchema),
  grades: z.lazy(() => GradeCreateNestedManyWithoutTranscriptInputObjectSchema).optional()
}).strict();
export const TranscriptCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional(),
  student: z.lazy(() => StudentCreateNestedOneWithoutTranscriptsInputObjectSchema),
  grades: z.lazy(() => GradeCreateNestedManyWithoutTranscriptInputObjectSchema).optional()
}).strict();
