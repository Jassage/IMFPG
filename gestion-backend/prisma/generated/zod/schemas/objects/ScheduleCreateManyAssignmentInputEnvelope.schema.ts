import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCreateManyAssignmentInputObjectSchema } from './ScheduleCreateManyAssignmentInput.schema'

export const ScheduleCreateManyAssignmentInputEnvelopeObjectSchema: z.ZodType<Prisma.ScheduleCreateManyAssignmentInputEnvelope, z.ZodTypeDef, Prisma.ScheduleCreateManyAssignmentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => ScheduleCreateManyAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateManyAssignmentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const ScheduleCreateManyAssignmentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => ScheduleCreateManyAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateManyAssignmentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
