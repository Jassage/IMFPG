import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const TranscriptUncheckedCreateWithoutGradesInputObjectSchema: z.ZodType<Prisma.TranscriptUncheckedCreateWithoutGradesInput, z.ZodTypeDef, Prisma.TranscriptUncheckedCreateWithoutGradesInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional()
}).strict();
export const TranscriptUncheckedCreateWithoutGradesInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional()
}).strict();
