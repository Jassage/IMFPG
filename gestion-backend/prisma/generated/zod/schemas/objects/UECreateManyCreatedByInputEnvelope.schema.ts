import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UECreateManyCreatedByInputObjectSchema } from './UECreateManyCreatedByInput.schema'

export const UECreateManyCreatedByInputEnvelopeObjectSchema: z.ZodType<Prisma.UECreateManyCreatedByInputEnvelope, z.ZodTypeDef, Prisma.UECreateManyCreatedByInputEnvelope> = z.object({
  data: z.union([z.lazy(() => UECreateManyCreatedByInputObjectSchema), z.lazy(() => UECreateManyCreatedByInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const UECreateManyCreatedByInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => UECreateManyCreatedByInputObjectSchema), z.lazy(() => UECreateManyCreatedByInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
