import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipApplicationCreateManyStudentInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateManyStudentInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateManyStudentInput> = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish()
}).strict();
export const ScholarshipApplicationCreateManyStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish()
}).strict();
