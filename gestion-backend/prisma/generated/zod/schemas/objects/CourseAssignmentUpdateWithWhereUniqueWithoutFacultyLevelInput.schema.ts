import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUpdateWithoutFacultyLevelInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutFacultyLevelInput.schema'

export const CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutFacultyLevelInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateWithWhereUniqueWithoutFacultyLevelInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutFacultyLevelInputObjectSchema)])
}).strict();
