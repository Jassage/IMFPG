import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutUeInputObjectSchema } from './CourseAssignmentUpdateWithoutUeInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutUeInput.schema'

export const CourseAssignmentUpdateWithWhereUniqueWithoutUeInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutUeInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateWithWhereUniqueWithoutUeInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutUeInputObjectSchema)])
}).strict();
export const CourseAssignmentUpdateWithWhereUniqueWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CourseAssignmentUpdateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutUeInputObjectSchema)])
}).strict();
