import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipDocumentCreateManyScholarshipApplicationInputObjectSchema } from './ScholarshipDocumentCreateManyScholarshipApplicationInput.schema'

export const ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelopeObjectSchema: z.ZodType<Prisma.ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelope, z.ZodTypeDef, Prisma.ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelope> = z.object({
  data: z.union([z.lazy(() => ScholarshipDocumentCreateManyScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateManyScholarshipApplicationInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ScholarshipDocumentCreateManyScholarshipApplicationInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => ScholarshipDocumentCreateManyScholarshipApplicationInputObjectSchema), z.lazy(() => ScholarshipDocumentCreateManyScholarshipApplicationInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
