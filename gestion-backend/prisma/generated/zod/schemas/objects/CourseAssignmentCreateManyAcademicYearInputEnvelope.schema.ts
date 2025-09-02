import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateManyAcademicYearInputObjectSchema } from './CourseAssignmentCreateManyAcademicYearInput.schema'

export const CourseAssignmentCreateManyAcademicYearInputEnvelopeObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyAcademicYearInputEnvelope, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyAcademicYearInputEnvelope> = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CourseAssignmentCreateManyAcademicYearInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyAcademicYearInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
