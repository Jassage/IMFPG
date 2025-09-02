import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentCreateManyStudentInputObjectSchema } from './EnrollmentCreateManyStudentInput.schema'

export const EnrollmentCreateManyStudentInputEnvelopeObjectSchema: z.ZodType<Prisma.EnrollmentCreateManyStudentInputEnvelope, z.ZodTypeDef, Prisma.EnrollmentCreateManyStudentInputEnvelope> = z.object({
  data: z.union([z.lazy(() => EnrollmentCreateManyStudentInputObjectSchema), z.lazy(() => EnrollmentCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const EnrollmentCreateManyStudentInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => EnrollmentCreateManyStudentInputObjectSchema), z.lazy(() => EnrollmentCreateManyStudentInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
