import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutFacultyInputObjectSchema } from './CourseAssignmentUpdateWithoutFacultyInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutFacultyInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutFacultyInput.schema';
import { CourseAssignmentCreateWithoutFacultyInputObjectSchema } from './CourseAssignmentCreateWithoutFacultyInput.schema';
import { CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutFacultyInput.schema'

export const CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInput, z.ZodTypeDef, Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutFacultyInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
export const CourseAssignmentUpsertWithWhereUniqueWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutFacultyInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
