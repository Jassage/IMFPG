import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentScalarWhereInputObjectSchema } from './CourseAssignmentScalarWhereInput.schema';
import { CourseAssignmentUpdateManyMutationInputObjectSchema } from './CourseAssignmentUpdateManyMutationInput.schema';
import { CourseAssignmentUncheckedUpdateManyWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedUpdateManyWithoutAcademicYearInput.schema'

export const CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateManyWithWhereWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateManyMutationInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateManyWithoutAcademicYearInputObjectSchema)])
}).strict();
