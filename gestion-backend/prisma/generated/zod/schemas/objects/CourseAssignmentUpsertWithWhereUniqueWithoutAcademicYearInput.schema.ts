import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUpdateWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutAcademicYearInput.schema';
import { CourseAssignmentCreateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentCreateWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutAcademicYearInput.schema'

export const CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const CourseAssignmentUpsertWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutAcademicYearInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
