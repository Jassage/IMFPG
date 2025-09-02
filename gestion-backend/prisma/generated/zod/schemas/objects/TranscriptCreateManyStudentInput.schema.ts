import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const TranscriptCreateManyStudentInputObjectSchema: z.ZodType<Prisma.TranscriptCreateManyStudentInput, z.ZodTypeDef, Prisma.TranscriptCreateManyStudentInput> = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional()
}).strict();
export const TranscriptCreateManyStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional()
}).strict();
