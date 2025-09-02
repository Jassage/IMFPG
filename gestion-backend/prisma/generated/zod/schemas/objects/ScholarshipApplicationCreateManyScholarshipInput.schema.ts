import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipApplicationCreateManyScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateManyScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateManyScholarshipInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish()
}).strict();
export const ScholarshipApplicationCreateManyScholarshipInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish()
}).strict();
