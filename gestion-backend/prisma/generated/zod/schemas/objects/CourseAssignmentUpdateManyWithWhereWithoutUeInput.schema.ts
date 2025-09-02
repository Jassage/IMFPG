import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema';
import { CourseAssignmentUpdateManyMutationInputObjectSchema } from './CourseAssignmentUpdateManyMutationInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutUeInput.schema'

export const CourseAssignmentUpdateManyWithWhereWithoutUeInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateManyWithWhereWithoutUeInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateManyWithWhereWithoutUeInput> = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutUeInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateManyWithWhereWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutUeInputObjectSchema)])
}).strict();
