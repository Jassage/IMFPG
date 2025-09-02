import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateManyUeInputObjectSchema } from './CourseAssignmentCreateManyUeInput.schema'

export const CourseAssignmentCreateManyUeInputEnvelopeObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateManyUeInputEnvelope, z.ZodTypeDef, Prisma.CourseAssignmentCreateManyUeInputEnvelope> = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyUeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const CourseAssignmentCreateManyUeInputEnvelopeObjectZodSchema = z.object({
  data: z.union([z.lazy(() => CourseAssignmentCreateManyUeInputObjectSchema), z.lazy(() => CourseAssignmentCreateManyUeInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
