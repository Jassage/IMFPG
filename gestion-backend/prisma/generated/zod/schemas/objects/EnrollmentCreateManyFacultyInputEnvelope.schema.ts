import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentCreateManyFacultyInputObjectSchema } from './EnrollmentCreateManyFacultyInput.schema'

export const EnrollmentCreateManyFacultyInputEnvelopeObjectSchema: z.ZodType<Prisma.EnrollmentCreateManyFacultyInputEnvelope, z.ZodTypeDef, Prisma.EnrollmentCreateManyFacultyInputEnvelope> = z.object({
  data: z.union([z.lazy(() => EnrollmentCreateManyFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateManyFacultyInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const EnrollmentCreateManyFacultyInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => EnrollmentCreateManyFacultyInputObjectSchema), z.lazy(() => EnrollmentCreateManyFacultyInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
