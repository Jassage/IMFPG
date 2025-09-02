import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereInputObjectSchema } from './CourseAssignmentWhereInput.schema';
import { CourseAssignmentUpdateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUpdateWithoutSchedulesInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutSchedulesInput.schema'

export const CourseAssignmentUpdateToOneWithWhereWithoutSchedulesInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateToOneWithWhereWithoutSchedulesInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateToOneWithWhereWithoutSchedulesInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutSchedulesInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateToOneWithWhereWithoutSchedulesInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutSchedulesInputObjectSchema)])
}).strict();
