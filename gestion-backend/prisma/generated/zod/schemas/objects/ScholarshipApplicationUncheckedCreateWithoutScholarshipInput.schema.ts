import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInput.schema'

export const ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUncheckedCreateWithoutScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUncheckedCreateWithoutScholarshipInput> = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  documents: z.lazy(() => ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationUncheckedCreateWithoutScholarshipInputObjectZodSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  documents: z.lazy(() => ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
