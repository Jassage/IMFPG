import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { RetakeCreateManyUeInputObjectSchema } from './RetakeCreateManyUeInput.schema'

export const RetakeCreateManyUeInputEnvelopeObjectSchema: z.ZodType<Prisma.RetakeCreateManyUeInputEnvelope, z.ZodTypeDef, Prisma.RetakeCreateManyUeInputEnvelope> = z.object({
  data: z.union([z.lazy(() => RetakeCreateManyUeInputObjectSchema), z.lazy(() => RetakeCreateManyUeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const RetakeCreateManyUeInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => RetakeCreateManyUeInputObjectSchema), z.lazy(() => RetakeCreateManyUeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
