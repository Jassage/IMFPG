import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteCreateManyUeInputObjectSchema } from './UEPrerequisiteCreateManyUeInput.schema'

export const UEPrerequisiteCreateManyUeInputEnvelopeObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateManyUeInputEnvelope, z.ZodTypeDef, Prisma.UEPrerequisiteCreateManyUeInputEnvelope> = z.object({
  data: z.union([z.lazy(() => UEPrerequisiteCreateManyUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateManyUeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const UEPrerequisiteCreateManyUeInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => UEPrerequisiteCreateManyUeInputObjectSchema), z.lazy(() => UEPrerequisiteCreateManyUeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
