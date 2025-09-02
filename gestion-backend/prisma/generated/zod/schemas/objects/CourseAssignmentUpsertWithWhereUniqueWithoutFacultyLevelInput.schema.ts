import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUpdateWithoutFacultyLevelInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutFacultyLevelInput.schema';
import { CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentCreateWithoutFacultyLevelInput.schema';
import { CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutFacultyLevelInput.schema'

export const CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInput, z.ZodTypeDef, Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutFacultyLevelInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema)])
}).strict();
export const CourseAssignmentUpsertWithWhereUniqueWithoutFacultyLevelInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutFacultyLevelInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema)])
}).strict();
