import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScholarshipApplicationCreateManyStudentInputObjectSchema } from './ScholarshipApplicationCreateManyStudentInput.schema'

export const ScholarshipApplicationCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.ScholarshipApplicationCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.ScholarshipApplicationCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => ScholarshipApplicationCreateManyStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ScholarshipApplicationCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => ScholarshipApplicationCreateManyStudentInputObjectSchema), z.lazy(() => ScholarshipApplicationCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
