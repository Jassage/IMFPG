import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateManyScholarshipInputObjectSchema } from './ScholarshipApplicationCreateManyScholarshipInput.schema'

export const ScholarshipApplicationCreateManyScholarshipInputEnvelopeObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateManyScholarshipInputEnvelope, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateManyScholarshipInputEnvelope> = z.object({
  data: z.union([z.lazy(() => ScholarshipApplicationCreateManyScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateManyScholarshipInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ScholarshipApplicationCreateManyScholarshipInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => ScholarshipApplicationCreateManyScholarshipInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateManyScholarshipInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
