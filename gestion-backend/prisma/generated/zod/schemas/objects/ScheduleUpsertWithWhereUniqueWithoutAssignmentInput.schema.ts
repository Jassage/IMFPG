import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleUpdateWithoutAssignmentInputObjectSchema } from './ScheduleUpdateWithoutAssignmentInput.schema';
import { ScheduleUncheckedUpdateWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedUpdateWithoutAssignmentInput.schema';
import { ScheduleCreateWithoutAssignmentInputObjectSchema } from './ScheduleCreateWithoutAssignmentInput.schema';
import { ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedCreateWithoutAssignmentInput.schema'

export const ScheduleUpsertWithWhereUniqueWithoutAssignmentInputObjectSchema: z.ZodType<Prisma.ScheduleUpsertWithWhereUniqueWithoutAssignmentInput, z.ZodTypeDef, Prisma.ScheduleUpsertWithWhereUniqueWithoutAssignmentInput> = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScheduleUpdateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAssignmentInputObjectSchema)]),
  create: z.union([z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema)])
}).strict();
export const ScheduleUpsertWithWhereUniqueWithoutAssignmentInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ScheduleUpdateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAssignmentInputObjectSchema)]),
  create: z.union([z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema)])
}).strict();
