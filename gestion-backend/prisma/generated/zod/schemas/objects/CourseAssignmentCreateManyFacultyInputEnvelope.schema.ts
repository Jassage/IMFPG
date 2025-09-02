import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateManyFacultyInputObjectSchema } from './CourseAssignmentCreateManyFacultyInput.schema'

export const CourseAssignmentCreateManyFacultyInputEnvelopeObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyFacultyInputEnvelope, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyFacultyInputEnvelope> = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyFacultyInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CourseAssignmentCreateManyFacultyInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyFacultyInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyFacultyInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
