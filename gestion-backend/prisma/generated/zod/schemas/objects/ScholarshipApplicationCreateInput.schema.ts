import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema } from './ScholarshipCreateNestedOneWithoutApplicationsInput.schema';
import { StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema } from './StudentCreateNestedOneWithoutScholarshipApplicationsInput.schema';
import { ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInput.schema'

export const ScholarshipApplicationCreateInputObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateInput, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateInput> = z.object({
  id: z.string().optional(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  scholarship: z.lazy(() => ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema),
  student: z.lazy(() => StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema),
  documents: z.lazy(() => ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
export const ScholarshipApplicationCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  applicationDate: z.date(),
  motivation: z.string().nullish(),
  status: z.string(),
  reviewNotes: z.string().nullish(),
  scholarship: z.lazy(() => ScholarshipCreateNestedOneWithoutApplicationsInputObjectSchema),
  student: z.lazy(() => StudentCreateNestedOneWithoutScholarshipApplicationsInputObjectSchema),
  documents: z.lazy(() => ScholarshipDocumentCreateNestedManyWithoutScholarshipApplicationInputObjectSchema).optional()
}).strict();
