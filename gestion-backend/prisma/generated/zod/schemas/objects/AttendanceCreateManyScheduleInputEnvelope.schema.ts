import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceCreateManyScheduleInputObjectSchema } from './AttendanceCreateManyScheduleInput.schema'

export const AttendanceCreateManyScheduleInputEnvelopeObjectSchema: z.ZodType<Prisma.AttendanceCreateManyScheduleInputEnvelope, z.ZodTypeDef, Prisma.AttendanceCreateManyScheduleInputEnvelope> = z.object({
  data: z.union([z.lazy(() => AttendanceCreateManyScheduleInputObjectSchema), z.lazy(() => AttendanceCreateManyScheduleInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AttendanceCreateManyScheduleInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => AttendanceCreateManyScheduleInputObjectSchema), z.lazy(() => AttendanceCreateManyScheduleInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
