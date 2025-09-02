import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutFacultyInputObjectSchema } from './CourseAssignmentUpdateWithoutFacultyInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutFacultyInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutFacultyInput.schema'

export const CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutFacultyInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateWithWhereUniqueWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutFacultyInputObjectSchema)])
}).strict();
