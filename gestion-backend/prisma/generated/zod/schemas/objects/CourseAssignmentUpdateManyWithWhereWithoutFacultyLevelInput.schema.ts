import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema';
import { CourseAssignmentUpdateManyMutationInputObjectSchema } from './CourseAssignmentUpdateManyMutationInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelInput.schema'

export const CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInput> = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateManyWithWhereWithoutFacultyLevelInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutFacultyLevelInputObjectSchema)])
}).strict();
