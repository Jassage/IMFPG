import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { GradeCreateManyStudentInputObjectSchema } from './GradeCreateManyStudentInput.schema'

export const GradeCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.GradeCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.GradeCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => GradeCreateManyStudentInputObjectSchema), z.lazy(() => GradeCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const GradeCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => GradeCreateManyStudentInputObjectSchema), z.lazy(() => GradeCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
