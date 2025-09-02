import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const TranscriptCreateManyInputObjectSchema: z.ZodType<Prisma.TranscriptCreateManyInput, z.ZodTypeDef, Prisma.TranscriptCreateManyInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional()
}).strict();
export const TranscriptCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  semester: z.string(),
  academicYear: z.string(),
  gpa: z.number().nullish(),
  totalCredits: z.number().int().nullish(),
  creditsEarned: z.number().int().nullish(),
  generatedDate: z.date().optional()
}).strict();
