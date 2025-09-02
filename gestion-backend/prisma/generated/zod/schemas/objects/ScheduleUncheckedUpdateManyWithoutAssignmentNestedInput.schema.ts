import { z } from 'zod';
import type { Prisma } from '../../../../../generated/prisma';
import { ScheduleCreateWithoutAssignmentInputObjectSchema } from './ScheduleCreateWithoutAssignmentInput.schema';
import { ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema } from './ScheduleUncheckedCreateWithoutAssignmentInput.schema';
import { ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema } from './ScheduleCreateOrConnectWithoutAssignmentInput.schema';
import { ScheduleUpsertWithWhereUniqueWithoutAssignmentInputObjectSchema } from './ScheduleUpsertWithWhereUniqueWithoutAssignmentInput.schema';
import { ScheduleCreateManyAssignmentInputEnvelopeObjectSchema } from './ScheduleCreateManyAssignmentInputEnvelope.schema';
import { ScheduleWhereUniqueInputObjectSchema } from './ScheduleWhereUniqueInput.schema';
import { ScheduleUpdateWithWhereUniqueWithoutAssignmentInputObjectSchema } from './ScheduleUpdateWithWhereUniqueWithoutAssignmentInput.schema';
import { ScheduleUpdateManyWithWhereWithoutAssignmentInputObjectSchema } from './ScheduleUpdateManyWithWhereWithoutAssignmentInput.schema';
import { ScheduleScalarWhereInputObjectSchema } from './ScheduleScalarWhereInput.schema'

export const ScheduleUncheckedUpdateManyWithoutAssignmentNestedInputObjectSchema: z.ZodType<Prisma.ScheduleUncheckedUpdateManyWithoutAssignmentNestedInput, z.ZodTypeDef, Prisma.ScheduleUncheckedUpdateManyWithoutAssignmentNestedInput> = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema).array(), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScheduleUpsertWithWhereUniqueWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUpsertWithWhereUniqueWithoutAssignmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScheduleCreateManyAssignmentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScheduleUpdateWithWhereUniqueWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUpdateWithWhereUniqueWithoutAssignmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScheduleUpdateManyWithWhereWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUpdateManyWithWhereWithoutAssignmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScheduleScalarWhereInputObjectSchema), z.lazy(() => ScheduleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ScheduleUncheckedUpdateManyWithoutAssignmentNestedInputObjectZodSchema = z.object({
  create: z.union([z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateWithoutAssignmentInputObjectSchema).array(), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUncheckedCreateWithoutAssignmentInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleCreateOrConnectWithoutAssignmentInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ScheduleUpsertWithWhereUniqueWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUpsertWithWhereUniqueWithoutAssignmentInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ScheduleCreateManyAssignmentInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ScheduleWhereUniqueInputObjectSchema), z.lazy(() => ScheduleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ScheduleUpdateWithWhereUniqueWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUpdateWithWhereUniqueWithoutAssignmentInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ScheduleUpdateManyWithWhereWithoutAssignmentInputObjectSchema), z.lazy(() => ScheduleUpdateManyWithWhereWithoutAssignmentInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ScheduleScalarWhereInputObjectSchema), z.lazy(() => ScheduleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
