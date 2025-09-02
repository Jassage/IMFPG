import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCreateWithoutAttendancesInputObjectSchema } from './ScheduleCreateWithoutAttendancesInput.schema';
import { ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema } from './ScheduleUncheckedCreateWithoutAttendancesInput.schema';
import { ScheduleCreateOrConnectWithoutAttendancesInputObjectSchema } from './ScheduleCreateOrConnectWithoutAttendancesInput.schema';
import { ScheduleUpsertWithoutAttendancesInputObjectSchema } from './ScheduleUpsertWithoutAttendancesInput.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleUpdateToOneWithWhereWithoutAttendancesInputObjectSchema } from './ScheduleUpdateToOneWithWhereWithoutAttendancesInput.schema';
import { ScheduleUpdateWithoutAttendancesInputObjectSchema } from './ScheduleUpdateWithoutAttendancesInput.schema';
import { ScheduleUncheckedUpdateWithoutAttendancesInputObjectSchema } from './ScheduleUncheckedUpdateWithoutAttendancesInput.schema'

export const ScheduleUpdateOneRequiredWithoutAttendancesNestedInputObjectSchema: z.ZodType<Prisma.ScheduleUpdateOneRequiredWithoutAttendancesNestedInput, z.ZodTypeDef, Prisma.ScheduleUpdateOneRequiredWithoutAttendancesNestedInput> = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScheduleCreateOrConnectWithoutAttendancesInputObjectSchema).optional(),
  upsert: z.lazy(() => ScheduleUpsertWithoutAttendancesInputObjectSchema).optional(),
  connect: z.lazy(() => ScheduleWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ScheduleUpdateToOneWithWhereWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAttendancesInputObjectSchema)]).optional()
}).strict();
export const ScheduleUpdateOneRequiredWithoutAttendancesNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAttendancesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ScheduleCreateOrConnectWithoutAttendancesInputObjectSchema).optional(),
  upsert: z.lazy(() => ScheduleUpsertWithoutAttendancesInputObjectSchema).optional(),
  connect: z.lazy(() => ScheduleWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ScheduleUpdateToOneWithWhereWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUpdateWithoutAttendancesInputObjectSchema), z.lazy(() => ScheduleUncheckedUpdateWithoutAttendancesInputObjectSchema)]).optional()
}).strict();
