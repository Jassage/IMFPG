import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleUpdateWithoutAssignmentInputObjectSchema } from './ScheduleUpdateWithoutAssignmentInput.schema';
import { ScheduleUncheckedUpdateWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedUpdateWithoutAssignmentInput.schema'

export const ScheduleUpdateWithWhereUniqueWithoutAssignmentInputObjectSchema: z.ZodType<Prisma.ScheduleUpdateWithWhereUniqueWithoutAssignmentInput, z.ZodTypeDef, Prisma.ScheduleUpdateWithWhereUniqueWithoutAssignmentInput> = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScheduleUpdateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAssignmentInputObjectSchema)])
}).strict();
export const ScheduleUpdateWithWhereUniqueWithoutAssignmentInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ScheduleUpdateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAssignmentInputObjectSchema)])
}).strict();
