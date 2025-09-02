import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentCreateWithoutFacultyLevelInput.schema';
import { CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutFacultyLevelInput.schema'

export const CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateOrConnectWithoutFacultyLevelInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateOrConnectWithoutFacultyLevelInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema)])
}).strict();
export const CourseAssignmentCreateOrConnectWithoutFacultyLevelInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutFacultyLevelInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutFacultyLevelInputObjectSchema)])
}).strict();
