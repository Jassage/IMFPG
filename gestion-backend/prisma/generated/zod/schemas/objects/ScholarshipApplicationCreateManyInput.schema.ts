import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipApplicationCreateManyInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateManyInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateManyInput> = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish()
}).strict();
export const ScholarshipApplicationCreateManyInputObjectZodSchema = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish()
}).strict();
