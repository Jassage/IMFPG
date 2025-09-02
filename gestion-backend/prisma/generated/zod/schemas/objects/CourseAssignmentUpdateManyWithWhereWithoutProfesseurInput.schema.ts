import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema';
import { CourseAssignmentUpdateManyMutationInputObjectSchema } from './CourseAssignmentUpdateManyMutationInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutProfesseurInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutProfesseurInput.schema'

export const CourseAssignmentUpdateManyWithWhereWithoutProfesseurInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateManyWithWhereWithoutProfesseurInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateManyWithWhereWithoutProfesseurInput> = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutProfesseurInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateManyWithWhereWithoutProfesseurInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutProfesseurInputObjectSchema)])
}).strict();
