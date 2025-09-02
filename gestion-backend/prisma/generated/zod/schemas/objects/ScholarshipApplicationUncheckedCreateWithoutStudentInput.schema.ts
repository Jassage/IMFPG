import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInput.schema'

export const ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationUncheckedCreateWithoutStudentInput, z.ZodTypeDef, Prisma.ScholarshipApplicationUncheckedCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  documents: z.lazy(() => ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationUncheckedCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  scholarshipId: z.string(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  documents: z.lazy(() => ScholarshipDocumentUncheckedCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
