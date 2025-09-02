import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutSchedulesInputObjectSchema } from './CourseAssignmentCreateWithoutSchedulesInput.schema';
import { CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutSchedulesInput.schema';
import { CourseAssignmentCreateOrConnectWithoutSchedulesInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutSchedulesInput.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema'

export const CourseAssignmentCreateNestedOneWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.CourseAssignmentCreateNestedOneWithoutSchedulesInput, z.ZodTypeDef, Prisma.CourseAssignmentCreateNestedOneWithoutSchedulesInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CourseAssignmentCreateOrConnectWithoutSchedulesInputObjectSchema).optional(),
  connect: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const CourseAssignmentCreateNestedOneWithoutSchedulesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CourseAssignmentCreateOrConnectWithoutSchedulesInputObjectSchema).optional(),
  connect: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).optional()
}).strict();
