import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeCreateManyStudentInputObjectSchema } from './RetakeCreateManyStudentInput.schema'

export const RetakeCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.RetakeCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.RetakeCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => RetakeCreateManyStudentInputObjectSchema), z.lazy(() => RetakeCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const RetakeCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => RetakeCreateManyStudentInputObjectSchema), z.lazy(() => RetakeCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
