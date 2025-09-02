import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentUpdateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUpdateWithoutSchedulesInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutSchedulesInput.schema';
import { CourseAssignmentCreateWithoutSchedulesInputObjectSchema } from './CourseAssignmentCreateWithoutSchedulesInput.schema';
import { CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutSchedulesInput.schema';
import { CourseAssignmentWhereInputObjectSchema } from './CourseAssignmentWhereInput.schema'

export const CourseAssignmentUpsertWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpsertWithoutSchedulesInput, z.ZodTypeDef, Prisma.CourseAssignmentUpsertWithoutSchedulesInput> = z.object({
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutSchedulesInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema)]),
  where: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional()
}).strict();
export const CourseAssignmentUpsertWithoutSchedulesInputObjectZodSchema = z.object({
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutSchedulesInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema)]),
  where: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional()
}).strict();
