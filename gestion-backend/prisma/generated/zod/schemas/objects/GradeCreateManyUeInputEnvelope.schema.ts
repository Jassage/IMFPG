import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateManyUeInputObjectSchema } from './GradeCreateManyUeInput.schema'

export const GradeCreateManyUeInputEnvelopeObjectSchema: z.ZodType<Prisma.GradeCreateManyUeInputEnvelope, z.ZodTypeDef, Prisma.GradeCreateManyUeInputEnvelope> = z.object({
  data: z.union([z.lazy(() => GradeCreateManyUeInputObjectSchema), z.lazy(() => GradeCreateManyUeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const GradeCreateManyUeInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => GradeCreateManyUeInputObjectSchema), z.lazy(() => GradeCreateManyUeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
