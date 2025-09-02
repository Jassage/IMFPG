import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentCreateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentCreateWithoutAcademicYearInput.schema';
import { CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutAcademicYearInput.schema'

export const CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateOrConnectWithoutAcademicYearInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateOrConnectWithoutAcademicYearInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
export const CourseAssignmentCreateOrConnectWithoutAcademicYearInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutAcademicYearInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutAcademicYearInputObjectSchema)])
}).strict();
