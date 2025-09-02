import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInput.schema'

export const ScholarshipApplicationUncheckedCreateInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUncheckedCreateInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  documents: z.lazy(() => ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationUncheckedCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  documents: z.lazy(() => ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
