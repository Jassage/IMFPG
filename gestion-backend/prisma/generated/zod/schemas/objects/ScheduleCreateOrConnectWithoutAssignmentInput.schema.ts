import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleCreateWithoutAssignmentInputObjectSchema } from './ScheduleCreateWithoutAssignmentInput.schema';
import { ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedCreateWithoutAssignmentInput.schema'

export const ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema: z.ZodType<Prisma.ScheduleCreateOrConnectWithoutAssignmentInput, z.ZodTypeDef, Prisma.ScheduleCreateOrConnectWithoutAssignmentInput> = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema)])
}).strict();
export const ScheduleCreateOrConnectWithoutAssignmentInputObjectZodSchema = z.object({
  where: z.lazy(() => ScheduleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema)])
}).strict();
