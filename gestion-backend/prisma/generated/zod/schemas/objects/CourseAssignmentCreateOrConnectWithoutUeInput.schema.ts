import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentCreateWithoutUeInputObjectSchema } from './CourseAssignmentCreateWithoutUeInput.schema';
import { CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutUeInput.schema'

export const CourseAssignmentCreateOrConnectWithoutUeInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateOrConnectWithoutUeInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateOrConnectWithoutUeInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
export const CourseAssignmentCreateOrConnectWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
