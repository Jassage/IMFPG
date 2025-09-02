import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentCreateWithoutSchedulesInputObjectSchema } from './CourseAssignmentCreateWithoutSchedulesInput.schema';
import { CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutSchedulesInput.schema'

export const CourseAssignmentCreateOrConnectWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateOrConnectWithoutSchedulesInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateOrConnectWithoutSchedulesInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema)])
}).strict();
export const CourseAssignmentCreateOrConnectWithoutSchedulesInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema)])
}).strict();
