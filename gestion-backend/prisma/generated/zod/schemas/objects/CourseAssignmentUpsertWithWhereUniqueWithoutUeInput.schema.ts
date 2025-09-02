import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateWithoutUeInputObjectSchema } from './CourseAssignmentUpdateWithoutUeInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutUeInput.schema';
import { CourseAssignmentCreateWithoutUeInputObjectSchema } from './CourseAssignmentCreateWithoutUeInput.schema';
import { CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutUeInput.schema'

export const CourseAssignmentUpsertWithWhereUniqueWithoutUeInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutUeInput, z.ZodTypeDef, Prisma.CourseAssignmentUpsertWithWhereUniqueWithoutUeInput> = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutUeInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
export const CourseAssignmentUpsertWithWhereUniqueWithoutUeInputObjectZodSchema = z.object({
  where: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CourseAssignmentUpdateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutUeInputObjectSchema)]),
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutUeInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutUeInputObjectSchema)])
}).strict();
