import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema } from './ScholarshipCreateNestedOneWithoutApplicationsInput.schema';
import { ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInput.schema'

export const ScholarshipApplicationCreateWithoutStudentInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateWithoutStudentInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateWithoutStudentInput> = z.object({
  id: z.string().optional(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  scholarship: z.lazy(() => ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema),
  documents: z.lazy(() => ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationCreateWithoutStudentInputObjectZodSchema = z.object({
  id: z.string().optional(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  scholarship: z.lazy(() => ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema),
  documents: z.lazy(() => ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
