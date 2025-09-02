import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { AttendanceCreateManyStudentInputObjectSchema } from './AttendanceCreateManyStudentInput.schema'

export const AttendanceCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.AttendanceCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.AttendanceCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => AttendanceCreateManyStudentInputObjectSchema), z.lazy(() => AttendanceCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const AttendanceCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => AttendanceCreateManyStudentInputObjectSchema), z.lazy(() => AttendanceCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
