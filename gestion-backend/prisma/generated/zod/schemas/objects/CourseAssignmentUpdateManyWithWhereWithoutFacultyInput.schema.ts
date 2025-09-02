import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema';
import { CourseAssignmentUpdateManyMutationInputObjectSchema } from './CourseAssignmentUpdateManyMutationInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutFacultyInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutFacultyInput.schema'

export const CourseAssignmentUpdateManyWithWhereWithoutFacultyInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateManyWithWhereWithoutFacultyInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateManyWithWhereWithoutFacultyInput> = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateManyWithWhereWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyInputObjectSchema)])
}).strict();
