import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema } from './StudentCreateNestedOneWithoutScholarshipApplicationsInput.schema';
import { ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInput.schema'

export const ScholarshipApplicationCreateWithoutScholarshipInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateWithoutScholarshipInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateWithoutScholarshipInput> = z.object({
  id: z.string().optional(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  student: z.lazy(() => StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema),
  documents: z.lazy(() => ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationCreateWithoutScholarshipInputObjectZodSchema = z.object({
  id: z.string().optional(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  student: z.lazy(() => StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema),
  documents: z.lazy(() => ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
