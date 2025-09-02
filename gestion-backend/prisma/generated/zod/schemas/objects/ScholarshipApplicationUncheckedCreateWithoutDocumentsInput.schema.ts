import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';


export const ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUncheckedCreateWithoutDocumentsInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUncheckedCreateWithoutDocumentsInput> = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish()
}).strict();
export const ScholarshipApplicationUncheckedCreateWithoutDocumentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish()
}).strict();
