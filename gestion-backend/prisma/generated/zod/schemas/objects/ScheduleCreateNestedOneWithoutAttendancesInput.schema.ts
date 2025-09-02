import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCreateWithoutAttendancesInputObjectSchema } from './ScheduleCreateWithoutAttendancesInput.schema';
import { ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema } from './ScheduleUncheckedCreateWithoutAttendancesInput.schema';
import { ScheduleCreateOrConnectWithoutAttendancesInputObjectSchema } from './ScheduleCreateOrConnectWithoutAttendancesInput.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema'

export const ScheduleCreateNestedOneWithoutAttendancesInputObjectSchema: z.ZodType<Prisma.ScheduleCreateNestedOneWithoutAttendancesInput, z.ZodTypeDef, Prisma.ScheduleCreateNestedOneWithoutAttendancesInput> = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScheduleCreateOrConnectWithoutAttendancesInputObjectSchema).optional(),
  connect: z.lazy(() => ScheduleWhereUniqueInputObjectSchema).optional()
}).strict();
export const ScheduleCreateNestedOneWithoutAttendancesInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScheduleCreateOrConnectWithoutAttendancesInputObjectSchema).optional(),
  connect: z.lazy(() => ScheduleWhereUniqueInputObjectSchema).optional()
}).strict();
