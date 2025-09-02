import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateManyProfesseurInputObjectSchema } from './CourseAssignmentCreateManyProfesseurInput.schema'

export const CourseAssignmentCreateManyProfesseurInputEnvelopeObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyProfesseurInputEnvelope, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyProfesseurInputEnvelope> = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyProfesseurInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CourseAssignmentCreateManyProfesseurInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyProfesseurInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyProfesseurInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
