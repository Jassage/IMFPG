import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateManyFacultyLevelInputObjectSchema } from './CourseAssignmentCreateManyFacultyLevelInput.schema'

export const CourseAssignmentCreateManyFacultyLevelInputEnvelopeObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyFacultyLevelInputEnvelope, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyFacultyLevelInputEnvelope> = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyFacultyLevelInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CourseAssignmentCreateManyFacultyLevelInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyFacultyLevelInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
