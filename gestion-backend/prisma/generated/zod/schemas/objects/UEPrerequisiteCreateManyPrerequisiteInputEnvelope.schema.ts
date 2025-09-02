import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { UEPrerequisiteCreateManyPrerequisiteInputObjectSchema } from './UEPrerequisiteCreateManyPrerequisiteInput.schema'

export const UEPrerequisiteCreateManyPrerequisiteInputEnvelopeObjectSchema: z.ZodType<Prisma.UEPrerequisiteCreateManyPrerequisiteInputEnvelope, z.ZodTypeDef, Prisma.UEPrerequisiteCreateManyPrerequisiteInputEnvelope> = z.object({
  data: z.union([z.lazy(() => UEPrerequisiteCreateManyPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateManyPrerequisiteInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const UEPrerequisiteCreateManyPrerequisiteInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => UEPrerequisiteCreateManyPrerequisiteInputObjectSchema), z.lazy(() => UEPrerequisiteCreateManyPrerequisiteInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
