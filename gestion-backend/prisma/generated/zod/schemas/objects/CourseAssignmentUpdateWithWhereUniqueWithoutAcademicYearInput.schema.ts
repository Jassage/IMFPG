import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUpdateWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutAcademicYearInput.schema'

export const CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateWithWhereUniqueWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutAcademicYearInputObjectSchema)])
}).strict();
