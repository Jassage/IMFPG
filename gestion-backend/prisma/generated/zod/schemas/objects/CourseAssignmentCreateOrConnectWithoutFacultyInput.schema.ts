import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentCreateWithoutFacultyInputObjectSchema } from './CourseAssignmentCreateWithoutFacultyInput.schema';
import { CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutFacultyInput.schema'

export const CourseAssignmentCreateOrConnectWithoutFacultyInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateOrConnectWithoutFacultyInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateOrConnectWithoutFacultyInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
export const CourseAssignmentCreateOrConnectWithoutFacultyInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyInputObjectSchema)])
}).strict();
