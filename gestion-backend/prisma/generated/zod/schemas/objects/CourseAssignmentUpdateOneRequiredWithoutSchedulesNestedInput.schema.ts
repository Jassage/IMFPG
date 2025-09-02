import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { CourseAssignmentCreateWithoutSchedulesInputObjectSchema } from './CourseAssignmentCreateWithoutSchedulesInput.schema';
import { CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUncheckedCreateWithoutSchedulesInput.schema';
import { CourseAssignmentCreateOrConnectWithoutSchedulesInputObjectSchema } from './CourseAssignmentCreateOrConnectWithoutSchedulesInput.schema';
import { CourseAssignmentUpsertWithoutSchedulesInputObjectSchema } from './CourseAssignmentUpsertWithoutSchedulesInput.schema';
import { CourseAssignmentWhereUniqueInputObjectSchema } from './CourseAssignmentWhereUniqueInput.schema';
import { CourseAssignmentUpdateToOneWithWhereWithoutSchedulesInputObjectSchema } from './CourseAssignmentUpdateToOneWithWhereWithoutSchedulesInput.schema';
import { CourseAssignmentUpdateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUpdateWithoutSchedulesInput.schema';
import { CourseAssignmentUncheckedUpdateWithoutSchedulesInputObjectSchema } from './CourseAssignmentUncheckedUpdateWithoutSchedulesInput.schema'

export const CourseAssignmentUpdateOneRequiredWithoutSchedulesNestedInputObjectSchema: z.ZodType<Prisma.CourseAssignmentUpdateOneRequiredWithoutSchedulesNestedInput, z.ZodTypeDef, Prisma.CourseAssignmentUpdateOneRequiredWithoutSchedulesNestedInput> = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CourseAssignmentCreateOrConnectWithoutSchedulesInputObjectSchema).optional(),
  upsert: z.lazy(() => CourseAssignmentUpsertWithoutSchedulesInputObjectSchema).optional(),
  connect: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateToOneWithWhereWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutSchedulesInputObjectSchema)]).optional()
}).strict();
export const CourseAssignmentUpdateOneRequiredWithoutSchedulesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => CourseAssignmentCreateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedCreateWithoutSchedulesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CourseAssignmentCreateOrConnectWithoutSchedulesInputObjectSchema).optional(),
  upsert: z.lazy(() => CourseAssignmentUpsertWithoutSchedulesInputObjectSchema).optional(),
  connect: z.lazy(() => CourseAssignmentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CourseAssignmentUpdateToOneWithWhereWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUpdateWithoutSchedulesInputObjectSchema), z.lazy(() => CourseAssignmentUncheckedUpdateWithoutSchedulesInputObjectSchema)]).optional()
}).strict();
