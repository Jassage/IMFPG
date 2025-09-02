import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCreateManyProfesseurInputObjectSchema } from './ScheduleCreateManyProfesseurInput.schema'

export const ScheduleCreateManyProfesseurInputEnvelopeObjectSchema: z.ZodType<Prisma.ScheduleCreateManyProfesseurInputEnvelope, z.ZodTypeDef, Prisma.ScheduleCreateManyProfesseurInputEnvelope> = z.object({
  data: z.union([z.lazy(() => ScheduleCreateManyProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateManyProfesseurInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ScheduleCreateManyProfesseurInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => ScheduleCreateManyProfesseurInputObjectSchema), z.lazy(() => ScheduleCreateManyProfesseurInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
