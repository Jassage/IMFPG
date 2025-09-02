import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { EnrollmentCreateManyAcademicYearInputObjectSchema } from './EnrollmentCreateManyAcademicYearInput.schema'

export const EnrollmentCreateManyAcademicYearInputEnvelopeObjectSchema: z.ZodType<Prisma.EnrollmentCreateManyAcademicYearInputEnvelope, z.ZodTypeDef, Prisma.EnrollmentCreateManyAcademicYearInputEnvelope> = z.object({
  data: z.union([z.lazy(() => EnrollmentCreateManyAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const EnrollmentCreateManyAcademicYearInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => EnrollmentCreateManyAcademicYearInputObjectSchema), z.lazy(() => EnrollmentCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
