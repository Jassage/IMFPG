import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema } from './ScholarshipCreateNestedOneWithoutApplicationsInput.schema';
import { StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema } from './StudentCreateNestedOneWithoutScholarshipApplicationsInput.schema'

export const ScholarshipApplicationCreateWithoutDocumentsInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateWithoutDocumentsInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateWithoutDocumentsInput> = z.object({
  id: z.string().optional(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  scholarship: z.lazy(() => ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema),
  student: z.lazy(() => StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema)
}).strict();
export const ScholarshipApplicationCreateWithoutDocumentsInputObjectZodSchema = z.object({
  id: z.string().optional(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  scholarship: z.lazy(() => ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema),
  student: z.lazy(() => StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema)
}).strict();
