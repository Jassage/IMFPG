import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateNestedOneWithoutDocumentsInputObjectSchema } from './ScholarshipApplicationCreateNestedOneWithoutDocumentsInput.schema'

export const ScholarshipDocumentCreateInputObjectSchema: z.ZodType<Prisma.ScholarshipDocumentCreateInput, z.ZodTypeDef, Prisma.ScholarshipDocumentCreateInput> = z.object({
  id: z.string().optional(),
  url: z.string(),
  scholarshipApplication: z.lazy(() => ScholarshipApplicationCreateNestedOneWithoutDocumentsInputObjectSchema)
}).strict();
export const ScholarshipDocumentCreateInputObjectZodSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  scholarshipApplication: z.lazy(() => ScholarshipApplicationCreateNestedOneWithoutDocumentsInputObjectSchema)
}).strict();
